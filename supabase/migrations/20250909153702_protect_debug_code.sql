-- PROTECT DEBUG CODE FROM BEING ISSUED AS NON-DEBUG
-- Idempotent-safe where possible

-- Essentials
create extension if not exists pgcrypto;

-- 2.1) Ensure core table exists (adjust if your schema differs)
-- (If you already have access_codes, these CREATEs won't run.)
do $$
begin
  if not exists (
    select 1 from information_schema.tables
    where table_schema='public' and table_name='access_codes'
  ) then
    create table public.access_codes (
      code_id uuid primary key default gen_random_uuid(),
      code_type text not null check (code_type in ('beta','patreon','debug')),
      hash bytea not null,
      salt bytea not null,
      is_single_session boolean default true,
      is_active boolean default true,
      issued_to text,
      created_at timestamptz default now()
    );
  end if;
end$$;

-- 2.2) Deterministic fingerprint column to recognize the specific code (never store plaintext)
alter table public.access_codes
  add column if not exists code_fingerprint bytea;

-- Unique when present (lets old rows be null)
create unique index if not exists uq_access_codes_fingerprint
  on public.access_codes (code_fingerprint)
  where code_fingerprint is not null;

-- 2.3) Protected list of code fingerprints, mapping to their only allowed type
create table if not exists public.protected_codes (
  code_fingerprint bytea primary key,
  allowed_type text not null check (allowed_type in ('debug','beta','patreon'))
);

-- 2.4) Safe creation function: computes salted hash + deterministic fingerprint
create or replace function public.create_access_code(
  p_code text,
  p_code_type text,               -- 'beta' | 'patreon' | 'debug'
  p_is_single_session boolean default true,
  p_issued_to text default null
)
returns uuid
language plpgsql
as $$
declare
  v_salt bytea := gen_random_bytes(32);
  v_hash bytea := digest(p_code || encode(v_salt,'escape'), 'sha256');
  v_fp   bytea := digest(p_code, 'sha256');
  v_id   uuid;
  v_allowed text;
begin
  if p_code_type not in ('beta','patreon','debug') then
    raise exception 'Invalid code_type: %', p_code_type;
  end if;

  -- If this fingerprint is protected, enforce its only allowed type
  select allowed_type into v_allowed
  from public.protected_codes
  where code_fingerprint = v_fp;

  if v_allowed is not null and v_allowed <> p_code_type then
    raise exception 'This code is protected and may only be issued as type %', v_allowed;
  end if;

  insert into public.access_codes(code_type, hash, salt, is_single_session, is_active, issued_to, code_fingerprint)
  values (p_code_type, v_hash, v_salt, p_is_single_session, true, p_issued_to, v_fp)
  returning code_id into v_id;

  return v_id;
end $$;

-- 2.5) Belt & braces: trigger to block direct INSERT/UPDATE that bypasses the function
create or replace function public.enforce_protected_codes()
returns trigger
language plpgsql
as $$
declare v_allowed text;
begin
  if new.code_fingerprint is not null then
    select allowed_type into v_allowed
    from public.protected_codes
    where code_fingerprint = new.code_fingerprint;

    if v_allowed is not null and new.code_type <> v_allowed then
      raise exception 'Protected code may only be issued as type %', v_allowed;
    end if;
  end if;

  return new;
end $$;

drop trigger if exists trg_enforce_protected_codes on public.access_codes;
create trigger trg_enforce_protected_codes
before insert or update on public.access_codes
for each row execute function public.enforce_protected_codes();

-- 2.6) Register the debug code fingerprint as protected (placeholder gets replaced below)
-- NOTE: Replace f416021102036f3e6b56992e530bc56a2b80dad14747d946029b2dee64b492d8 (no quotes) with the actual hex string, prefixed by \x
insert into public.protected_codes (code_fingerprint, allowed_type)
values ('\xf416021102036f3e6b56992e530bc56a2b80dad14747d946029b2dee64b492d8', 'debug')
on conflict (code_fingerprint) do update set allowed_type = excluded.allowed_type;


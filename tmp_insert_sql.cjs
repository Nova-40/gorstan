const fs = require('fs');
const crypto=require('crypto');
const codes={DZVLHD6O:'3ad540188c69ccf0fbd0797d799e1adb588040b52ab7b4dd65aaf9233085624d',7MPOG6YE:'9781bf1e4c481bccf355b8af06bf7445a0684a7e1fe52a333d002e4ce9dcd541',PYZ1ZVGF:'07f9695b45d85666aaf4f5eb09bbbb8e3dc2b831b71ae56edf82bc68e645bdb0',GAZOQYQQ:'afe6fcb19f737c57abfef62dcf6422623ea1eb095a9ffeab4401b15e001c4290',7GMAIQ:'729be0f6671fcd48eb5fc048f6571bc2430b5e47f8d0ebc3a9e7b341d95d370e',IPBBO4ZJ:'31b5e93e1da16906648bbcdfbce86a1bc0456f6a40dd7b0362b8dd1216377ebf',O4CH9AHT:'73d7282878d66a51f9e90b18785f1b3dc29ab04ec270fc8e206419749f9bad4f',5U2V5MBE:'c89350de4d1fb170303218bc619797c538643877bac6a1f36942d27e4a621510',FLJUIUFY:'6f0187a9102eb54b9d403e0caaae3f3aa2c266d35eca2040df8f82df6c3e5adc',WFABS2:'47856e779dc3e38c7b568e1c47069ca5b209a24f8dbcc0c83d4fafa3de50b3e3',RKZJWVG9:'d5938c594277a1fb06c5682aaf991719a8c246b0aa06a850cdd167f0cfb54449',S1NLBON2:'8b56f8b6799687abdd4d4d9a9f7fb1eacbfcb4edea2b9ecc1bd34844b78186d3',EYBNCXNZ:'19e2ce3c3641b1f9b37fe834e4085a1a76d2027624afc5a37d93a7ed1048860d',NPSMI9:'7837ec1ee14813c5916352702bc9ea0e4f076890aa4d6af514b3db170d2bb2c0',CAE3SHDN:'d8a5ef5faa24d3fa80755f2d4623a8d185c67c2974450331baec4408f55eec92',YIOUSMNO:'abd9cdf7e0a8c8f5a63876e85574aaa2e1bc9e9967d3c38c518cdbc635355684',0AY5BPM:'7fc5f299bdcbe16c9dabf62aa0109557a6c88ba1f31abd84c0e22927ce5d4088',ANJBW98W:'78581b2406e0eb4ffc7ad8b1a78266b25f7e95df6062caa0cf9948733367d5ee',QN2KGCPL:'ad22edabb085cfce11969e11739e36d1ee3e73fd12f58cf9089de8179615c761',HDAPODFS:'a0df7a8ce1b562615f9229367ca9cce88e68e5dad4d48e473b3eeaafcfada4f9'};
let out='';
for(const code in codes){
  const salt=Buffer.from(codes[code],'hex');
  const combined=Buffer.concat([Buffer.from(code,'utf8'), salt]);
  const hash=crypto.createHash('sha256').update(combined).digest('hex');
  const fp=crypto.createHash('sha256').update(code,'utf8').digest('hex');
  out += `INSERT INTO public.access_codes(code_id, code_type, hash, salt, is_single_session, is_active, issued_to, code_fingerprint, created_at) VALUES (gen_random_uuid(), 'beta', '\\x${hash}', '\\x${salt.toString('hex')}', true, true, null, '\\x${fp}', now()) ON CONFLICT DO NOTHING;\n`;
}
fs.writeFileSync('tmp_insert_sql.sql', out);

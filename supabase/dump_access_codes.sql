SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: access_codes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."access_codes" ("code_id", "code_type", "hash", "salt", "is_single_session", "is_active", "issued_to", "created_at", "code_fingerprint") VALUES
	('81a2bcf5-b6f4-47fc-96d4-e7644b19426c', 'beta', '\x9d7b2db8eb05dc3da87506c392a55e1465f79262dd56ff0b56d096c97a020ecb', '\x3ad540188c69ccf0fbd0797d799e1adb588040b52ab7b4dd65aaf9233085624d', true, true, NULL, '2025-09-10 05:44:59.955157+00', '\x9d7b2db8eb05dc3da87506c392a55e1465f79262dd56ff0b56d096c97a020ecb'),
	('06bb852c-54a0-4eee-a837-b47c2c531f6f', 'beta', '\x0eab056082e4213df10b49a3abacccb599ea490ea5f9e5010c84c8222def4a89', '\x9781bf1e4c481bccf355b8af06bf7445a0684a7e1fe52a333d002e4ce9dcd541', true, true, NULL, '2025-09-10 05:44:59.955157+00', '\x39bda57afe2aa64cae6d5a8a50175e045577d386ec4407c00cac0d982c1f76f0'),
	('ea2eb53e-d171-4afa-bd62-e6a64f07035d', 'beta', '\x2354edacfc200b8073c0d8f49593edc3e3b332ef93359fcc277f469c682cf8f9', '\x07f9695b45d85666aaf4f5eb09bbbb8e3dc2b831b71ae56edf82bc68e645bdb0', true, true, NULL, '2025-09-10 05:44:59.955157+00', '\x027466ff7cc69a6d64275236833060cbd91f386248b396313c2784944a7dfdf3'),
	('b443bb1e-35cc-4cc7-b7db-fb80a77138e6', 'beta', '\xaa46c665e741cdec1ed8435d92fa56d08856fcd9ba6a449c645c4de0c6014685', '\xafe6fcb19f737c57abfef62dcf6422623ea1eb095a9ffeab4401b15e001c4290', true, true, NULL, '2025-09-10 05:44:59.955157+00', '\x0c92cf9dbd9b9725efe120fc65021a549741fabcf954d686de503cf03d627610'),
	('e22c0067-d195-4560-b076-48c9301df51a', 'beta', '\x062c06a1aaa9265ee04276919d5503a5d5c3e808714f314780d9a15c564fb75f', '\x729be0f6671fcd48eb5fc048f6571bc2430b5e47f8d0ebc3a9e7b341d95d370e', true, true, NULL, '2025-09-10 05:44:59.955157+00', '\xd5cfadb72bad0224bc63a164cdde5d0385b597e28c6e4f513fbb8079ef273284'),
	('f6e67aac-be00-48a0-8af5-86e2eddd9f24', 'beta', '\x1283ca5ce8b30de3a7972f2bd5bf92e75f44afe786cf10bf6d2e8fd33a805f76', '\x31b5e93e1da16906648bbcdfbce86a1bc0456f6a40dd7b0362b8dd1216377ebf', true, true, NULL, '2025-09-10 05:44:59.955157+00', '\x3cac8010260789f646b104f0c169995fe71e6a9d8e1c38d861cd862cea3ce752'),
	('9b09da46-60d8-4fcf-8244-3c0dbc994867', 'beta', '\xcbf26825ebd273584268333db3873f6c4bea789e8522d5968425fe23ea33f809', '\x73d7282878d66a51f9e90b18785f1b3dc29ab04ec270fc8e206419749f9bad4f', true, true, NULL, '2025-09-10 05:44:59.955157+00', '\xd316340ca4faa947d2276c9444e17d8e1f36d6fbfbc4f2537106553fb6a0e0b8'),
	('b04fc262-cb0d-425c-9c43-60dedc2478f9', 'beta', '\xeedcd2cd5c8a84f47f07c7f45879381934b4e249bed2454725fef0532b98dafa', '\xc89350de4d1fb170303218bc619797c538643877bac6a1f36942d27e4a621510', true, true, NULL, '2025-09-10 05:44:59.955157+00', '\x6af3d6267d24b64abe81f4e3fee86904ecc1335a43c031e23bf07367d178c9ea'),
	('1e78326f-0179-4b71-ba24-0677c0e23ac2', 'beta', '\xc4faa979fcd81394715ec0e6648f110c7a1c1d6bcf407e009b461647ab74e66c', '\x6f0187a9102eb54b9d403e0caaae3f3aa2c266d35eca2040df8f82df6c3e5adc', true, true, NULL, '2025-09-10 05:44:59.955157+00', '\x53d354cf88142822fcc19241df706942540e587900bb4622697fd81d65aa5fa7'),
	('ed00fa4a-bd56-406a-a630-9e00e240fd8e', 'beta', '\x02879aeebbb0d8257e318b65d5acbc4cbbb2b92e19a4d5eb50caa51b030b22d3', '\x47856e779dc3e38c7b568e1c47069ca5b209a24f8dbcc0c83d4fafa3de50b3e3', true, true, NULL, '2025-09-10 05:44:59.955157+00', '\xc9dca8d245d17af4847d90790cb85a6dc2af5cd34761ea51ed50f98579ae2892'),
	('fc33d19d-3bd2-477e-92bd-1c0af235cbff', 'beta', '\x5d4524a719a0bfa8de34a0d51b654235894b5c1e90b37cd0cf9a52191a44e98c', '\xd5938c594277a1fb06c5682aaf991719a8c246b0aa06a850cdd167f0cfb54449', true, true, NULL, '2025-09-10 05:44:59.955157+00', '\xc1177a8a842aceb431e3ab235c4aa6b5c965b4cb668bf5b6f0a9a3cfcd54e979'),
	('06abf082-eae0-4fd3-bb55-4f9d0fc46bac', 'beta', '\x41de20f8f38610e60605ac538dcba4d2d22540b6913895faa3e0a0e4538a1a80', '\x8b56f8b6799687abdd4d4d9a9f7fb1eacbfcb4edea2b9ecc1bd34844b78186d3', true, true, NULL, '2025-09-10 05:44:59.955157+00', '\x3cc3bdf8886246df233dcf2aed98850984c279c65b2d13348f95e35071ad8ac6'),
	('32fc9054-4609-4a7d-89bc-e35269497377', 'beta', '\x68c648acb1c0c56b719c2ca2598ec33cd792761b378b4894f816a5802fa5746c', '\x19e2ce3c3641b1f9b37fe834e4085a1a76d2027624afc5a37d93a7ed1048860d', true, true, NULL, '2025-09-10 05:44:59.955157+00', '\xcef034fc1011875d588451db800d004ebbbb30bb5b5a9ffb2cf4fa8981b74aa6'),
	('a554b319-e5f8-4dce-9716-43ed5b1dd1ef', 'beta', '\x6ddeca5b0bc27c5f2fe0ec25ac2e5a559b766079fef8504e74ada801c5e24269', '\x7837ec1ee14813c5916352702bc9ea0e4f076890aa4d6af514b3db170d2bb2c0', true, true, NULL, '2025-09-10 05:44:59.955157+00', '\x3687bd2adde04b3d1c169154e727617d41344e8cefa702375da8beba6ee164ed'),
	('f1f379de-a515-40f5-95ef-39087987f165', 'beta', '\xce7d80e5cc1732e637efe2ce55bd5a9e68c9ecfe6abcc833e387611ac0b5451d', '\xd8a5ef5faa24d3fa80755f2d4623a8d185c67c2974450331baec4408f55eec92', true, true, NULL, '2025-09-10 05:44:59.955157+00', '\x57273e51d032e8896259c92211f7193d9fa10105cb9df94069acf3f81ce0dd18'),
	('27acf5ab-2fea-4ec7-8fd9-5a2ad65fbda6', 'beta', '\x3a577e3ec41cc8c6ffa4ab254372ca92c5207cfb1aa6e28fbe3b502e060d565c', '\xabd9cdf7e0a8c8f5a63876e85574aaa2e1bc9e9967d3c38c518cdbc635355684', true, true, NULL, '2025-09-10 05:44:59.955157+00', '\xd7e07c55139125e6549f32fb0666fd5c3af6665af36455c3119fae5277bfe5e3'),
	('d0bb387b-b842-48a4-b2ac-28098ba7517c', 'beta', '\x7d30dd571fc1d39a1042112badcae558edbc72ab369fa0e8f2c29940e0392ec4', '\x7fc5f299bdcbe16c9dabf62aa0109557a6c88ba1f31abd84c0e22927ce5d4088', true, true, NULL, '2025-09-10 05:44:59.955157+00', '\x5bfe8ed4d330e399d2da88e793694e0bdae0a33c0169a35e7005a43c84701d69'),
	('e1b9e8d6-99d5-48bf-8904-3aa6c2d1c9b7', 'beta', '\x8e451f354d1ab817b8850e0313e0d485cee51579b9d7efb7a45a1df7b59649ef', '\x78581b2406e0eb4ffc7ad8b1a78266b25f7e95df6062caa0cf9948733367d5ee', true, true, NULL, '2025-09-10 05:44:59.955157+00', '\x4fcfdc60823685fb24e02d7a2d697ef819325393667d8779255f9d782464fb4f'),
	('8f197f15-5c53-4bfe-bc77-a8d33f62f596', 'beta', '\x0b615397ded7bece0c5ca1b8ec5101a693b877ec328e763b1cfe213efdbc3191', '\xad22edabb085cfce11969e11739e36d1ee3e73fd12f58cf9089de8179615c761', true, true, NULL, '2025-09-10 05:44:59.955157+00', '\xfd1e006caa705afe04a3ba113337ac2e7d6374956eb042aa7fb7a4ebe9c38980'),
	('d37db06d-6cb5-48fb-becb-669931c88e20', 'beta', '\xf8adec4ffbae5b32c12399b16f959e043df54f6353d1fd431ed37a9d7aba7521', '\xa0df7a8ce1b562615f9229367ca9cce88e68e5dad4d48e473b3eeaafcfada4f9', true, true, NULL, '2025-09-10 05:44:59.955157+00', '\x6fbb82f2132dcd66cb8fc0502bbb2481394a0ce5751be4831615cec994291fcb');


--
-- Data for Name: protected_codes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."protected_codes" ("code_fingerprint", "allowed_type") VALUES
	('\xf416021102036f3e6b56992e530bc56a2b80dad14747d946029b2dee64b492d8', 'debug');


--
-- PostgreSQL database dump complete
--

RESET ALL;

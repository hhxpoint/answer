const share = require('../utils/share.js');
const payload = { modelId: 'legion-y9000p-2025', variantId: '32-1t', answers: { condition:'B', battery:'good', repair:'none', accessory:'full', warranty:'expired', screen:'perfect', customPrice:'10500' }, dateText:'11月22日' };
const d = share.encode(payload);
if (d.length > 600) throw new Error('share query too long: ' + d.length);
const back = share.decode(d);
if (!back || back.m !== payload.modelId || back.a.condition !== 'B' || back.a.customPrice !== '10500') throw new Error('share roundtrip failed');
if (share.decode('bad')) throw new Error('bad payload accepted');
console.log('SHARE_SMOKE_OK', 'length=' + d.length);

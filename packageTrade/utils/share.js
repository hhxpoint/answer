// Encode a tiny, whitelisted appraisal payload into a share query.
// No free text, no photos, no contact data: the shared page can only render
// known model/condition fields, which keeps direct mini-program sharing safe.
function encode(payload) {
  const safe = {
    m: String(payload.modelId || ''),
    v: String(payload.variantId || ''),
    a: {
      condition: String(payload.answers && payload.answers.condition || 'A'),
      battery: String(payload.answers && payload.answers.battery || 'good'),
      repair: String(payload.answers && payload.answers.repair || 'none'),
      accessory: String(payload.answers && payload.answers.accessory || 'full'),
      warranty: String(payload.answers && payload.answers.warranty || 'expired'),
      screen: String(payload.answers && payload.answers.screen || 'perfect'),
      customPrice: String(payload.answers && payload.answers.customPrice || '')
    },
    d: String(payload.dateText || '')
  };
  return encodeURIComponent(JSON.stringify(safe));
}

function decode(raw) {
  try {
    const data = JSON.parse(decodeURIComponent(String(raw || '')));
    if (!data || !data.m || !data.v || !data.a) return null;
    return data;
  } catch (e) {
    return null;
  }
}

module.exports = { encode: encode, decode: decode };

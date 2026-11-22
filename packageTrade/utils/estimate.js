const CONDITIONS = [
  { id: 'S', label: '准新', desc: '几乎无使用痕迹', factor: 1.03 },
  { id: 'A', label: '95 新', desc: '轻微使用痕迹', factor: 1.0 },
  { id: 'B', label: '9 成新', desc: '正常使用痕迹/小划痕', factor: 0.92 },
  { id: 'C', label: '8 成新', desc: '明显磕碰或屏幕瑕疵', factor: 0.82 },
  { id: 'D', label: '7 成新', desc: '功能正常但成色一般', factor: 0.70 }
];

const BATTERIES = [
  { id: 'high', label: '95% 以上', factor: 1.0 },
  { id: 'good', label: '90%–94%', factor: 0.98 },
  { id: 'mid', label: '85%–89%', factor: 0.95 },
  { id: 'low', label: '80%–84%', factor: 0.90 },
  { id: 'bad', label: '低于 80%', factor: 0.84 },
  { id: 'unknown', label: '不清楚', factor: 0.94 }
];

const REPAIRS = [
  { id: 'none', label: '无维修', factor: 1.0 },
  { id: 'official', label: '官方维修', factor: 0.95 },
  { id: 'third', label: '第三方维修', factor: 0.90 },
  { id: 'screen', label: '换过屏幕', factor: 0.92 },
  { id: 'board', label: '主板维修', factor: 0.80 }
];

const ACCESSORIES = [
  { id: 'full', label: '原装充电器 + 包装', factor: 1.02 },
  { id: 'charger', label: '只有原装充电器', factor: 1.0 },
  { id: 'none', label: '裸机', factor: 0.95 }
];

const WARRANTY = [
  { id: 'active', label: '保修期内', factor: 1.05 },
  { id: 'expired', label: '已过保', factor: 1.0 },
  { id: 'unknown', label: '不确定', factor: 0.98 }
];

const SCREENS = [
  { id: 'perfect', label: '完好', factor: 1.0 },
  { id: 'minor', label: '轻微划痕', factor: 0.97 },
  { id: 'bright', label: '亮点/坏点', factor: 0.90 },
  { id: 'broken', label: '碎屏/漏液', factor: 0.78 }
];

const DEFAULTS = {
  condition: 'A',
  battery: 'good',
  repair: 'none',
  accessory: 'full',
  warranty: 'expired',
  screen: 'perfect',
  customPrice: ''
};

function byId(list, id) {
  return list.find(function (x) { return x.id === id; }) || list[0];
}

function round10(n) {
  return Math.max(0, Math.round(Number(n) / 10) * 10);
}

function calc(model, variant, answers) {
  if (!model || !variant) return null;
  const a = Object.assign({}, DEFAULTS, answers || {});
  const condition = byId(CONDITIONS, a.condition);
  const battery = byId(BATTERIES, a.battery);
  const repair = byId(REPAIRS, a.repair);
  const accessory = byId(ACCESSORIES, a.accessory);
  const warranty = byId(WARRANTY, a.warranty);
  const screen = byId(SCREENS, a.screen);

  const factor = condition.factor * battery.factor * repair.factor *
    accessory.factor * warranty.factor * screen.factor;
  const low = round10(variant.priceLow * factor);
  const high = round10(variant.priceHigh * factor);
  const fair = round10((low + high) / 2);
  const quick = round10(low * 0.95);
  const patient = round10(high * 1.04);

  const custom = Number(a.customPrice);
  let customState = '';
  let customGap = 0;
  if (custom > 0) {
    customGap = custom - fair;
    if (custom > high * 1.08) customState = '高于参考区间，可能不好出手';
    else if (custom < low * 0.92) customState = '低于参考区间，可能卖亏';
    else customState = '在合理区间内';
  }

  return {
    condition: condition,
    battery: battery,
    repair: repair,
    accessory: accessory,
    warranty: warranty,
    screen: screen,
    factor: Math.round(factor * 1000) / 1000,
    low: low,
    high: high,
    fair: fair,
    quick: quick,
    patient: patient,
    lowText: '¥' + fmt(low),
    highText: '¥' + fmt(high),
    fairText: '¥' + fmt(fair),
    quickText: '¥' + fmt(quick),
    patientText: '¥' + fmt(patient),
    rangeText: '¥' + fmt(low) + ' – ¥' + fmt(high),
    customPrice: custom || 0,
    customState: customState,
    customGap: customGap,
    customText: custom > 0 ? '¥' + fmt(custom) : '',
    stars: factor >= 0.96 ? 4 : factor >= 0.88 ? 3 : 2,
    confidence: '模型参考',
    notes: [
      '按当前成色、电池、维修与配件综合折算',
      '参考价来自发售价 + 折旧模型，不是成交承诺',
      '实际成交受地区、供需和验机结果影响'
    ]
  };
}

function fmt(n) {
  return Math.max(0, Math.round(Number(n) || 0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

module.exports = {
  CONDITIONS: CONDITIONS,
  BATTERIES: BATTERIES,
  REPAIRS: REPAIRS,
  ACCESSORIES: ACCESSORIES,
  WARRANTY: WARRANTY,
  SCREENS: SCREENS,
  DEFAULTS: DEFAULTS,
  calc: calc,
  round10: round10,
  fmt: fmt
};

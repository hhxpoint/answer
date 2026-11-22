// Smoke: trade catalog, estimate formula, poster drawing with mock canvas.
const fs = require('fs');
const path = require('path');
const ROOT = require('path').join(__dirname, '..');
const catalog = require(ROOT + '/utils/catalog.js');
const estimate = require(ROOT + '/utils/estimate.js');
const poster = require(ROOT + '/utils/poster.js');

let errors = [];
if (catalog.ALL.length !== 68) errors.push('model count');
const model = catalog.getModel('legion-y9000p-2025');
const variant = catalog.getVariant(model, '32-1t');
const result = estimate.calc(model, variant, { condition: 'A', battery: 'good', repair: 'none', accessory: 'full', warranty: 'expired', screen: 'perfect' });
if (!result || result.low <= 0 || result.high < result.low) errors.push('estimate');
if (!(result.quick <= result.fair && result.fair <= result.patient)) errors.push('price order');
const draft = {
  dateText: '11月22日',
  model: model,
  variant: variant,
  result: result
};

// Mock canvas context; enough to execute drawing code.
const calls = [];
function ctx() {}
['beginPath','moveTo','lineTo','quadraticCurveTo','closePath','fill','stroke','fillRect','strokeRect','arc','fillText','save','restore','scale','clearRect'].forEach(function (m) {
  ctx.prototype[m] = function () { calls.push(m); };
});
ctx.prototype.measureText = function (t) { return { width: String(t).length * 10 }; };
ctx.prototype.fillStyle = '';
ctx.prototype.strokeStyle = '';
ctx.prototype.lineWidth = 1;
ctx.prototype.font = '';
ctx.prototype.textBaseline = '';
ctx.prototype.textAlign = '';
ctx.prototype.globalAlpha = 1;
try {
  poster.draw(new ctx(), {
    dateText: draft.dateText,
    brand: model.brand,
    year: model.year,
    modelName: model.model,
    variantLabel: variant.label,
    rangeText: result.rangeText,
    quickText: result.quickText,
    fairText: result.fairText,
    patientText: result.patientText,
    conditionLabel: result.condition.label,
    batteryLabel: result.battery.label,
    repairLabel: result.repair.label,
    accessoryLabel: result.accessory.label,
    screenLabel: result.screen.label,
    customText: '¥9,200'
  }, 750, 1050);
} catch (e) {
  errors.push('poster draw: ' + e.message);
}
if (calls.indexOf('fillText') < 0 || calls.indexOf('fillRect') < 0) errors.push('poster missing draw calls');
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('TRADE_SMOKE_OK', 'models=' + catalog.ALL.length, 'posterCalls=' + calls.length, 'range=' + result.rangeText);

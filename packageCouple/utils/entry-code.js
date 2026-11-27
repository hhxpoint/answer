/**
 * 空间创建口令
 *
 * 产品逻辑：创建新的关系空间需要口令；口令由运营统一发放。
 * 口令不匹配时，用户先进入「两个人的空间」介绍页了解这个产品。
 *
 * 口令校验只是体验层，服务端 CREATE_PASS 才是唯一权威。
 */
const ENTRY_CODE = '1314';
const TTL = 2 * 60 * 1000;

let granted = null;

function check(input) {
  return String(input == null ? '' : input).trim() === ENTRY_CODE;
}

function grant() {
  granted = { at: Date.now() };
}

function peek() {
  if (!granted) return false;
  if (Date.now() - granted.at > TTL) {
    granted = null;
    return false;
  }
  return true;
}

function take() {
  const ok = peek();
  granted = null;
  return ok ? ENTRY_CODE : '';
}

function clear() {
  granted = null;
}

module.exports = {
  TTL: TTL,
  check: check,
  grant: grant,
  peek: peek,
  take: take,
  clear: clear
};

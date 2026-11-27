/**
 * 新建关系空间的创建密码门禁（内存态，不落本地存储）
 *
 * 流程：空间列表页点「新建」→ 输密码 → 校验通过 → grant() → 跳创建页；
 *      创建页 onCreate 时 take() 取到密码就直接创建（不再弹第二次），
 *      直接打开创建页（深链/分享）时取不到，就自己弹一次。
 *
 * 密码只校验、不展示；服务端仍会独立校验一次（client 端常量可被反编译，
 * 真正的闸门在服务端 CREATE_PASS）。
 */
const CREATE_PASS = '1314';
const TTL = 2 * 60 * 1000; // 授权 2 分钟内有效，避免跳转途中丢失又不至于长期留存

let granted = null;

function check(input) {
  return String(input == null ? '' : input).trim() === CREATE_PASS;
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

/** 消费一次授权：返回密码（已从列表页输入过），没授权返回空串 */
function take() {
  const ok = peek();
  granted = null;
  return ok ? CREATE_PASS : '';
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

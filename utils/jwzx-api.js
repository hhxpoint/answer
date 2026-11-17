/**
 * 教务在线 API 模块
 * 对接 Go 后端代理 → Python → 青果教务系统
 * Base URL: https://hhxgo.tech/api/jwzx/
 */

const BASE_URL = 'https://hhxgo.tech/api/jwzx';

// 超时配置 (ms)
const TIMEOUT = {
  warmup: 10000,
  captcha: 10000,
  login: 20000,
  autoLogin: 20000,
  semesters: 20000,
  scores: 30000,
  allScores: 120000,
  courses: 30000,
  info: 20000,
  menu: 15000,
  status: 10000,
  logout: 10000
};

/**
 * 通用请求封装
 */
function request(path, data, timeout) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}${path}`,
      method: 'POST',
      header: { 'Content-Type': 'application/json' },
      data: data || {},
      timeout: timeout || 15000,
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      },
      fail(err) {
        reject(new Error(err.errMsg || '网络请求失败'));
      }
    });
  });
}

// ============================================================
// Token 管理
// ============================================================

function saveToken(token) {
  try { wx.setStorageSync('jwzx_token', token); } catch (e) {}
}

function getToken() {
  try { return wx.getStorageSync('jwzx_token') || ''; } catch (e) { return ''; }
}

function clearToken() {
  try { wx.removeStorageSync('jwzx_token'); } catch (e) {}
}

// ============================================================
// 凭据缓存 (记住密码)
// ============================================================

function saveCredentials(username, password) {
  try {
    wx.setStorageSync('jwzx_username', username);
    wx.setStorageSync('jwzx_password', password);
  } catch (e) {}
}

function getCredentials() {
  try {
    return {
      username: wx.getStorageSync('jwzx_username') || '',
      password: wx.getStorageSync('jwzx_password') || ''
    };
  } catch (e) {
    return { username: '', password: '' };
  }
}

function clearCredentials() {
  try {
    wx.removeStorageSync('jwzx_username');
    wx.removeStorageSync('jwzx_password');
  } catch (e) {}
}

function hasCredentials() {
  const c = getCredentials();
  return !!(c.username && c.password);
}

// ============================================================
// 学生信息缓存
// ============================================================

function saveStudentInfo(info) {
  try { wx.setStorageSync('jwzx_student_info', info); } catch (e) {}
}

function getStudentInfo() {
  try { return wx.getStorageSync('jwzx_student_info') || null; } catch (e) { return null; }
}

function clearStudentInfo() {
  try { wx.removeStorageSync('jwzx_student_info'); } catch (e) {}
}

// ============================================================
// 清除所有教务数据 (登录过期/密码变更时调用)
// ============================================================

function clearAll() {
  clearToken();
  clearCredentials();
  clearStudentInfo();
}

// ============================================================
// API 接口
// ============================================================

/** 预热 Session */
function warmup(username, password) {
  return request('/warmup', { username, password }, TIMEOUT.warmup);
}

/** 获取验证码 */
function getCaptcha(token) {
  const data = token ? { token } : {};
  return request('/captcha', data, TIMEOUT.captcha);
}

/** 使用凭据获取验证码 (首次) */
function getCaptchaWithCredentials(username, password) {
  return request('/captcha', { username, password }, TIMEOUT.captcha);
}

/** 登录 */
function login(username, password, captcha, token) {
  return request('/login', {
    username, password, captcha, token
  }, TIMEOUT.login);
}

/** 自动登录 (免验证码) */
function autoLogin(username, password) {
  return request('/auto_login', { username, password }, TIMEOUT.autoLogin);
}

/** 检查登录状态 */
function checkStatus(token) {
  return request('/status', { token: token || getToken() }, TIMEOUT.status);
}

/** 获取学期列表 */
function getSemesters(token) {
  return request('/semesters', { token: token || getToken() }, TIMEOUT.semesters);
}

/** 查询指定学期成绩 */
function getScores(year, term, token) {
  return request('/scores', {
    token: token || getToken(),
    year, term
  }, TIMEOUT.scores);
}

/** 查询全部成绩 */
function getAllScores(token) {
  return request('/all_scores', { token: token || getToken() }, TIMEOUT.allScores);
}

/** 获取课表 */
function getCourses(token) {
  return request('/courses', { token: token || getToken() }, TIMEOUT.courses);
}

/** 获取学生信息 */
function getInfo(token) {
  return request('/info', { token: token || getToken() }, TIMEOUT.info);
}

/** 获取菜单 */
function getMenu(token) {
  return request('/menu', { token: token || getToken() }, TIMEOUT.menu);
}

/** 登出 */
function logout(token) {
  return request('/logout', { token: token || getToken() }, TIMEOUT.logout);
}

// ============================================================
// GPA 计算
// ============================================================

/** 计算单科绩点 */
function calcGPA(scoreStr) {
  if (!scoreStr) return null;
  const s = scoreStr.trim();
  const gradeMap = {
    '优秀': 4.5, '良好': 3.5, '中等': 2.5,
    '及格': 1.5, '不及格': 0
  };
  if (gradeMap[s] !== undefined) return gradeMap[s];
  const score = parseFloat(s);
  if (isNaN(score)) return null;
  if (score < 60) return 0;
  return Math.min((score - 50) / 10, 5.0);
}

/** 判断是否必修 (只有"任选"才算选修) */
function isRequired(row) {
  return !(row.elective && row.elective.indexOf('任选') !== -1);
}

/** 计算学期平均学分绩 */
function calcSemesterGPA(scores, requiredOnly) {
  let sumGPACredit = 0, sumCredit = 0;
  scores.forEach(row => {
    const gpa = calcGPA(row.score);
    const credit = parseFloat(row.credit);
    if (gpa === null || isNaN(credit) || credit <= 0) return;
    if (requiredOnly && !isRequired(row)) return;
    sumGPACredit += gpa * credit;
    sumCredit += credit;
  });
  return sumCredit > 0 ? sumGPACredit / sumCredit : null;
}

/** 全部成绩汇总统计 */
function calcOverallSummary(allScores) {
  // 必修学分绩
  let reqSumGPACredit = 0, reqSumCredit = 0;
  allScores.forEach(row => {
    const gpa = calcGPA(row.score);
    const credit = parseFloat(row.credit);
    if (gpa === null || isNaN(credit) || credit <= 0) return;
    if (isRequired(row)) {
      reqSumGPACredit += gpa * credit;
      reqSumCredit += credit;
    }
  });
  const reqGPA = reqSumCredit > 0 ? reqSumGPACredit / reqSumCredit : null;

  // 前5高分选修
  const electives = allScores
    .filter(row => !isRequired(row))
    .map(row => ({
      score: parseFloat(row.score),
      gpa: calcGPA(row.score),
      credit: parseFloat(row.credit),
      name: row.name
    }))
    .filter(x => !isNaN(x.score) && x.gpa !== null && !isNaN(x.credit) && x.credit > 0)
    .sort((a, b) => b.score - a.score);

  const top5 = electives.slice(0, 5);
  let combinedGPACredit = reqSumGPACredit, combinedCredit = reqSumCredit;
  top5.forEach(x => {
    combinedGPACredit += x.gpa * x.credit;
    combinedCredit += x.credit;
  });
  const combinedGPA = combinedCredit > 0 ? combinedGPACredit / combinedCredit : null;

  return {
    requiredGPA: reqGPA !== null ? reqGPA.toFixed(2) : '--',
    requiredCredits: reqSumCredit,
    combinedGPA: combinedGPA !== null ? combinedGPA.toFixed(2) : '--',
    combinedCredits: combinedCredit,
    topElectives: top5.map(x => ({ name: x.name, score: x.score }))
  };
}

// ============================================================
// 导出
// ============================================================

module.exports = {
  // API
  warmup,
  getCaptcha,
  getCaptchaWithCredentials,
  login,
  autoLogin,
  checkStatus,
  getSemesters,
  getScores,
  getAllScores,
  getCourses,
  getInfo,
  getMenu,
  logout,
  // Token
  saveToken,
  getToken,
  clearToken,
  // Credentials
  saveCredentials,
  getCredentials,
  clearCredentials,
  hasCredentials,
  // Student info
  saveStudentInfo,
  getStudentInfo,
  clearStudentInfo,
  // Cleanup
  clearAll,
  // GPA
  calcGPA,
  isRequired,
  calcSemesterGPA,
  calcOverallSummary
};

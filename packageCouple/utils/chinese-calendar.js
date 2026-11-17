// 农历 / 公历转换（1900-2100）与重要节日标识
// 农历数据采用社区通用的 lunarInfo 表（与微信内置日历、主流万年历一致）
// 仅用于日历上展示节日小字，不做任何业务写入

const lunarInfo = [0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, 0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, 0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, 0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, 0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, 0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, 0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, 0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, 0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, 0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x05ac0, 0x0ab60, 0x096d5, 0x092e0, 0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, 0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, 0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, 0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, 0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, 0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0, 0x092e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, 0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, 0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, 0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a4d0, 0x0d150, 0x0f252, 0x0d520];

function pad2(n) {
  return n < 10 ? '0' + n : '' + n;
}

function lYearDays(y) {
  let sum = 348;
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    sum += lunarInfo[y - 1900] & i ? 1 : 0;
  }
  return sum + leapDays(y);
}

function leapMonth(y) {
  return lunarInfo[y - 1900] & 0xf;
}

function leapDays(y) {
  if (leapMonth(y)) {
    return lunarInfo[y - 1900] & 0x10000 ? 30 : 29;
  }
  return 0;
}

function monthDays(y, m) {
  if (m < 1 || m > 12) return -1;
  return lunarInfo[y - 1900] & (0x10000 >> m) ? 30 : 29;
}

// 公历 -> 农历（返回 { lYear, lMonth, lDay, isLeap }）
function solarToLunar(y, m, d) {
  if (y < 1900 || y > 2100) return null;
  if (y === 1900 && m === 1 && d < 31) return null;
  const obj = new Date(y, m - 1, d);
  y = obj.getFullYear();
  m = obj.getMonth() + 1;
  d = obj.getDate();

  let offset = Math.floor((Date.UTC(y, m - 1, d) - Date.UTC(1900, 0, 31)) / 86400000);
  let year = 1900;
  while (year < 2101 && offset >= lYearDays(year)) {
    offset -= lYearDays(year);
    year++;
  }
  if (year > 2100) return null;

  const leap = leapMonth(year);
  let month = 1;
  let isLeap = false;
  let day = offset + 1;
  let guard = 0;
  while (guard++ < 40) {
    const len = isLeap ? leapDays(year) : monthDays(year, month);
    if (day > len) {
      day -= len;
      if (!isLeap && leap === month) {
        isLeap = true;
      } else {
        isLeap = false;
        month++;
      }
    } else {
      break;
    }
  }
  return {
    lYear: year,
    lMonth: month,
    lDay: day,
    isLeap: isLeap
  };
}

const solarFestivals = {
  '01-01': '元旦',
  '02-14': '情人节',
  '03-08': '妇女节',
  '05-01': '劳动节',
  '05-04': '青年节',
  '06-01': '儿童节',
  '09-10': '教师节',
  '10-01': '国庆节',
  '12-24': '平安夜',
  '12-25': '圣诞节'
};

const lunarFestivals = [
  { m: 1, d: 1, name: '春节' },
  { m: 1, d: 15, name: '元宵节' },
  { m: 5, d: 5, name: '端午节' },
  { m: 7, d: 7, name: '七夕' },
  { m: 8, d: 15, name: '中秋节' },
  { m: 9, d: 9, name: '重阳节' },
  { m: 12, d: 8, name: '腊八节' }
];

// 同一天可能有多个节日时，优先展示的顺序
const holidayPriority = [
  '元旦', '春节', '清明节', '劳动节', '端午节', '中秋节', '国庆节', '除夕',
  '元宵节', '七夕', '重阳节', '腊八节', '情人节', '妇女节', '青年节', '儿童节',
  '教师节', '平安夜', '圣诞节', '母亲节', '父亲节'
];

function weekdayOf(y, m, d) {
  return new Date(y, m - 1, d).getDay();
}

// 某月第 n 个星期 weekday（weekday: 0=周日）
function nthWeekday(y, m, weekday, n) {
  const first = weekdayOf(y, m, 1);
  const offset = (weekday - first + 7) % 7;
  return 1 + offset + (n - 1) * 7;
}

// 清明：21 世纪通用公式（已验证 2025-2035 与官方日历一致）
function qingmingDay(y) {
  const yy = y % 100;
  return Math.floor(yy * 0.2422 + 4.81) - Math.floor(yy / 4);
}

function festivalsOf(y, m, d) {
  const names = [];
  const mmdd = pad2(m) + '-' + pad2(d);

  if (solarFestivals[mmdd]) names.push(solarFestivals[mmdd]);
  if (m === 4 && d === qingmingDay(y)) names.push('清明节');
  if (m === 5 && d === nthWeekday(y, 5, 0, 2)) names.push('母亲节');
  if (m === 6 && d === nthWeekday(y, 6, 0, 3)) names.push('父亲节');

  const lunar = solarToLunar(y, m, d);
  if (lunar) {
    if (lunar.lMonth === 12) {
      // 除夕：农历一年最后一天（闰 12 月时取闰月最后一天）
      const lastDay = lunar.isLeap ? leapDays(lunar.lYear) : monthDays(lunar.lYear, 12);
      if (lunar.lDay === lastDay) names.push('除夕');
    }
    lunarFestivals.forEach(function (f) {
      if (!lunar.isLeap && lunar.lMonth === f.m && lunar.lDay === f.d) names.push(f.name);
    });
  }
  return names;
}

function getHolidayName(y, m, d) {
  const names = festivalsOf(y, m, d);
  for (let i = 0; i < holidayPriority.length; i++) {
    if (names.indexOf(holidayPriority[i]) >= 0) return holidayPriority[i];
  }
  return names[0] || '';
}

function fmtDate(y, m, d) {
  return y + '-' + pad2(m) + '-' + pad2(d);
}

module.exports = {
  solarToLunar: solarToLunar,
  getHolidayName: getHolidayName,
  festivalsOf: festivalsOf,
  fmtDate: fmtDate
};

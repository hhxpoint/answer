// 小火苗分享封面与路径（统一设计系统）
const spaceCtx = require('./space.js');

const COVERS = {
  home: '/packageCouple/assets/share/share-home.jpg',
  spaces: '/packageCouple/assets/share/share-spaces.jpg',
  chat: '/packageCouple/assets/share/share-chat.jpg',
  timeline: '/packageCouple/assets/share/share-timeline.jpg',
  anniversary: '/packageCouple/assets/share/share-anniversary.jpg',
  listen: '/packageCouple/assets/share/share-listen.jpg',
  create: '/packageCouple/assets/share/share-create.jpg',
  join: '/packageCouple/assets/share/share-join.jpg',
  bind: '/packageCouple/assets/share/share-bind.jpg',
};

function cover(name) {
  return COVERS[name] || COVERS.home;
}

function spaceId() {
  return spaceCtx.getCurrentSpaceId();
}

function homePath() {
  const id = spaceId();
  return '/packageCouple/pages/home/home' + (id ? '?space=' + id : '');
}

function timelineQuery() {
  const id = spaceId();
  return id ? 'space=' + id : '';
}

module.exports = {
  COVERS: COVERS,
  cover: cover,
  spaceId: spaceId,
  homePath: homePath,
  timelineQuery: timelineQuery,
};

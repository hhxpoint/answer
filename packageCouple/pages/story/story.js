Page({
  data: {
    // 纯静态内容页：没有任何用户输入、发布、评论、分享能力
    chapters: [
      {
        no: '01',
        title: '相遇',
        img: '/packageCouple/assets/story/meet.jpg',
        paras: [
          '那天的风很轻，街灯刚刚亮起。',
          '你说了一句很普通的话，我却记了很久。',
          '后来才明白，有些相遇不是巧合，是两个人各自走了很远的路，刚好在同一盏灯下停下。'
        ]
      },
      {
        no: '02',
        title: '日常',
        img: '/packageCouple/assets/story/daily.jpg',
        paras: [
          '后来我们把日子过得很慢。',
          '一起买菜，一起等一锅汤慢慢冒泡，一起在沙发上睡着，电视还亮着。',
          '没有什么惊天动地的事，只是每一个普通的晚上，都因为有你在，变得值得记住。'
        ]
      },
      {
        no: '03',
        title: '往后',
        img: '/packageCouple/assets/story/future.jpg',
        paras: [
          '再往后，想去更远的地方。',
          '看一次海，走一段没有走过的路，在陌生的城市里，还是牵着同一只手。',
          '不着急抵达，只想把剩下的路，都和你一起走。'
        ]
      }
    ]
  },

  onLoad() {
    // 明确关闭分享入口：这一页是静态内容页，不承担任何传播功能
    try {
      if (wx.hideShareMenu) wx.hideShareMenu();
    } catch (e) {
      // ignore
    }
  },

  back() {
    const pages = getCurrentPages();
    if (pages && pages.length > 1) {
      wx.navigateBack({ delta: 1 });
    } else {
      wx.reLaunch({ url: '/packageCouple/pages/spaces/spaces' });
    }
  }
});

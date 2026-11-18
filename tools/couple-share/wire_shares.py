# -*- coding: utf-8 -*-
"""给 packageCouple 所有页面接上统一定制分享封面与文案"""
import os
import re

ROOT = r'D:\03-Projects\answer\packageCouple\pages'

HANDLERS = {
    'bind/bind.js': """
  onShareAppMessage: function () {
    const code = this.data.inviteCode || '';
    return {
      title: code ? '两个人，一只火苗，等你来点亮' : '两个人，一只火苗',
      path: '/packageCouple/pages/join/join' + (code ? '?code=' + encodeURIComponent(code) : ''),
      imageUrl: share.cover('bind')
    };
  },

  onShareTimeline: function () {
    const code = this.data.inviteCode || '';
    return {
      title: '两个人，一只火苗',
      query: code ? 'code=' + encodeURIComponent(code) : '',
      imageUrl: share.cover('bind')
    };
  }
""",
    'home/home.js': """
  onShareAppMessage: function () {
    if (this.data.alone && this.data.inviteCode) {
      return {
        title: '我在等一个人，一起点亮这只小火苗',
        path: '/packageCouple/pages/join/join?code=' + encodeURIComponent(this.data.inviteCode),
        imageUrl: share.cover('join')
      };
    }
    const pet = this.data.pet || {};
    const lv = pet.level || 1;
    const streak = pet.streak || 0;
    return {
      title: '我们的小火苗 Lv.' + lv + '，已经连续守护 ' + streak + ' 天',
      path: share.homePath(),
      imageUrl: share.cover('home')
    };
  },

  onShareTimeline: function () {
    const alone = this.data.alone && this.data.inviteCode;
    return {
      title: alone ? '我在等一个人，一起点亮这只小火苗' : '我们的小火苗 · 只属于两个人的小空间',
      query: alone ? 'code=' + encodeURIComponent(this.data.inviteCode) : share.timelineQuery(),
      imageUrl: share.cover(alone ? 'join' : 'home')
    };
  }
""",
    'spaces/spaces.js': """
  onShareAppMessage() {
    return {
      title: '和重要的人，一起养一只火苗',
      path: '/packageCouple/pages/spaces/spaces',
      imageUrl: share.cover('spaces')
    };
  },

  onShareTimeline() {
    return {
      title: '和重要的人，一起养一只火苗',
      imageUrl: share.cover('spaces')
    };
  }
""",
    'create/create.js': """
  onShareAppMessage() {
    const s = this.data.result;
    if (!s || !s.invite_code) {
      return {
        title: '给这段关系，点亮一只火苗',
        path: '/packageCouple/pages/spaces/spaces',
        imageUrl: share.cover('create')
      };
    }
    return {
      title: '来和我一起养一只小火苗吧',
      path: '/packageCouple/pages/join/join?code=' + encodeURIComponent(s.invite_code),
      imageUrl: share.cover('join')
    };
  },

  onShareTimeline() {
    const s = this.data.result;
    return {
      title: s && s.invite_code ? '有人给你留了一只小火苗' : '给这段关系，点亮一只火苗',
      query: s && s.invite_code ? 'code=' + encodeURIComponent(s.invite_code) : '',
      imageUrl: share.cover(s && s.invite_code ? 'join' : 'create')
    };
  }
""",
    'join/join.js': """
  onShareAppMessage() {
    const code = (this.data.code || '').trim();
    return {
      title: '有人给你留了一只小火苗',
      path: '/packageCouple/pages/join/join' + (code ? '?code=' + encodeURIComponent(code) : ''),
      imageUrl: share.cover('join')
    };
  },

  onShareTimeline() {
    const code = (this.data.code || '').trim();
    return {
      title: '有人给你留了一只小火苗',
      query: code ? 'code=' + encodeURIComponent(code) : '',
      imageUrl: share.cover('join')
    };
  }
""",
    'chat/chat.js': """
  onShareAppMessage: function () {
    return {
      title: '有些话，只说给懂的人听',
      path: share.homePath(),
      imageUrl: share.cover('chat')
    };
  },

  onShareTimeline: function () {
    return {
      title: '有些话，只说给懂的人听',
      query: share.timelineQuery(),
      imageUrl: share.cover('chat')
    };
  }
""",
    'timeline/timeline.js': """
  onShareAppMessage: function () {
    return {
      title: '把今天，收进我们的时光',
      path: share.homePath(),
      imageUrl: share.cover('timeline')
    };
  },

  onShareTimeline: function () {
    return {
      title: '把今天，收进我们的时光',
      query: share.timelineQuery(),
      imageUrl: share.cover('timeline')
    };
  }
""",
    'anniversary/anniversary.js': """
  onShareAppMessage: function () {
    const n = this.data.nextItem;
    const title = n && n.title
      ? '距离「' + n.title + '」还有 ' + n.days_left + ' 天'
      : '重要的日子，值得被记住';
    return { title: title, path: share.homePath(), imageUrl: share.cover('anniversary') };
  },

  onShareTimeline: function () {
    const n = this.data.nextItem;
    const title = n && n.title
      ? '距离「' + n.title + '」还有 ' + n.days_left + ' 天'
      : '重要的日子，值得被记住';
    return { title: title, query: share.timelineQuery(), imageUrl: share.cover('anniversary') };
  }
""",
    'listen/listen.js': """
  onShareAppMessage: function () {
    return {
      title: '有些话，想慢慢说给你听',
      path: share.homePath(),
      imageUrl: share.cover('listen')
    };
  },

  onShareTimeline: function () {
    return {
      title: '有些话，想慢慢说给你听',
      query: share.timelineQuery(),
      imageUrl: share.cover('listen')
    };
  }
""",
    'profile/profile.js': """
  onShareAppMessage: function () {
    return {
      title: '我们的小火苗 · 只属于两个人的小空间',
      path: '/packageCouple/pages/spaces/spaces',
      imageUrl: share.cover('bind')
    };
  },

  onShareTimeline: function () {
    return { title: '我们的小火苗 · 只属于两个人的小空间', imageUrl: share.cover('bind') };
  }
""",
    'timeline-edit/timeline-edit.js': """
  onShareAppMessage: function () {
    return { title: '今天，也收进我们的时光里', path: share.homePath(), imageUrl: share.cover('timeline') };
  },

  onShareTimeline: function () {
    return { title: '今天，也收进我们的时光里', query: share.timelineQuery(), imageUrl: share.cover('timeline') };
  }
""",
    'anniversary-edit/anniversary-edit.js': """
  onShareAppMessage: function () {
    return { title: '重要的日子，值得被记住', path: share.homePath(), imageUrl: share.cover('anniversary') };
  },

  onShareTimeline: function () {
    return { title: '重要的日子，值得被记住', query: share.timelineQuery(), imageUrl: share.cover('anniversary') };
  }
""",
}


def patch(rel, block):
    path = os.path.join(ROOT, rel)
    s = open(path, encoding='utf-8').read()
    # require share
    if "require('../../utils/share.js')" not in s:
        lines = s.splitlines()
        # 插到第一个 const ... require 后
        idx = None
        for i, line in enumerate(lines):
            if 'require(' in line and line.strip().startswith('const '):
                idx = i
                break
        if idx is None:
            idx = 0
        lines.insert(idx + 1, "const share = require('../../utils/share.js');")
        s = '\n'.join(lines)
    # 替换已有 share 块（从 onShareAppMessage 到结尾），否则在最后 }); 前插入
    if 'onShareAppMessage' in s:
        pat = re.compile(r'\n  onShareAppMessage:[\s\S]*?\n\}\);\s*$')
        if pat.search(s):
            s = pat.sub('\n' + block + '\n});\n', s)
        else:
            pat2 = re.compile(r'\n  onShareAppMessage\(\)[ \t]*\{[\s\S]*?\n\}\);\s*$')
            s = pat2.sub('\n' + block + '\n});\n', s)
    else:
        idx = s.rfind('\n});')
        if idx < 0:
            raise SystemExit('cannot patch ' + rel)
        s = s[:idx] + '\n' + block + s[idx:]
    open(path, 'w', encoding='utf-8').write(s)
    print('patched', rel)


def main():
    for rel, block in HANDLERS.items():
        patch(rel, block)


if __name__ == '__main__':
    main()

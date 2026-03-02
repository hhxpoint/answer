// utils/emotion-dict.js

// 这里的 key 必须和 Python 后台返回的字符串一模一样！
const emotionDictionary = {
  "开心 (Happy)": {
    label: "开心",
    emoji: "😄",
    color: "#ffc107", // 比如黄色
    desc: "这似乎是一段充满喜悦的语音，说话者心情很不错。保持这份好心情哦！"
  },
  "悲伤 (Sad)": {
    label: "悲伤",
    emoji: "😢",
    color: "#2196f3", // 比如蓝色
    desc: "语音中透着一丝低落与伤感。如果遇到不开心的事情，记得给自己一个拥抱。"
  },
  "生气 (Angry)": {
    label: "生气",
    emoji: "😡",
    color: "#f44336", // 比如红色
    desc: "情绪似乎有些激动和愤怒。深呼吸，试着让心情平复下来。"
  },
  "害怕 (Fear)": {
    label: "害怕",
    emoji: "😨",
    color: "#9c27b0", // 比如紫色
    desc: "声音中带着些许紧张与恐惧。别怕，你正处于安全的环境中。"
  },
  "惊讶 (Surprise)": {
    label: "惊讶",
    emoji: "😲",
    color: "#ff9800", // 比如橙色
    desc: "这段语音充满了意外感！似乎遇到了什么意想不到的事情。"
  },
  "厌恶 (Disgust)": {
    label: "厌恶",
    emoji: "🤢",
    color: "#4caf50", // 比如绿色
    desc: "语气中带有一些反感和排斥。尽量远离那些让你感到不适的事物吧。"
  },
  "中性 (Neutral)": {
    label: "平静",
    emoji: "😐",
    color: "#9e9e9e", // 比如灰色
    desc: "情绪非常平稳，没有明显的波澜。这是一段理智客观的表达。"
  }
};

module.exports = {
  getEmotionDetail: function(resultKey) {
    // 如果找不到匹配的，就返回一个默认的
    return emotionDictionary[resultKey] || {
      label: "未知",
      emoji: "🤔",
      color: "#607d8b",
      desc: "AI 暂时无法准确判断这段语音的情绪密码。"
    };
  }
}
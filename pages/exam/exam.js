// // pages/exam/exam.js
// const repo408 = require('../../data/ky_408.js');
// const repoMath = require('../../data/ky_math1.js');

// /**
//  * 核心魔法函数：将文本中的 $...$ 转换为 <img> 标签
//  * SVG 矢量图保证无论怎么放大都不模糊，且完美融合进原有文字行中
//  */


// // function formatLatex(str) {
// //   if (!str) return '';
// //   // 匹配 $ 包裹的内容
// //   return str.replace(/\$(.*?)\$/g, function(match, formula) {
// //     // 将公式字符串进行 URI 编码，防止特殊字符丢失
// //     const encodedFormula = encodeURIComponent(formula.trim());
// //     // 使用稳定的 LaTeX 转 SVG 接口
// //     const imgUrl = `https://latex.codecogs.com/svg.image?${encodedFormula}`;
// //     // 关键样式：vertical-align: middle 让公式和汉字完美对齐，height 控制公式大小不突兀
// //     return `<img src="${imgUrl}" style="vertical-align: middle; display: inline-block; height: 1.2em; margin: 0 4px;" />`;
// //   });
// // }

// function formatLatex(str) {
//   if (!str) return '';

//   // 1. 处理块级公式 \[...\] 或 $$...$$（通常独立成行）
//   str = str.replace(/(?:\\\[|\$\$)([\s\S]*?)(?:\\\]|\$\$)/g, (match, formula) => {
//     const encoded = encodeURIComponent(formula.trim());
//     // 块级公式：block 显示，居中，固定高度 24px，宽度自适应，上下加间距
//     return `<img src="https://latex.codecogs.com/svg.image?${encoded}" 
//       style="display: block; margin: 8px auto; height: 24px; width: auto; max-width: 100%;" />`;
//   });

//   // 2. 处理行内公式 \(...\) 或 $...$
//   str = str.replace(/(?:\\\(|\$)(.*?)(?:\\\)|\$)/g, (match, formula) => {
//     const encoded = encodeURIComponent(formula.trim());
//     // 行内公式：inline-block 显示，垂直居中，固定高度 18px，左右微距
//     return `<img src="https://latex.codecogs.com/svg.image?${encoded}" 
//       style="vertical-align: middle; display: inline-block; height: 18px; width: auto; margin: 0 2px;" />`;
//   });

//   return str;
// }




// Page({
//   data: {
//     list: [],
//     index: 0,
//     currentQuestion: null,
//     selected: '',      
//     inputValue: '',    
//     isSubmitted: false,
//     isCorrect: false,
    
//     // 用于存储带有 <img> 标签的富文本内容
//     richTitle: '',
//     richOptions: [],
//     richAnalysis: ''
//   },

//   onLoad: function(options) {
//     const type = options.type || 'math';
//     let selectedRepo = type === '408' ? repo408 : repoMath;
//     let title = type === '408' ? '408 计算机综合' : '考研数学一';

//     wx.setNavigationBarTitle({ title: title });
    
//     this.setData({
//       list: selectedRepo
//     }, () => {
//       this.loadQuestion(0);
//     });
//   },

//   loadQuestion: function(index) {
//     const question = this.data.list[index];
//     if (!question) return;
    
//     // 1. 解析题干
//     let richTitle = formatLatex(question.title);
    
//     // 2. 解析选项
//     let richOptions = [];
//     if (question.type === 'choice' && question.options) {
//       richOptions = question.options.map(opt => ({
//         label: opt.label,
//         content: opt.content,
//         // 把选项内容也变成富文本
//         richContent: formatLatex(opt.content)
//       }));
//     }
    
//     // 3. 解析题目解析
//     let richAnalysis = '';
//     if (question.analysis) {
//       richAnalysis = formatLatex(question.analysis);
//     }
    
//     this.setData({
//       index: index,
//       currentQuestion: question,
//       richTitle: richTitle,       // 赋值解析后的题干
//       richOptions: richOptions,   // 赋值解析后的选项
//       richAnalysis: richAnalysis, // 赋值解析后的解析
//       selected: '',
//       inputValue: '',
//       isSubmitted: false,
//       isCorrect: false
//     });
    
//     wx.pageScrollTo({ scrollTop: 0 });
//   },

//   onInput: function(e) {
//     this.setData({ inputValue: e.detail.value });
//   },

//   onSelect: function(e) {
//     if (this.data.isSubmitted) return;
//     this.setData({ selected: e.currentTarget.dataset.label });
//   },

//   checkAnswer: function() {
//     const q = this.data.currentQuestion;
//     let userAns = q.type === 'choice' ? this.data.selected : this.data.inputValue;

//     if (!userAns || userAns.toString().trim() === "") {
//       wx.showToast({ title: '请先完成作答', icon: 'none' });
//       return;
//     }

//     const finalUser = userAns.toString().trim().toLowerCase();
//     const finalCorrect = q.answer.toString().trim().toLowerCase();

//     this.setData({
//       isSubmitted: true,
//       isCorrect: finalUser === finalCorrect
//     });
//   },

//   nextQuestion: function() {
//     const nextIdx = this.data.index + 1;
//     if (nextIdx < this.data.list.length) {
//       this.loadQuestion(nextIdx);
//     } else {
//       wx.showModal({
//         title: '全部做完啦',
//         content: '建议针对错题进行专项复习！',
//         showCancel: false,
//         success: () => { wx.navigateBack(); }
//       });
//     }
//   },

//   onShareAppMessage: function () {
//     return { title: '408对抗路，没有对手，全是朋友', path: '/pages/exam/exam' }
//   },
//   onShareTimeline: function () {
//     return { title: '408对抗路，没有对手，全是朋友' }
//   }
// });













// pages/exam/exam.js
const repo408 = require('../../data/ky_408.js');
const repoMath = require('../../data/ky_math1.js');

/**
 * 将文本中的 LaTeX 公式（支持 $...$、$$...$$、\(...\)、\[...\]）转为固定大小图片
 * 行内公式高度 18px，块级公式高度 24px，保证统一尺寸
 */
function formatLatex(str) {
  if (!str || typeof str !== 'string') return '';

  // 1. 处理块级公式 \[...\] 或 $$...$$（通常独立成行）
  str = str.replace(/(?:\\\[|\$\$)([\s\S]*?)(?:\\\]|\$\$)/g, (match, formula) => {
    const encoded = encodeURIComponent(formula.trim());
    return `<img src="https://latex.codecogs.com/svg.image?${encoded}" 
      style="display: block; margin: 8px auto; height: 24px; width: auto; max-width: 100%;" />`;
  });

  // 2. 处理行内公式 \(...\) 或 $...$
  str = str.replace(/(?:\\\(|\$)(.*?)(?:\\\)|\$)/g, (match, formula) => {
    const encoded = encodeURIComponent(formula.trim());
    return `<img src="https://latex.codecogs.com/svg.image?${encoded}" 
      style="vertical-align: middle; display: inline-block; height: 18px; width: auto; margin: 0 2px;" />`;
  });

  return str;
}

Page({
  data: {
    list: [],
    index: 0,
    currentQuestion: null,
    selected: '',      
    inputValue: '',    
    isSubmitted: false,
    isCorrect: false,
    // 转换后的富文本 HTML 字符串
    richTitle: '',
    richOptions: [],
    richAnalysis: ''
  },

  onLoad(options) {
    const type = options.type || 'math';
    const selectedRepo = type === '408' ? repo408 : repoMath;
    const title = type === '408' ? '408 计算机综合' : '考研数学一';

    wx.setNavigationBarTitle({ title });

    this.setData({ list: selectedRepo }, () => {
      this.loadQuestion(0);
    });
  },

  loadQuestion(index) {
    const question = this.data.list[index];
    if (!question) return;

    // 转换题干（支持所有定界符）
    const richTitle = formatLatex(question.title);

    // 转换选项（仅选择题）
    let richOptions = [];
    if (question.type === 'choice' && Array.isArray(question.options)) {
      richOptions = question.options.map(opt => ({
        label: opt.label,
        richContent: formatLatex(opt.content) // 选项内容也要转换
      }));
    }

    // 转换解析（如果有）
    const richAnalysis = question.analysis ? formatLatex(question.analysis) : '';

    this.setData({
      index,
      currentQuestion: question,
      richTitle,
      richOptions,
      richAnalysis,
      selected: '',
      inputValue: '',
      isSubmitted: false,
      isCorrect: false
    });

    wx.pageScrollTo({ scrollTop: 0 });
  },

  onInput(e) {
    this.setData({ inputValue: e.detail.value });
  },

  onSelect(e) {
    if (this.data.isSubmitted) return;
    this.setData({ selected: e.currentTarget.dataset.label });
  },

  checkAnswer() {
    const q = this.data.currentQuestion;
    const userAns = q.type === 'choice' ? this.data.selected : this.data.inputValue;

    if (!userAns || userAns.toString().trim() === '') {
      wx.showToast({ title: '请先完成作答', icon: 'none' });
      return;
    }

    const finalUser = userAns.toString().trim().toLowerCase();
    const finalCorrect = q.answer.toString().trim().toLowerCase();

    this.setData({
      isSubmitted: true,
      isCorrect: finalUser === finalCorrect
    });
  },

  nextQuestion() {
    const nextIdx = this.data.index + 1;
    if (nextIdx < this.data.list.length) {
      this.loadQuestion(nextIdx);
    } else {
      wx.showModal({
        title: '全部做完啦',
        content: '建议针对错题进行专项复习！',
        showCancel: false,
        success: () => wx.navigateBack()
      });
    }
  },

  onShareAppMessage() {
    return { title: '408对抗路，没有对手，全是朋友', path: '/pages/exam/exam' };
  },

  onShareTimeline() {
    return { title: '408对抗路，没有对手，全是朋友' };
  }

  
});
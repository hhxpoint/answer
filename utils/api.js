// // utils/api.js

// // 这是你的 Hugging Face 接口专属地址
// const HF_API_URL = "https://hhxpoint-voice-emotion-api.hf.space/run/predict";

// const requestEmotionAnalysis = (filePath) => {
//   return new Promise((resolve, reject) => {
//     // 1. 读取本地录音文件，转换为 Base64 格式
//     const fs = wx.getFileSystemManager();
//     fs.readFile({
//       filePath: filePath,
//       encoding: 'base64',
//       success: (res) => {
//         const base64Data = res.data;
//         // 拼接成 Gradio API 需要的格式
//         const audioDataUri = `data:audio/mp3;base64,${base64Data}`;

//         // 2. 发送网络请求给你的云服务器
//         wx.request({
//           url: HF_API_URL,
//           method: 'POST',
//           header: {
//             'content-type': 'application/json'
//           },
//           data: {
//             // Gradio 接口固定的数据格式
//             data: [
//               {
//                 name: "audio.mp3",
//                 data: audioDataUri
//               }
//             ]
//           },
//           success: (apiRes) => {
//             console.log("云端返回结果:", apiRes.data);
//             if (apiRes.data && apiRes.data.data) {
//               // 成功拿到结果，比如 "开心 (Happy)"
//               resolve(apiRes.data.data[0]);
//             } else {
//               reject(new Error("服务器返回格式异常"));
//             }
//           },
//           fail: (err) => {
//             console.error("请求失败:", err);
//             reject(new Error("网络请求失败，请检查网络或服务器状态"));
//           }
//         });
//       },
//       fail: (err) => {
//         console.error("读取录音文件失败:", err);
//         reject(new Error("无法读取录音文件"));
//       }
//     });
//   });
// };

// module.exports = {
//   analyzeAudio: requestEmotionAnalysis
// }





// // utils/api.js

// // 💥 结合你的截图，这是最精确的官方接口地址
// //const HF_API_URL = "https://hhxpoint-voice-emotion-api.hf.space/run/analyze_audio";

// const HF_API_URL = "https://hhxpoint-voice-emotion-api.hf.space/api/predict";

// const requestEmotionAnalysis = (filePath) => {
//   return new Promise((resolve, reject) => {
//     const fs = wx.getFileSystemManager();
    
//     // 1. 读取录音文件，转成 Base64
//     fs.readFile({
//       filePath: filePath,
//       encoding: 'base64',
//       success: (res) => {
//         const base64Data = res.data;
//         // 拼接成标准的 Data URI 格式
//         const audioDataUri = `data:audio/mp3;base64,${base64Data}`;

//         console.log("🚀 正在向官方接口 /analyze_audio 发送请求...");

//         // 2. 使用微信原生的 request 发送 HTTP 请求
//         wx.request({
//           url: HF_API_URL,
//           method: 'POST',
//           header: {
//             'content-type': 'application/json'
//           },
//           data: {
//             // 💥 核心修改：模拟 @gradio/client 的底层数据结构
//             // Gradio 接收文件时，喜欢接收这种包含 name 和 data 的对象数组
//             data: [
//               {
//                 name: "record.mp3",
//                 data: audioDataUri
//               }
//             ]
//           },
//           success: (apiRes) => {
//             console.log("✅ 云端原始返回:", apiRes);
            
//             // 状态码 200 代表服务器成功接收并处理了
//             if (apiRes.statusCode === 200 && apiRes.data && apiRes.data.data) {
//               // 提取出真正的情绪结果，比如 "开心 (Happy)"
//               resolve(apiRes.data.data[0]);
//             } else {
//               console.error("❌ 返回格式不对:", apiRes.data);
//               reject(new Error("服务器处理异常"));
//             }
//           },
//           fail: (err) => {
//             console.error("❌ 微信请求失败:", err);
//             reject(new Error("网络请求失败，请检查网络配置"));
//           }
//         });
//       },
//       fail: (err) => {
//         console.error("读取录音文件失败:", err);
//         reject(new Error("无法读取本地录音"));
//       }
//     });
//   });
// };

// module.exports = {
//   analyzeAudio: requestEmotionAnalysis
// }




// // utils/api.js

// const HF_API_URL = "https://hhxpoint-voice-emotion-api.hf.space/run/predict";

// const requestEmotionAnalysis = (filePath) => {
//   return new Promise((resolve, reject) => {
//     const fs = wx.getFileSystemManager();
    
//     // 1. 获取文件信息，获取文件大小
//     fs.getFileInfo({
//       filePath: filePath,
//       success: (fileInfo) => {
//         const fileSize = fileInfo.size;

//         // 2. 读取录音文件，转成 Base64
//         fs.readFile({
//           filePath: filePath,
//           encoding: 'base64',
//           success: (res) => {
//             const base64Data = res.data;
//             const audioDataUri = `data:audio/mp3;base64,${base64Data}`;

//             console.log("🚀 正在向官方接口发送请求...");

//             // 3. 构造符合 Gradio 规范的请求体
//             const requestData = {
//               "fn_index": 0,
//               "data": [
//                 {
//                   "name": "record.mp3",
//                   "data": audioDataUri,
//                   "size": fileSize
//                 }
//               ]
//             };

//             wx.request({
//               url: HF_API_URL,
//               method: 'POST',
//               header: {
//                 'Content-Type': 'application/json'
//               },
//               data: requestData,
//               success: (apiRes) => {
//                 console.log("✅ 云端原始返回:", apiRes);
                
//                 if (apiRes.statusCode === 200 && apiRes.data && apiRes.data.data) {
//                   // 提取出真正的情绪结果
//                   resolve(apiRes.data.data[0]);
//                 } else {
//                   console.error("❌ 返回格式不对:", apiRes.data);
//                   reject(new Error("服务器处理异常"));
//                 }
//               },
//               fail: (err) => {
//                 console.error("❌ 微信请求失败:", err);
//                 reject(new Error("网络请求失败，请检查网络配置"));
//               }
//             });
//           },
//           fail: (err) => {
//             console.error("读取录音文件失败:", err);
//             reject(new Error("无法读取本地录音"));
//           }
//         });
//       },
//       fail: (err) => {
//         console.error("获取文件信息失败:", err);
//         reject(new Error("无法获取文件信息"));
//       }
//     });
//   });
// };

// module.exports = {
//   analyzeAudio: requestEmotionAnalysis
// };






// // utils/api.js
// // 适配 FastAPI 纯 HTTP 接口的语音情感分析调用

// // 👇 替换成你的 Space 地址（结尾不要加 /）
// const HF_API_URL = "https://hhxpoint-voice-emotion-api.hf.space";

// /**
//  * 调用语音情感分析 API（FastAPI 版本）
//  * @param {string} filePath 小程序本地录音文件路径
//  * @returns {Promise<string>} 情感分析结果
//  */
// const requestEmotionAnalysis = (filePath) => {
//   return new Promise((resolve, reject) => {
//     const fs = wx.getFileSystemManager();

//     // 读取文件为二进制（关键：FastAPI 接收文件流）
//     fs.readFile({
//       filePath: filePath,
//       encoding: 'binary', // 二进制格式，不是 base64！
//       success: (res) => {
//         console.log("[API] 读取文件成功，准备上传");

//         // 构造 FormData（模拟表单上传文件）
//         const formData = {
//           file: {
//             name: 'record.mp3', // 文件名
//             type: 'audio/mp3',  // 文件类型
//             content: res.data   // 二进制文件内容
//           }
//         };

//         // 发送 POST 请求
//         wx.uploadFile({
//           url: `${HF_API_URL}/analyze_audio`, // 接口路径
//           filePath: filePath,                 // 本地文件路径
//           name: 'file',                       // 对应后端的 file 参数名
//           header: {
//             'Content-Type': 'multipart/form-data'
//           },
//           formData: {},
//           success: (uploadRes) => {
//             console.log("[API] 上传成功，返回数据：", uploadRes.data);
//             try {
//               const result = JSON.parse(uploadRes.data);
//               if (result.code === 200) {
//                 resolve(result.data.emotion); // 提取情感结果
//               } else {
//                 reject(new Error(result.msg || "分析失败"));
//               }
//             } catch (e) {
//               reject(new Error("解析返回结果失败：" + e.message));
//             }
//           },
//           fail: (err) => {
//             console.error("[API] 上传失败：", err);
//             reject(new Error(`请求失败：${err.errMsg}`));
//           }
//         });
//       },
//       fail: (err) => {
//         console.error("[API] 读取文件失败：", err);
//         reject(new Error(`读取文件失败：${err.errMsg}`));
//       }
//     });
//   });
// };

// module.exports = {
//   analyzeAudio: requestEmotionAnalysis
// };









// // utils/api.js（正式环境终极版）
// const HF_API_URL = "https://hhxpoint-voice-emotion-api.hf.space";

// /**
//  * 调用语音情感分析 API（适配小程序正式环境）
//  * @param {string} filePath 小程序本地录音文件路径
//  * @returns {Promise<string>} 情感分析结果
//  */
// const requestEmotionAnalysis = (filePath) => {
//   return new Promise((resolve, reject) => {
//     // 1. 基础校验
//     if (!filePath || !filePath.endsWith('.mp3')) {
//       reject(new Error("仅支持 MP3 格式音频文件"));
//       return;
//     }

//     // 2. 正式环境：极简版 uploadFile（去掉多余头，避免被拦截）
//     wx.uploadFile({
//       url: `${HF_API_URL}/analyze_audio`,
//       filePath: filePath,
//       name: 'file', // 必须和后端的 file 参数名一致
//       // 正式环境：只保留必要的 Content-Type（让微信自动生成）
//       header: {
//         'Accept': 'application/json'
//       },
//       timeout: 15000, // 延长超时（HF 服务器响应慢）
//       success: (res) => {
//         console.log("正式环境返回原始数据：", res);
//         // 3. 严格解析结果
//         if (res.statusCode !== 200) {
//           reject(new Error(`服务器返回错误码：${res.statusCode}`));
//           return;
//         }
//         try {
//           const result = JSON.parse(res.data);
//           if (result.code === 200) {
//             resolve(result.data.emotion);
//           } else {
//             reject(new Error(result.msg || "分析失败"));
//           }
//         } catch (e) {
//           reject(new Error("解析结果失败：" + e.message));
//         }
//       },
//       fail: (err) => {
//         // 4. 明确错误原因
//         let errMsg = "网络请求失败";
//         if (err.errMsg.includes("timeout")) {
//           errMsg = "请求超时（请稍后重试）";
//         } else if (err.errMsg.includes("security")) {
//           errMsg = "安全校验失败（域名未配置）";
//         } else if (err.errMsg.includes("connect")) {
//           errMsg = "服务器连接失败";
//         }
//         reject(new Error(errMsg));
//       }
//     });
//   });
// };

// module.exports = {
//   analyzeAudio: requestEmotionAnalysis
// };






// utils/api.js
const HF_API_URL = "https://hhxpoint-voice-emotion-api.hf.space";

const requestEmotionAnalysis = (filePath) => {
  return new Promise((resolve, reject) => {
    if (!filePath) {
      reject("录音文件路径为空");
      return;
    }

    console.log("开始上传文件：", filePath);
    wx.uploadFile({
      url: `${HF_API_URL}/analyze_audio`,
      filePath: filePath,
      name: 'file',
      timeout: 20000,
      success(res) {
        console.log("上传成功，服务器返回：", res);
        try {
          const data = JSON.parse(res.data);
          if (data.code === 200) {
            resolve(data.data.emotion);
          } else {
            reject(`服务器错误：${data.msg || "未知错误"}`);
          }
        } catch (e) {
          reject(`解析失败：${e.message}，返回数据：${res.data}`);
        }
      },
      fail(err) {
        // 关键：打印完整错误对象
        console.error("【wx.uploadFile 失败详情】", err);
        reject(`网络请求失败：${err.errMsg} (错误码: ${err.errNo})`);
      }
    });
  });
};

module.exports = {
  analyzeAudio: requestEmotionAnalysis
};
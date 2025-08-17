/**
 * 【注意】这个文件已被 request.js 替代，保留是为了向后兼容
 * 新代码请使用 request.js 中的 api 对象
 */

// 导入新API实现
const { api: newApi, request: newRequest } = require('./request');
const constants = require("./constants");
const BASE_URL = constants.BASE_URL
// API基础URL

/* global wx */

/**
 * 发送请求
 * @param {Object} options 请求选项
 * @returns {Promise} 请求结果
 */
const request = (options) => {
  console.warn('utils/api.js已弃用，请使用utils/request.js');
  return newRequest(options);
};

// 将所有API调用重定向到新API
const api = newApi;

// 导出兼容性接口
module.exports = {
  api,
  request
}; 
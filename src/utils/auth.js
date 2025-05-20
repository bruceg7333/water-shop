/**
 * 认证相关工具函数
 */
import api from './api';
const i18n = require('./i18n/index');

// 获取全局wx对象
/* global wx */

// 上次登录提示时间
let lastLoginToastTime = 0;

/**
 * 检查是否已登录
 * @returns {boolean} 是否已登录
 */
export const isLoggedIn = () => {
  const token = wx.getStorageSync('token');
  const isLoggedIn = wx.getStorageSync('isLoggedIn');
  return !!token && !!isLoggedIn;
};

/**
 * 退出登录
 */
export const logout = () => {
  wx.removeStorageSync('token');
  wx.removeStorageSync('userInfo');
  wx.removeStorageSync('isLoggedIn');
};

/**
 * 获取用户信息
 * @returns {Object|null} 用户信息
 */
export const getUserInfo = () => {
  return wx.getStorageSync('userInfo') || null;
};

/**
 * 保存登录信息
 * @param {Object} data 登录返回的数据
 */
export const saveLoginInfo = (data) => {
  if (data && data.token) {
    wx.setStorageSync('token', data.token);
    wx.setStorageSync('userInfo', data.user);
    wx.setStorageSync('isLoggedIn', true);
    
    // 登录成功后同步本地购物车
    syncLocalCartAfterLogin();
    
    return true;
  }
  return false;
};

/**
 * 同步本地购物车到服务器
 */
export const syncLocalCartAfterLogin = async () => {
  try {
    const localCart = wx.getStorageSync('localCart') || [];
    
    // 如果本地购物车有商品，则同步到服务器
    if (localCart.length > 0) {
      await api.syncCart({ localCart });
      
      // 同步成功后清空本地购物车
      wx.removeStorageSync('localCart');
      
      console.log('购物车同步成功');
    }
  } catch (error) {
    console.error('购物车同步失败:', error);
  }
};

/**
 * 添加商品到本地购物车
 * @param {string} productId 商品ID
 * @param {number} quantity 数量
 */
export const addToLocalCart = (productId, quantity = 1) => {
  let localCart = wx.getStorageSync('localCart') || [];
  
  // 查找商品是否已存在于购物车
  const existingItemIndex = localCart.findIndex(item => item.productId === productId);
  
  if (existingItemIndex > -1) {
    // 更新数量
    localCart[existingItemIndex].quantity += quantity;
  } else {
    // 添加新商品
    localCart.push({
      productId,
      quantity
    });
  }
  
  // 保存到本地存储
  wx.setStorageSync('localCart', localCart);
};

/**
 * 检查用户是否已登录
 * @param {Object} options 配置选项
 * @param {boolean} options.redirectOnFail 登录失败时是否跳转到登录页面
 * @param {boolean} options.showToast 是否显示提示
 * @param {number} options.toastDebounceTime 提示的防抖时间(毫秒)
 * @param {string} options.redirectUrl 登录成功后重定向的URL
 * @returns {boolean} 是否已登录
 */
export const checkLogin = (options = {}) => {
  // 默认配置
  const defaultOptions = {
    redirectOnFail: true, // 默认登录失败时跳转
    showToast: true, // 默认显示提示
    toastDebounceTime: 3000, // 默认3秒内不重复提示
    redirectUrl: '' // 默认无特定重定向URL
  };
  
  // 合并选项
  const { redirectOnFail, showToast, toastDebounceTime, redirectUrl } = { ...defaultOptions, ...options };
  
  // 检查是否已登录
  const logged = isLoggedIn();
  
  // 未登录且需要处理
  if (!logged && (redirectOnFail || showToast)) {
    const now = Date.now();
    
    // 检查是否需要防抖
    if (showToast && now - lastLoginToastTime < toastDebounceTime) {
      // 在防抖时间内，不显示重复提示
      return logged;
    }
    
    // 更新上次提示时间
    lastLoginToastTime = now;
    
    if (showToast) {
      wx.showToast({
        title: i18n.t('common.loginFirst') || '请先登录',
        icon: 'none',
        duration: 2000
      });
    }
    
    // 保存重定向URL
    if (redirectUrl) {
      wx.setStorageSync('redirectUrl', redirectUrl);
    }
    
    // 延迟跳转，让用户看到提示
    if (redirectOnFail) {
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/member/login'
        });
      }, 1000);
    }
  }
  
  return logged;
};

/**
 * 登录成功后跳转回原页面
 */
export const redirectAfterLogin = () => {
  const redirectUrl = wx.getStorageSync('redirectUrl');
  console.log('尝试跳转到原页面:', redirectUrl);
  
  if (redirectUrl) {
    wx.removeStorageSync('redirectUrl');
    
    // 如果是tabBar页面，需要使用switchTab
    if (['/pages/home/index', '/pages/cart/index', '/pages/profile/index'].includes(redirectUrl)) {
      console.log('跳转到tabBar页面:', redirectUrl);
      wx.switchTab({
        url: redirectUrl,
        fail: (err) => {
          console.error('跳转到tabBar页面失败:', err);
          // 默认跳转到首页
          wx.switchTab({
            url: '/pages/home/index'
          });
        }
      });
    } else {
      console.log('跳转到非tabBar页面:', redirectUrl);
      wx.navigateTo({ 
        url: redirectUrl,
        fail: (err) => {
          console.error('navigateTo跳转失败:', err);
          // 尝试使用reLaunch
          wx.reLaunch({
            url: redirectUrl,
            fail: (reLaunchErr) => {
              console.error('reLaunch跳转也失败:', reLaunchErr);
              // 返回首页
              wx.switchTab({
                url: '/pages/home/index'
              });
            }
          });
        }
      });
    }
  } else {
    // 没有重定向URL，跳转到首页
    console.log('没有重定向URL，跳转到首页');
    wx.switchTab({
      url: '/pages/home/index'
    });
  }
};

/**
 * 处理API响应错误
 * @param {Object} error 错误对象
 * @param {boolean} showError 是否显示错误提示
 * @returns {boolean} 是否需要登录
 */
export const handleApiError = (error, showError = true) => {
  const response = error.response || {};
  const data = response.data || {};
  
  // 检查是否需要登录
  if (data.needLogin) {
    // 检查是否在防抖时间内
    const now = Date.now();
    if (now - lastLoginToastTime < 3000) {
      return true; // 在防抖时间内，不显示重复提示
    }
    
    // 更新上次提示时间
    lastLoginToastTime = now;
    
    wx.showModal({
      title: i18n.t('common.tip') || '提示',
      content: data.message || i18n.t('common.loginFirst') || '请先登录',
      confirmText: i18n.t('common.confirm') || '确定',
      cancelText: i18n.t('common.cancel') || '取消',
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/member/login'
          });
        }
      }
    });
    return true;
  }
  
  // 显示普通错误提示
  if (showError) {
    wx.showModal({
      title: i18n.t('common.error') || '错误',
      content: data.message || i18n.t('common.operationFailed') || '操作失败，请稍后再试',
      confirmText: i18n.t('common.confirm') || '确定',
      showCancel: false
    });
  }
  
  return false;
}; 
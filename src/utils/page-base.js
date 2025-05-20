/**
 * 页面基础模块
 * 为页面提供统一的国际化支持
 */
const i18n = require('./i18n/index');

/**
 * 增强Page配置的函数
 * @param {Object} pageConfig 页面配置对象
 * @returns {Object} 增强后的页面配置对象
 */
function createPage(pageConfig) {
  // 保存原始的生命周期函数
  const originOnLoad = pageConfig.onLoad;
  const originOnShow = pageConfig.onShow;
  const originOnUnload = pageConfig.onUnload;
  
  // 创建新的生命周期函数
  pageConfig.onLoad = function(options) {
    // 初始化国际化文本
    if (typeof this.updateI18nText === 'function') {
      this.updateI18nText();
    }
    
    // 注册页面到全局国际化管理
    const pages = getApp().globalData.i18nPages || [];
    if (!pages.includes(this)) {
      pages.push(this);
      getApp().globalData.i18nPages = pages;
    }
    
    // 调用原始的onLoad
    if (typeof originOnLoad === 'function') {
      originOnLoad.call(this, options);
    }
  };
  
  pageConfig.onShow = function() {
    // 检查语言是否已更新，如果更新则重新渲染国际化文本
    const app = getApp();
    const currentLang = i18n.getCurrentLang();
    
    if (app.globalData.lastLanguage !== currentLang) {
      app.globalData.lastLanguage = currentLang;
      
      // 更新国际化文本
      if (typeof this.updateI18nText === 'function') {
        this.updateI18nText();
      }
    }
    
    // 调用原始的onShow
    if (typeof originOnShow === 'function') {
      originOnShow.call(this);
    }
  };
  
  pageConfig.onUnload = function() {
    // 从全局国际化管理中注销页面
    const app = getApp();
    const pages = app.globalData.i18nPages || [];
    const index = pages.indexOf(this);
    
    if (index > -1) {
      pages.splice(index, 1);
      app.globalData.i18nPages = pages;
    }
    
    // 调用原始的onUnload
    if (typeof originOnUnload === 'function') {
      originOnUnload.call(this);
    }
  };
  
  // 添加t方法，方便页面直接使用国际化
  pageConfig.t = function(key, params) {
    return i18n.t(key, params);
  };
  
  // 添加更新当前页面的国际化文本
  if (!pageConfig.updateI18nText) {
    pageConfig.updateI18nText = function() {
      console.warn('页面未实现updateI18nText方法，无法更新国际化文本');
    };
  }
  
  // 添加语言切换方法
  pageConfig.switchLanguage = function(lang) {
    if (!lang) return;
    
    // 设置新语言
    i18n.switchLang(lang);
    
    // 更新当前页面文本
    if (typeof this.updateI18nText === 'function') {
      this.updateI18nText();
    }
    
    // 通知其他页面更新文本
    const app = getApp();
    app.globalData.lastLanguage = lang;
    app.globalData.language = lang;
    
    // 触发全局事件
    app.globalData.eventBus.emit('languageChanged', lang);
    
    // 显示语言切换成功提示
    wx.showToast({
      title: i18n.t('home.toast.langSwitched'),
      icon: 'success',
      duration: 2000
    });
  };
  
  // 添加日期格式化方法
  pageConfig.formatDate = function(date, format) {
    return i18n.formatDate(date, format);
  };
  
  return pageConfig;
}

/**
 * 增强Component配置的函数
 * @param {Object} componentConfig 组件配置对象
 * @returns {Object} 增强后的组件配置对象
 */
function createComponent(componentConfig) {
  // 确保methods对象存在
  componentConfig.methods = componentConfig.methods || {};
  
  // 添加t方法，方便组件直接使用国际化
  componentConfig.methods.t = function(key, params) {
    return i18n.t(key, params);
  };
  
  // 添加更新当前组件的国际化文本
  if (!componentConfig.methods.updateI18nText) {
    componentConfig.methods.updateI18nText = function() {
      console.warn('组件未实现updateI18nText方法，无法更新国际化文本');
    };
  }
  
  // 添加语言切换方法
  componentConfig.methods.switchLanguage = function(lang) {
    if (!lang) return;
    
    // 设置新语言
    i18n.switchLang(lang);
    
    // 更新当前组件文本
    if (typeof this.updateI18nText === 'function') {
      this.updateI18nText();
    }
    
    // 获取全局应用实例
    const app = getApp();
    if (app) {
      app.globalData.lastLanguage = lang;
      app.globalData.language = lang;
      
      // 触发全局事件
      if (app.globalData.eventBus) {
        app.globalData.eventBus.emit('languageChanged', lang);
      }
    }
  };
  
  // 保存原始的生命周期函数
  const originAttached = componentConfig.attached;
  const originDetached = componentConfig.detached;
  
  // 替换生命周期函数
  componentConfig.attached = function() {
    // 初始化国际化文本
    if (typeof this.updateI18nText === 'function') {
      this.updateI18nText();
    }
    
    // 调用原始的attached
    if (typeof originAttached === 'function') {
      originAttached.call(this);
    }
  };
  
  return componentConfig;
}

module.exports = {
  createPage,
  createComponent
}; 
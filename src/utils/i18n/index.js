/**
 * 获取应用实例的安全方法
 * 避免在模块导入时就尝试获取实例导致的错误
 */
function getAppSafe() {
  try {
    return getApp();
  } catch(e) {
    console.error('无法获取应用实例:', e);
    return null;
  }
}

/**
 * 国际化文本模块
 */
const zh_CN = require('./zh_CN');
const zh_TW = require('./zh_TW');
const en = require('./en');
const th = require('./th');

// 支持的语言包
const LANG_PACKS = {
  zh_CN, // 简体中文
  zh_TW, // 繁体中文
  en,    // 英文
  th     // 泰文
};

// 默认语言
const DEFAULT_LANG = 'zh_CN';

/**
 * 国际化模块
 */
const i18n = {
  /**
   * 获取当前语言
   */
  getCurrentLang() {
    // 先从缓存中获取语言设置
    try {
      const app = getAppSafe();
      return app && app.globalData ? app.globalData.language : wx.getStorageSync('language') || DEFAULT_LANG;
    } catch (e) {
      console.error('获取当前语言失败:', e);
      return wx.getStorageSync('language') || DEFAULT_LANG;
    }
  },

  /**
   * 获取支持的语言列表
   */
  getSupportedLanguages() {
    return [
      { code: 'zh_CN', name: '简体中文' },
      { code: 'en', name: 'English' },
      { code: 'zh_TW', name: '繁體中文' },
      { code: 'th', name: 'ภาษาไทย' }
    ];
  },

  /**
   * 切换语言
   * @param {string} lang 语言代码
   */
  switchLang(lang) {
    try {
      const app = getAppSafe();
      if (app && app.switchLanguage) {
        app.switchLanguage(lang);
      } else {
        wx.setStorageSync('language', lang);
      }
    } catch (e) {
      console.error('切换语言失败:', e);
      wx.setStorageSync('language', lang);
    }
  },

  /**
   * 获取翻译文本
   * @param {string} key 文本键值
   * @param {Object} params 替换参数
   */
  t(key, params = {}) {
    // 获取当前语言
    const currentLang = this.getCurrentLang();
    
    // 获取当前语言包
    const langPack = LANG_PACKS[currentLang] || LANG_PACKS[DEFAULT_LANG];
    
    // 根据键值获取文本
    let text = this._getTextByKey(langPack, key);
    
    // 如果在当前语言包中找不到文本，则尝试使用默认语言包
    if (!text && currentLang !== DEFAULT_LANG) {
      text = this._getTextByKey(LANG_PACKS[DEFAULT_LANG], key);
    }
    
    // 如果还是没找到文本，则返回键值本身
    if (!text) {
      return key;
    }
    
    // 替换参数
    return this._replaceParams(text, params);
  },

  /**
   * 根据键值获取文本
   * @param {Object} langPack 语言包
   * @param {string} key 文本键值，可以是 'key' 或 'module.key'
   */
  _getTextByKey(langPack, key) {
    if (!langPack) return '';
    
    // 处理多级键值，例如 'home.title'
    const keys = key.split('.');
    let result = langPack;
    
    try {
      for (const k of keys) {
        if (!result || typeof result !== 'object') {
          console.warn(`国际化警告: 访问键 "${key}" 时，中间键 "${k}" 不存在或不是对象`);
          return '';
        }
        result = result[k];
      }
      
      // 记录非字符串类型的键值，帮助调试
      if (result !== null && result !== undefined && typeof result !== 'string' && !Array.isArray(result)) {
        console.warn(`国际化警告: 键 "${key}" 的值不是字符串或数组，而是 ${typeof result}`);
      }
      
      return result || '';
    } catch (error) {
      console.error(`国际化错误: 获取键 "${key}" 时出错:`, error);
      return '';
    }
  },

  /**
   * 替换文本中的参数
   * @param {string} text 文本
   * @param {Object} params 参数对象
   */
  _replaceParams(text, params) {
    if (!params || typeof params !== 'object') {
      return text;
    }
    
    // 确保text是字符串类型，如果不是则转换为字符串或返回空字符串
    if (typeof text !== 'string') {
      // 如果是数组，尝试将其连接为字符串
      if (Array.isArray(text)) {
        text = text.join(', ');
      } 
      // 如果是对象或其他类型，尝试转换为字符串
      else if (text !== null && text !== undefined) {
        text = String(text);
      } 
      // 如果是null或undefined，返回空字符串
      else {
        return '';
      }
    }
    
    return text.replace(/\{(\w+)\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match;
    });
  },

  /**
   * 格式化日期
   * @param {Date|string} date 日期对象或日期字符串
   * @param {string} format 日期格式，默认为'YYYY-MM-DD'
   */
  formatDate(date, format = 'YYYY-MM-DD') {
    if (!date) return '';
    
    // 如果是字符串，转换为Date对象
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // 获取当前语言
    const currentLang = this.getCurrentLang();
    
    // 根据语言选择不同的日期格式
    if (currentLang === 'en') {
      // 英文日期格式: MMM DD, YYYY (Jan 01, 2022)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[dateObj.getMonth()]} ${String(dateObj.getDate()).padStart(2, '0')}, ${dateObj.getFullYear()}`;
    } else {
      // 默认日期格式: YYYY-MM-DD
      return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
    }
  },

  /**
   * 获取翻译文本 (WXML可直接调用的版本)
   * 这个函数可以在WXML中直接调用，例如 {{i18n.text('key')}}
   * @param {string} key 文本键值
   * @param {Object} params 替换参数
   */
  text: function(key, params = {}) {
    return this.t(key, params);
  }
};

module.exports = i18n; 
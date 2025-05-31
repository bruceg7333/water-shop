const { api } = require('../../utils/request');
const i18n = require('../../utils/i18n/index');
const { redirectAfterLogin } = require('../../utils/auth');

Page({
  data: {
    username: '',
    password: '',
    isLoading: false,
    isWechatLoading: false,
    errorMsg: '',
    i18n: {
      // 默认文本，确保即使国际化失败也能正常显示
      title: 'SPRINKLE水商城',
      subtitle: '登录账号',
      username: '请输入用户名',
      password: '请输入密码',
      login: '登录',
      wechatLogin: '微信一键登录',
      forgotPassword: '忘记密码',
      register: '注册账号',
      agreement: '登录即表示您同意',
      userAgreement: '《用户协议》',
      privacyPolicy: '《隐私政策》',
      and: '和'
    }
  },

  onLoad(options) {
    // 保存options参数以便后续使用
    this.options = options || {};
    console.log('登录页加载参数:', options);

    // 页面加载时检查是否有登录信息
    const token = wx.getStorageSync('token');
    if (token) {
      // 已登录，跳转到个人中心
      wx.switchTab({
        url: '/pages/profile/index'
      });
    }

    // 初始化国际化文本
    this.updateI18nText();

    // 检查微信小程序环境
    this.checkWechatEnv();
  },

  onShow() {
    // 每次显示页面时更新国际化文本，确保语言切换后文本更新
    this.updateI18nText();
  },

  // 更新国际化文本
  updateI18nText() {
    try {
      // 当前语言
      const currentLang = i18n.getCurrentLang();
      console.log('当前语言:', currentLang);

      // 设置页面标题
      wx.setNavigationBarTitle({
        title: i18n.t('page.login') || '登录'
      });

      // 更新页面文本
      this.setData({
        i18n: {
          title: i18n.t('login.title') || 'SPRINKLE水商城',
          subtitle: i18n.t('login.subtitle') || '登录账号',
          username: i18n.t('login.username') || '请输入用户名',
          password: i18n.t('login.password') || '请输入密码',
          login: i18n.t('login.loginButton') || '登录',
          wechatLogin: i18n.t('login.wechatLogin') || '微信一键登录',
          forgotPassword: i18n.t('login.forgotPassword') || '忘记密码',
          register: i18n.t('login.register') || '注册账号',
          agreement: i18n.t('login.agreement') || '登录即表示您同意',
          userAgreement: i18n.t('login.userAgreement') || '《用户协议》',
          privacyPolicy: i18n.t('login.privacyPolicy') || '《隐私政策》',
          and: i18n.t('login.and') || '和'
        }
      });

      console.log('登录页国际化文本更新完成:', this.data.i18n);
    } catch (error) {
      console.error('初始化国际化文本出错:', error);
      // 出错时保持默认文本
    }
  },

  // 检查微信环境
  checkWechatEnv() {
    wx.getSetting({
      success: (res) => {
        // 查看是否已经授权
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取用户信息
          console.log('用户已授权获取用户信息');
        }
      }
    });
  },

  // 微信一键登录
  handleWechatLogin() {
    console.log('微信一键登录按钮被点击');
    
    // 必须直接由用户点击触发getUserProfile
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (profileRes) => {
        console.log('获取用户信息成功:', profileRes);
        const userInfo = profileRes.userInfo;
        
        // 获取用户信息成功后，显示隐私政策提示
        wx.showModal({
          title: i18n.t('login.authTitle') || '授权提示',
          content: `${i18n.t('login.agreement') || '登录即表示您同意'}${i18n.t('login.userAgreement') || '《用户协议》'}${i18n.t('login.and') || '和'}${i18n.t('login.privacyPolicy') || '《隐私政策》'}`,
          confirmText: i18n.t('login.authConfirm') || '同意',
          cancelText: i18n.t('login.authCancel') || '取消',
          success: (res) => {
            if (res.confirm) {
              // 用户同意隐私政策，继续登录流程
              this.setData({ 
                isWechatLoading: true,
                errorMsg: ''
              });
              
              // 获取微信code并完成登录
              wx.login({
                success: (loginRes) => {
                  if (loginRes.code) {
                    // 调用后端API，使用code登录
                    this.wechatLoginWithCode(loginRes.code, userInfo);
                  } else {
                    this.setData({
                      errorMsg: i18n.t('login.errorMessages.loginFailed') || '获取微信登录凭证失败',
                      isWechatLoading: false
                    });
                  }
                },
                fail: (error) => {
                  console.error('微信登录失败:', error);
                  this.setData({
                    errorMsg: i18n.t('login.errorMessages.networkError') || '微信登录失败，请重试',
                    isWechatLoading: false
                  });
                }
              });
            } else {
              // 用户拒绝隐私政策
              this.setData({
                errorMsg: i18n.t('login.errorMessages.privacyPolicyRequired') || '您需要同意隐私政策才能完成登录'
              });
            }
          }
        });
      },
      fail: (err) => {
        console.error('获取用户信息失败:', err);
        this.setData({
          errorMsg: i18n.t('login.errorMessages.networkError') || '获取用户信息失败，请重试',
          isWechatLoading: false
        });
      }
    });
  },

  // 输入用户名
  onUsernameInput(e) {
    this.setData({
      username: e.detail.value,
      errorMsg: ''
    });
  },

  // 输入密码
  onPasswordInput(e) {
    this.setData({
      password: e.detail.value,
      errorMsg: ''
    });
  },

  // 提交登录
  async handleLogin() {
    const { username, password } = this.data;
    
    // 验证输入
    if (!username || !password) {
      this.setData({
        errorMsg: i18n.t('login.errorMessages.inputRequired') || '请输入用户名和密码'
      });
      return;
    }
    
    // 设置加载状态
    this.setData({ 
      isLoading: true,
      errorMsg: ''
    });
    
    try {
      // 调用登录API
      const response = await api.user.login({
        username,
        password
      });
      
      if (response.success) {
        // 保存用户信息
        wx.setStorageSync('token', response.data.token);
        wx.setStorageSync('userInfo', response.data.user);
        wx.setStorageSync('isLoggedIn', true);
        
        wx.showToast({
          title: i18n.t('login.successMessage') || '登录成功',
          icon: 'success',
          duration: 1500
        });
        
        // 从URL参数中获取redirect参数（优先使用URL参数）
        const pageQuery = this.getRedirectFromQuery();
        if (pageQuery) {
          console.log('使用URL参数中的redirect路径:', pageQuery);
          // 如果有参数中的redirect，将其存入storage（覆盖可能存在的其他redirectUrl）
          wx.setStorageSync('redirectUrl', decodeURIComponent(pageQuery));
        }
        
        // 延迟跳转，让用户看到登录成功提示
        setTimeout(() => {
          console.log('登录成功，准备跳转...');
          // 使用统一的重定向方法，简化逻辑
          redirectAfterLogin();
        }, 500);
      } else {
        this.setData({
          errorMsg: response.message || i18n.t('login.errorMessages.loginFailed') || '登录失败，请重试',
          isLoading: false
        });
      }
    } catch (error) {
      console.error('登录失败:', error);
      this.setData({
        errorMsg: i18n.t('login.errorMessages.networkError') || '网络异常，请稍后重试',
        isLoading: false
      });
    }
  },

  // 使用微信code登录
  async wechatLoginWithCode(code, userInfo) {
    try {
      // 将微信性别数值转换为后端需要的字符串枚举值
      let genderValue = '未知';
      if (userInfo.gender === 1) {
        genderValue = '男';
      } else if (userInfo.gender === 2) {
        genderValue = '女';
      }

      // 调用后端API进行微信登录
      const response = await api.user.wechatLogin({
        code: code,
        userInfo: {
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl,
          gender: genderValue
        },
        // 添加默认密码
        password: 'wx' + new Date().getTime() // 使用微信前缀加时间戳作为随机密码
      });

      if (response.success) {
        // 登录成功，保存用户信息
        wx.setStorageSync('token', response.data.token);
        wx.setStorageSync('userInfo', response.data.user);
        wx.setStorageSync('isLoggedIn', true);

        wx.showToast({
          title: i18n.t('login.successMessage') || '登录成功',
          icon: 'success',
          duration: 1500
        });

        // 从URL参数中获取redirect参数（优先使用URL参数）
        const pageQuery = this.getRedirectFromQuery();
        if (pageQuery) {
          console.log('使用URL参数中的redirect路径:', pageQuery);
          // 如果有参数中的redirect，将其存入storage（覆盖可能存在的其他redirectUrl）
          wx.setStorageSync('redirectUrl', decodeURIComponent(pageQuery));
        }

        // 延迟跳转，让用户看到登录成功提示
        setTimeout(() => {
          console.log('登录成功，准备跳转...');
          // 使用统一的重定向方法，简化逻辑
          redirectAfterLogin();
        }, 500);
      } else {
        this.setData({
          errorMsg: response.message || i18n.t('login.errorMessages.loginFailed') || '微信登录失败，请重试',
          isWechatLoading: false
        });
      }
    } catch (error) {
      console.error('微信登录请求失败:', error);
      this.setData({
        errorMsg: i18n.t('login.errorMessages.networkError') || '网络异常，请稍后重试',
        isWechatLoading: false
      });
    }
  },

  // 获取URL中的redirect参数
  getRedirectFromQuery() {
    const query = this.options || {};
    return query.redirect || '';
  },

  // 确定重定向类型
  getRedirectType() {
    // 获取当前页面栈
    const pages = getCurrentPages();
    if (pages.length <= 1) {
      return 'profile'; // 默认返回个人中心
    }
    
    // 查找前一个页面是否为个人中心
    const prevPage = pages[pages.length - 2];
    if (prevPage && prevPage.route === 'pages/profile/index') {
      return 'profile';
    }
    
    return 'back'; // 返回上一页
  },

  // 前往注册页面
  navigateToRegister() {
    wx.navigateTo({
      url: '/pages/member/register'
    });
  },

  // 忘记密码
  handleForgotPassword() {
    wx.showToast({
      title: i18n.t('login.forgotPasswordTip') || '请联系客服重置密码',
      icon: 'none',
      duration: 2000
    });
  },

  // 显示用户协议
  showUserAgreement() {
    wx.showModal({
      title: i18n.t('login.userAgreement') || '用户协议',
      content: i18n.t('login.userAgreementContent') || '欢迎使用SPRINKLE水商城！本协议是您与SPRINKLE水商城之间关于用户使用服务所订立的协议。使用我们的服务即表示您已阅读并同意本协议的所有条款。',
      showCancel: false,
      confirmText: i18n.t('login.iHaveRead') || '我已阅读'
    });
  },

  // 显示隐私政策
  showPrivacyPolicy() {
    wx.showModal({
      title: i18n.t('login.privacyPolicy') || '隐私政策',
      content: i18n.t('login.privacyPolicyContent') || '我们非常重视您的个人信息和隐私保护。我们会收集您的登录信息、购物信息等用于提供更好的服务。我们承诺对您的个人信息进行严格保密，不会向第三方泄露。',
      showCancel: false,
      confirmText: i18n.t('login.iHaveRead') || '我已阅读'
    });
  }
}); 
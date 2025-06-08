const { api } = require('../../utils/request');
const i18n = require('../../utils/i18n/index');

Page({
  data: {
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
    isLoading: false,
    isWechatLoading: false,
    errorMsg: '',
    agreePolicy: false,
    i18n: {
      // 默认文本，确保即使国际化失败也能正常显示
      title: '创建账号',
      subtitle: '加入SPRINKLE水商城',
      username: '请设置用户名 (至少4个字符)',
      password: '请设置密码 (至少6位)',
      confirmPassword: '请确认密码',
      phone: '请输入手机号 (选填)',
      wechatRegister: '微信一键注册',
      registerButton: '注册',
      agreePolicy: '我已阅读并同意',
      userAgreement: '《用户协议》',
      privacyPolicy: '《隐私政策》',
      and: '和',
      or: '或',
      hasAccount: '已有账号？',
      toLogin: '点击登录'
    }
  },

  onLoad() {
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
        title: i18n.t('page.memberRegister') || '会员注册'
      });

      // 更新页面文本
      this.setData({
        i18n: {
          title: i18n.t('register.title') || '创建账号',
          subtitle: i18n.t('register.subtitle') || '加入SPRINKLE水商城',
          username: i18n.t('register.username') || '请设置用户名 (至少4个字符)',
          password: i18n.t('register.password') || '请设置密码 (至少6位)',
          confirmPassword: i18n.t('register.confirmPassword') || '请确认密码',
          phone: i18n.t('register.phone') || '请输入手机号 (选填)',
          wechatRegister: i18n.t('register.wechatRegister') || '微信一键注册',
          registerButton: i18n.t('register.registerButton') || '注册',
          agreePolicy: i18n.t('register.agreePolicy') || '我已阅读并同意',
          userAgreement: i18n.t('register.userAgreement') || '《用户协议》',
          privacyPolicy: i18n.t('register.privacyPolicy') || '《隐私政策》',
          and: i18n.t('register.and') || '和',
          or: i18n.t('register.or') || '或',
          hasAccount: i18n.t('register.hasAccount') || '已有账号？',
          toLogin: i18n.t('register.toLogin') || '点击登录'
        }
      });

      console.log('注册页国际化文本更新完成:', this.data.i18n);
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

  // 微信一键注册/登录
  handleWechatRegister() {
    console.log('微信一键注册按钮被点击');
    
    // 必须直接由用户点击触发getUserProfile
    wx.getUserProfile({
      desc: i18n.t('register.wechatDesc') || '用于创建您的水商城账号',
      success: (profileRes) => {
        console.log('获取用户信息成功:', profileRes);
        const userInfo = profileRes.userInfo;
        
        // 获取用户信息成功后，显示隐私政策提示
        wx.showModal({
          title: i18n.t('register.authTitle') || '授权提示',
          content: i18n.t('register.authContent') || '注册即表示您同意《用户协议》和《隐私政策》。',
          confirmText: i18n.t('register.authConfirm') || '同意',
          cancelText: i18n.t('register.authCancel') || '取消',
          success: (res) => {
            if (res.confirm) {
              // 用户同意隐私政策，继续登录/注册流程
              this.setData({ 
                isWechatLoading: true,
                errorMsg: ''
              });
              
              // 获取微信code并完成登录/注册
              wx.login({
                success: (loginRes) => {
                  if (loginRes.code) {
                    // 调用后端API，使用code登录（如果用户不存在会自动注册）
                    this.wechatLoginWithCode(loginRes.code, userInfo);
                  } else {
                    this.setData({
                      errorMsg: i18n.t('register.errorMessages.wechatLoginFailed') || '获取微信登录凭证失败',
                      isWechatLoading: false
                    });
                  }
                },
                fail: (error) => {
                  console.error('微信登录失败:', error);
                  this.setData({
                    errorMsg: i18n.t('register.errorMessages.networkError') || '微信登录失败，请重试',
                    isWechatLoading: false
                  });
                }
              });
            } else {
              // 用户拒绝隐私政策
              this.setData({
                errorMsg: i18n.t('register.errorMessages.privacyPolicyRequired') || '您需要同意隐私政策才能完成注册'
              });
            }
          }
        });
      },
      fail: (err) => {
        console.error('获取用户信息失败:', err);
        this.setData({
          errorMsg: i18n.t('register.errorMessages.getUserInfoFailed') || '获取用户信息失败，请重试',
          isWechatLoading: false
        });
      }
    });
  },

  // 使用微信code登录/注册
  async wechatLoginWithCode(code, userInfo) {
    try {
      // 将微信性别数值转换为后端需要的字符串枚举值
      let genderValue = '未知';
      if (userInfo.gender === 1) {
        genderValue = '男';
      } else if (userInfo.gender === 2) {
        genderValue = '女';
      }

      // 调用后端API进行微信登录（如果用户不存在会自动注册）
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
        // 登录/注册成功，保存用户信息
        wx.setStorageSync('token', response.data.token);
        wx.setStorageSync('userInfo', response.data.user);
        wx.setStorageSync('isLoggedIn', true);

        // 根据响应判断是登录还是注册
        const isNewUser = response.data.isNewUser || false;
        const successMessage = isNewUser ? 
          (i18n.t('register.successMessage') || '注册成功') : 
          (i18n.t('register.loginSuccessMessage') || '登录成功');

        wx.showToast({
          title: successMessage,
          icon: 'success',
          duration: 1500
        });

        // 延迟跳转到首页
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index'
          });
        }, 1500);
      } else {
        this.setData({
          errorMsg: response.message || i18n.t('register.errorMessages.registrationFailed') || '操作失败，请重试',
          isWechatLoading: false
        });
      }
    } catch (error) {
      console.error('微信登录/注册请求失败:', error);
      this.setData({
        errorMsg: i18n.t('register.errorMessages.networkError') || '网络异常，请稍后重试',
        isWechatLoading: false
      });
    }
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

  // 确认密码
  onConfirmPasswordInput(e) {
    this.setData({
      confirmPassword: e.detail.value,
      errorMsg: ''
    });
  },

  // 输入手机号
  onPhoneInput(e) {
    this.setData({
      phone: e.detail.value,
      errorMsg: ''
    });
  },

  // 同意用户协议
  toggleAgreePolicy() {
    this.setData({
      agreePolicy: !this.data.agreePolicy,
      errorMsg: ''
    });
  },

  // 验证表单
  validateForm() {
    const { username, password, confirmPassword, phone, agreePolicy } = this.data;
    
    if (!username.trim()) {
      this.setData({ errorMsg: i18n.t('register.errorMessages.usernameRequired') || '请输入用户名' });
      return false;
    }
    
    if (username.length < 4) {
      this.setData({ errorMsg: i18n.t('register.errorMessages.usernameTooShort') || '用户名至少需要4个字符' });
      return false;
    }
    
    if (!password.trim()) {
      this.setData({ errorMsg: i18n.t('register.errorMessages.passwordRequired') || '请输入密码' });
      return false;
    }
    
    if (password.length < 6) {
      this.setData({ errorMsg: i18n.t('register.errorMessages.passwordTooShort') || '密码长度不能少于6位' });
      return false;
    }
    
    if (password !== confirmPassword) {
      this.setData({ errorMsg: i18n.t('register.errorMessages.passwordMismatch') || '两次输入的密码不一致' });
      return false;
    }
    
    if (phone && !/^1[3-9]\d{9}$/.test(phone)) {
      this.setData({ errorMsg: i18n.t('register.errorMessages.phoneInvalid') || '请输入有效的手机号码' });
      return false;
    }
    
    if (!agreePolicy) {
      this.setData({ errorMsg: i18n.t('register.errorMessages.policyRequired') || '请阅读并同意用户协议和隐私政策' });
      return false;
    }
    
    return true;
  },

  // 提交注册
  async handleRegister() {
    // 验证表单
    if (!this.validateForm()) {
      return;
    }
    
    const { username, password, phone } = this.data;
    this.setData({ isLoading: true });
    
    try {
      // 调用注册API
      const response = await api.user.register({
        username,
        password,
        phone
      });
      
      if (response.success) {
        // 注册成功，保存登录状态和用户信息
        wx.setStorageSync('token', response.data.token);
        wx.setStorageSync('userInfo', response.data.user);
        wx.setStorageSync('isLoggedIn', true);
        
        wx.showToast({
          title: i18n.t('register.successMessage') || '注册成功',
          icon: 'success',
          duration: 1500
        });
        
        // 延迟跳转回个人中心
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/profile/index'
          });
        }, 1500);
      } else {
        this.setData({
          errorMsg: response.message || i18n.t('register.errorMessages.registrationFailed') || '注册失败，请重试',
          isLoading: false
        });
      }
    } catch (error) {
      console.error('注册失败:', error);
      this.setData({
        errorMsg: i18n.t('register.errorMessages.networkError') || '网络异常，请稍后重试',
        isLoading: false
      });
    }
  },

  // 查看用户协议
  showUserAgreement() {
    wx.navigateTo({
      url: '/pages/agreement/index?type=user'
    });
  },

  // 查看隐私政策
  showPrivacyPolicy() {
    wx.navigateTo({
      url: '/pages/agreement/index?type=privacy'
    });
  },

  // 返回登录页面
  navigateToLogin() {
    wx.navigateBack();
  }
}); 
const { api } = require('../../utils/request');

Page({
  data: {
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
    isLoading: false,
    isWechatLoading: false,
    errorMsg: '',
    agreePolicy: false
  },

  onLoad() {
    // 检查微信小程序环境
    this.checkWechatEnv();
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

  // 微信一键注册
  handleWechatRegister() {
    console.log('微信一键注册按钮被点击');
    
    if (!this.data.agreePolicy) {
      this.setData({ errorMsg: '请阅读并同意用户协议和隐私政策' });
      return;
    }

    // 必须直接由用户点击触发getUserProfile
    wx.getUserProfile({
      desc: '用于创建您的水商城账号',
      success: (profileRes) => {
        console.log('获取用户信息成功:', profileRes);
        const userInfo = profileRes.userInfo;
        
        // 获取用户信息成功后，显示隐私政策提示
        wx.showModal({
          title: '授权提示',
          content: '注册即表示您同意《用户协议》和《隐私政策》。',
          confirmText: '同意',
          cancelText: '取消',
          success: (res) => {
            if (res.confirm) {
              // 用户同意隐私政策，继续注册流程
              this.setData({ 
                isWechatLoading: true,
                errorMsg: ''
              });
              
              // 获取微信code并完成注册
              wx.login({
                success: (loginRes) => {
                  if (loginRes.code) {
                    // 调用后端API，使用code注册
                    this.wechatRegisterWithCode(loginRes.code, userInfo);
                  } else {
                    this.setData({
                      errorMsg: '获取微信登录凭证失败',
                      isWechatLoading: false
                    });
                  }
                },
                fail: (error) => {
                  console.error('微信登录失败:', error);
                  this.setData({
                    errorMsg: '微信登录失败，请重试',
                    isWechatLoading: false
                  });
                }
              });
            } else {
              // 用户拒绝隐私政策
              this.setData({
                errorMsg: '您需要同意隐私政策才能完成注册'
              });
            }
          }
        });
      },
      fail: (err) => {
        console.error('获取用户信息失败:', err);
        this.setData({
          errorMsg: '获取用户信息失败，请重试',
          isWechatLoading: false
        });
      }
    });
  },

  // 使用微信code注册
  async wechatRegisterWithCode(code, userInfo) {
    try {
      // 将微信性别数值转换为后端需要的字符串枚举值
      let genderValue = '未知';
      if (userInfo.gender === 1) {
        genderValue = '男';
      } else if (userInfo.gender === 2) {
        genderValue = '女';
      }

      // 调用后端API进行微信注册
      const response = await api.user.wechatRegister({
        code: code,
        userInfo: {
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl,
          gender: genderValue
        },
        phone: this.data.phone, // 如果用户输入了手机号，一并提交
        // 添加默认密码
        password: 'wx' + new Date().getTime() // 使用微信前缀加时间戳作为随机密码
      });

      if (response.success) {
        // 注册成功，保存用户信息
        wx.setStorageSync('token', response.data.token);
        wx.setStorageSync('userInfo', response.data.user);
        wx.setStorageSync('isLoggedIn', true);

        wx.showToast({
          title: '注册成功',
          icon: 'success',
          duration: 1500
        });

        // 延迟跳转
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/profile/index'
          });
        }, 1500);
      } else {
        this.setData({
          errorMsg: response.message || '微信注册失败，请重试',
          isWechatLoading: false
        });
      }
    } catch (error) {
      console.error('微信注册请求失败:', error);
      this.setData({
        errorMsg: '网络异常，请稍后重试',
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
      this.setData({ errorMsg: '请输入用户名' });
      return false;
    }
    
    if (username.length < 4) {
      this.setData({ errorMsg: '用户名至少需要4个字符' });
      return false;
    }
    
    if (!password.trim()) {
      this.setData({ errorMsg: '请输入密码' });
      return false;
    }
    
    if (password.length < 6) {
      this.setData({ errorMsg: '密码长度不能少于6位' });
      return false;
    }
    
    if (password !== confirmPassword) {
      this.setData({ errorMsg: '两次输入的密码不一致' });
      return false;
    }
    
    if (phone && !/^1[3-9]\d{9}$/.test(phone)) {
      this.setData({ errorMsg: '请输入有效的手机号码' });
      return false;
    }
    
    if (!agreePolicy) {
      this.setData({ errorMsg: '请阅读并同意用户协议和隐私政策' });
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
          title: '注册成功',
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
          errorMsg: response.message || '注册失败，请重试',
          isLoading: false
        });
      }
    } catch (error) {
      console.error('注册失败:', error);
      this.setData({
        errorMsg: '网络异常，请稍后重试',
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
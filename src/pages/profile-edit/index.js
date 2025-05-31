const { api } = require('../../utils/request');
const i18n = require('../../utils/i18n/index');
const { createPage } = require('../../utils/page-base');
const { checkLogin } = require('../../utils/auth');

const pageConfig = {
  data: {
    // 用户信息
    avatarUrl: '',
    nickName: '',
    phone: '',
    gender: '',
    genderText: '',
    birthday: '',
    email: '',
    
    // UI状态
    isLoading: false,
    i18n: {},
    currentDate: new Date().toISOString().split('T')[0] // 当前日期，格式为YYYY-MM-DD
  },

  onLoad() {
    // 检查登录状态
    if (!checkLogin()) {
      return;
    }

    // 更新国际化文本
    this.updateI18nText();
    
    // 加载用户信息
    this.loadUserInfo();
  },

  // 更新国际化文本
  updateI18nText() {
    this.setData({
      i18n: {
        avatar: this.t('profile.edit.avatar'),
        nickname: this.t('profile.edit.nickname'),
        nicknamePlaceholder: this.t('profile.edit.nicknamePlaceholder'),
        phone: this.t('profile.edit.phone'),
        notBound: this.t('profile.edit.notBound'),
        bindPhone: this.t('profile.edit.bindPhone'),
        changePhone: this.t('profile.edit.changePhone'),
        gender: this.t('profile.edit.gender'),
        selectGender: this.t('profile.edit.selectGender'),
        birthday: this.t('profile.edit.birthday'),
        selectBirthday: this.t('profile.edit.selectBirthday'),
        email: this.t('profile.edit.email'),
        emailPlaceholder: this.t('profile.edit.emailPlaceholder'),
        save: this.t('common.save'),
        male: this.t('profile.edit.male'),
        female: this.t('profile.edit.female'),
        unknown: this.t('profile.edit.unknown')
      }
    });

    // 设置页面标题
    wx.setNavigationBarTitle({
      title: this.t('page.profileEdit')
    });
  },

  // 加载用户信息
  async loadUserInfo() {
    try {
      const res = await api.user.getCurrentUser();
      if (res.success && res.data) {
        const user = res.data.user || res.data;
        
        // 设置性别文本
        let genderText = '';
        if (user.gender === '男') {
          genderText = this.t('profile.edit.male');
        } else if (user.gender === '女') {
          genderText = this.t('profile.edit.female');
        } else if (user.gender) {
          genderText = this.t('profile.edit.unknown');
        }

        // 格式化生日日期
        let formattedBirthday = '';
        if (user.birthday) {
          const birthdayDate = new Date(user.birthday);
          if (!isNaN(birthdayDate.getTime())) {
            formattedBirthday = birthdayDate.getFullYear() + '-' + 
                               String(birthdayDate.getMonth() + 1).padStart(2, '0') + '-' + 
                               String(birthdayDate.getDate()).padStart(2, '0');
          }
        }

        this.setData({
          avatarUrl: user.avatar || '',
          nickName: user.nickName || '',
          phone: user.phone || '',
          gender: user.gender || '',
          genderText: genderText,
          birthday: formattedBirthday,
          email: user.email || '',
        });
      }
    } catch (error) {
      console.error('加载用户信息失败:', error);
      wx.showToast({
        title: this.t('common.loadFailed'),
        icon: 'none'
      });
    }
  },

  // 选择头像
  chooseAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        
        // 这里应该上传到服务器，暂时先本地预览
        this.setData({
          avatarUrl: tempFilePath
        });

        // TODO: 上传头像到服务器
        this.uploadAvatar(tempFilePath);
      }
    });
  },

  // 上传头像
  async uploadAvatar(filePath) {
    wx.showLoading({
      title: this.t('common.uploading')
    });

    try {
      // TODO: 实现头像上传API
      // const uploadRes = await api.uploadFile(filePath);
      // if (uploadRes.success) {
      //   this.setData({
      //     avatarUrl: uploadRes.data.url
      //   });
      //   wx.hideLoading();
      //   wx.showToast({
      //     title: this.t('common.uploadSuccess'),
      //     icon: 'success'
      //   });
      // } else {
      //   throw new Error(uploadRes.message || '上传失败');
      // }
      
      // 暂时模拟成功上传（使用本地临时路径）
      wx.hideLoading();
      wx.showToast({
        title: '头像已更新',
        icon: 'success'
      });
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: this.t('common.uploadFailed'),
        icon: 'none'
      });
    }
  },

  // 输入昵称
  onNickNameInput(e) {
    this.setData({
      nickName: e.detail.value
    });
  },

  // 输入邮箱
  onEmailInput(e) {
    this.setData({
      email: e.detail.value
    });
  },

  // 选择性别
  selectGender() {
    const genderOptions = [
      this.t('profile.edit.male'),
      this.t('profile.edit.female'),
      this.t('profile.edit.unknown')
    ];

    wx.showActionSheet({
      itemList: genderOptions,
      success: (res) => {
        const genderValues = ['男', '女', '未知'];
        this.setData({
          gender: genderValues[res.tapIndex],
          genderText: genderOptions[res.tapIndex]
        });
      }
    });
  },

  // 日期选择器变化事件
  onBirthdayChange(e) {
    const selectedDate = e.detail.value;
    this.setData({
      birthday: selectedDate
    });
    
    wx.showToast({
      title: '生日已选择',
      icon: 'success'
    });
  },

  // 获取手机号
  getPhoneNumber(e) {
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      const { code } = e.detail;
      
      // TODO: 调用后端API解密手机号
      wx.showToast({
        title: '手机号绑定功能开发中',
        icon: 'none'
      });
    }
  },

  // 保存资料
  async saveProfile() {
    const { nickName, gender, birthday, email } = this.data;

    // 验证必填项
    if (!nickName) {
      wx.showToast({
        title: this.t('profile.edit.nicknameRequired'),
        icon: 'none'
      });
      return;
    }

    // 验证邮箱格式
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      wx.showToast({
        title: this.t('profile.edit.invalidEmail'),
        icon: 'none'
      });
      return;
    }

    this.setData({ isLoading: true });

    try {
      const res = await api.user.updateProfile({
        nickName,
        gender,
        birthday,
        email,
        avatar: this.data.avatarUrl
      });

      if (res.success) {
        // 更新本地存储的用户信息
        const userInfo = wx.getStorageSync('userInfo') || {};
        Object.assign(userInfo, {
          nickName,
          gender,
          birthday,
          email,
          avatar: this.data.avatarUrl
        });
        wx.setStorageSync('userInfo', userInfo);

        wx.showToast({
          title: this.t('common.saveSuccess'),
          icon: 'success'
        });

        // 延迟返回
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      } else {
        wx.showToast({
          title: res.message || this.t('common.saveFailed'),
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('保存资料失败:', error);
      wx.showToast({
        title: this.t('common.networkError'),
        icon: 'none'
      });
    } finally {
      this.setData({ isLoading: false });
    }
  }
};

// 使用createPage包装页面配置
Page(createPage(pageConfig)); 
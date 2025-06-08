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
    currentDate: new Date().toISOString().split('T')[0], // 当前日期，格式为YYYY-MM-DD
    
    // 自定义日期选择器相关
    showBirthdayPicker: false,
    years: [],
    months: [],
    days: [],
    pickerValue: [0, 0, 0], // 当前选择的索引
    selectedYear: new Date().getFullYear(),
    selectedMonth: 1,
    selectedDay: 1,
    
    // 自定义性别选择器相关
    showGenderPicker: false,
    genderOptions: [],
    selectedGenderIndex: -1
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

  onShow() {
    // 页面显示时重新更新国际化文本，确保语言切换后文本正确
    this.updateI18nText();
  },

  // 更新国际化文本
  updateI18nText() {
    // 如果已有生日数据，更新显示格式
    if (this.data.birthday) {
      const parts = this.data.birthday.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        const day = parseInt(parts[2]);
        const birthdayDisplay = this.formatBirthdayDisplay(year, month, day);
        this.setData({
          birthdayDisplay: birthdayDisplay
        });
      }
    }

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
        unknown: this.t('profile.edit.unknown'),
        cancel: this.t('common.cancel'),
        confirm: this.t('common.confirm')
      },
      genderOptions: [
        { value: '男', text: this.t('profile.edit.male') },
        { value: '女', text: this.t('profile.edit.female') },
        { value: '未知', text: this.t('profile.edit.unknown') }
      ]
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
        let formattedBirthdayDisplay = '';
        if (user.birthday) {
          const birthdayDate = new Date(user.birthday);
          if (!isNaN(birthdayDate.getTime())) {
            const year = birthdayDate.getFullYear();
            const month = birthdayDate.getMonth() + 1;
            const day = birthdayDate.getDate();
            
            // 标准格式供提交使用
            formattedBirthday = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            // 显示格式
            formattedBirthdayDisplay = this.formatBirthdayDisplay(year, month, day);
          }
        }

        // 处理头像URL - 如果是本地路径，转换为完整URL
        let avatarUrl = '';
        if (user.avatar) {
          if (user.avatar.startsWith('/uploads/')) {
            // 本地路径，拼接服务器地址
            avatarUrl = `http://localhost:5001${user.avatar}`;
          } else if (user.avatar.startsWith('http')) {
            // 已经是完整URL
            avatarUrl = user.avatar;
          } else {
            // 其他情况，当作相对路径处理
            avatarUrl = user.avatar;
          }
        }

        this.setData({
          avatarUrl: avatarUrl,
          nickName: user.nickName || '',
          phone: user.phone || '',
          gender: user.gender || '',
          genderText: genderText,
          birthday: formattedBirthday, // 标准格式供提交
          birthdayDisplay: formattedBirthdayDisplay, // 显示格式
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
      // 实现头像上传API
      const token = wx.getStorageSync('token');
      
      const uploadRes = await new Promise((resolve, reject) => {
        wx.uploadFile({
          url: 'http://localhost:5001/api/upload/avatar', // 需要新建一个头像上传接口
          filePath: filePath,
          name: 'image',
          header: {
            'Authorization': `Bearer ${token}`
          },
          success: (res) => {
            try {
              const data = JSON.parse(res.data);
              if (data.success) {
                resolve(data);
              } else {
                reject(new Error(data.message || '上传失败'));
              }
            } catch (error) {
              reject(new Error('响应解析失败'));
            }
          },
          fail: reject
        });
      });

      // 上传成功，更新头像URL
      this.setData({
        avatarUrl: uploadRes.data.url
      });
      
      wx.hideLoading();
      wx.showToast({
        title: this.t('common.uploadSuccess'),
        icon: 'success'
      });
    } catch (error) {
      console.error('头像上传失败:', error);
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

  // 显示性别选择器
  showGenderPicker() {
    // 找到当前选中的性别索引
    const currentGender = this.data.gender;
    let selectedIndex = -1;
    if (currentGender) {
      selectedIndex = this.data.genderOptions.findIndex(option => option.value === currentGender);
    }
    
    this.setData({
      showGenderPicker: true,
      selectedGenderIndex: selectedIndex
    });
  },

  // 隐藏性别选择器
  hideGenderPicker() {
    this.setData({
      showGenderPicker: false
    });
  },

  // 选择性别选项
  selectGenderOption(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      selectedGenderIndex: index
    });
  },

  // 确认选择性别
  confirmGender() {
    const { selectedGenderIndex, genderOptions } = this.data;
    if (selectedGenderIndex >= 0) {
      const selectedOption = genderOptions[selectedGenderIndex];
      this.setData({
        gender: selectedOption.value,
        genderText: selectedOption.text,
        showGenderPicker: false
      });
    } else {
      this.setData({
        showGenderPicker: false
      });
    }
  },

  // 显示生日选择器
  showBirthdayPicker() {
    this.initPickerData();
    this.setData({
      showBirthdayPicker: true
    });
  },

  // 隐藏生日选择器
  hideBirthdayPicker() {
    this.setData({
      showBirthdayPicker: false
    });
  },

  // 初始化选择器数据
  initPickerData() {
    const currentYear = new Date().getFullYear();
    const currentLang = wx.getStorageSync('language') || 'zh_CN';
    const years = [];
    const months = [];
    const days = [];

    // 英文月份简写
    const englishMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // 获取英文序数词后缀
    const getOrdinalSuffix = (num) => {
      if (num >= 11 && num <= 13) return 'th';
      switch (num % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    // 生成年份列表（1924-当前年份）
    for (let i = 1924; i <= currentYear; i++) {
      if (currentLang === 'en') {
        years.push(i); // 英文：纯数字
      } else if (currentLang === 'th') {
        years.push(`${i}ปี`); // 泰文：数字+ปี
      } else {
        years.push(`${i}年`); // 中文/繁体：数字+年
      }
    }

    // 生成月份列表（1-12）
    for (let i = 1; i <= 12; i++) {
      if (currentLang === 'en') {
        months.push(englishMonths[i - 1]); // 英文：Jan, Feb...
      } else if (currentLang === 'th') {
        const monthStr = i < 10 ? `0${i}` : `${i}`;
        months.push(`${monthStr}เดือน`); // 泰文：01เดือน, 02เดือน...
      } else {
        const monthStr = i < 10 ? `0${i}` : `${i}`;
        months.push(`${monthStr}月`); // 中文/繁体：01月, 02月...
      }
    }

    // 生成日期列表（1-31）
    for (let i = 1; i <= 31; i++) {
      if (currentLang === 'en') {
        days.push(`${i}${getOrdinalSuffix(i)}`); // 英文：1st, 2nd, 3rd...
      } else if (currentLang === 'th') {
        const dayStr = i < 10 ? `0${i}` : `${i}`;
        days.push(`${dayStr}วัน`); // 泰文：01วัน, 02วัน...
      } else {
        const dayStr = i < 10 ? `0${i}` : `${i}`;
        days.push(`${dayStr}日`); // 中文/繁体：01日, 02日...
      }
    }

    // 设置默认选中值
    let selectedYear = currentYear;
    let selectedMonth = 1;
    let selectedDay = 1;
    let yearIndex = years.length - 1; // 默认选中当前年份
    let monthIndex = 0;
    let dayIndex = 0;

    // 如果已经有生日数据，则设置为对应的值
    if (this.data.birthday) {
      const parts = this.data.birthday.split('-');
      if (parts.length === 3) {
        selectedYear = parseInt(parts[0]);
        selectedMonth = parseInt(parts[1]);
        selectedDay = parseInt(parts[2]);
        
        // 根据语言环境查找对应的索引
        if (currentLang === 'en') {
          yearIndex = years.indexOf(selectedYear);
          const englishMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          monthIndex = selectedMonth - 1;
          dayIndex = days.findIndex(day => parseInt(day.replace(/\D/g, '')) === selectedDay);
        } else {
          // 中文/泰文：在格式化的字符串中查找
          yearIndex = years.findIndex(year => parseInt(year.replace(/\D/g, '')) === selectedYear);
          monthIndex = months.findIndex(month => parseInt(month.replace(/\D/g, '')) === selectedMonth);
          dayIndex = days.findIndex(day => parseInt(day.replace(/\D/g, '')) === selectedDay);
        }
        
        // 确保索引有效
        if (yearIndex === -1) yearIndex = years.length - 1;
        if (monthIndex === -1) monthIndex = 0;
        if (dayIndex === -1) dayIndex = 0;
      }
    }

    this.setData({
      years,
      months,
      days,
      selectedYear,
      selectedMonth,
      selectedDay,
      pickerValue: [yearIndex, monthIndex, dayIndex]
    });
  },

  // 选择器值变化
  onPickerChange(e) {
    const value = e.detail.value;
    const { years, months, days } = this.data;
    const currentLang = wx.getStorageSync('language') || 'zh_CN';
    
    // 从格式化的字符串中提取实际数值
    let selectedYear, selectedMonth, selectedDay;
    
    if (currentLang === 'en') {
      selectedYear = years[value[0]]; // 英文年份是纯数字
      // 英文月份转换为数字 (Jan=1, Feb=2...)
      const englishMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      selectedMonth = englishMonths.indexOf(months[value[1]]) + 1;
      // 英文日期提取数字部分 (1st -> 1, 2nd -> 2...)
      selectedDay = parseInt(days[value[2]].replace(/\D/g, ''));
    } else {
      // 中文/泰文：提取数字部分
      selectedYear = parseInt(years[value[0]].replace(/\D/g, ''));
      selectedMonth = parseInt(months[value[1]].replace(/\D/g, ''));
      selectedDay = parseInt(days[value[2]].replace(/\D/g, ''));
    }

    // 检查选择的日期是否有效（处理月份天数不同的情况）
    const maxDay = new Date(selectedYear, selectedMonth, 0).getDate();
    let validDay = selectedDay;
    let validDayIndex = value[2];
    
    if (selectedDay > maxDay) {
      validDay = maxDay;
      validDayIndex = maxDay - 1;
    }

    this.setData({
      selectedYear,
      selectedMonth,
      selectedDay: validDay,
      pickerValue: [value[0], value[1], validDayIndex]
    });
  },

  // 格式化日期显示
  formatBirthdayDisplay(year, month, day) {
    const currentLang = wx.getStorageSync('language') || 'zh_CN';
    
    if (currentLang === 'en') {
      // 英文格式：January 1st, 1984
      const englishMonthsFull = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      
      const getOrdinalSuffix = (num) => {
        if (num >= 11 && num <= 13) return 'th';
        switch (num % 10) {
          case 1: return 'st';
          case 2: return 'nd';
          case 3: return 'rd';
          default: return 'th';
        }
      };
      
      const monthName = englishMonthsFull[month - 1];
      const dayWithSuffix = `${day}${getOrdinalSuffix(day)}`;
      return `${monthName} ${dayWithSuffix}, ${year}`;
    } else {
      // 中文/繁体/泰文：标准格式 yyyy-MM-dd
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
  },

  // 确认选择生日
  confirmBirthday() {
    const { selectedYear, selectedMonth, selectedDay } = this.data;
    const birthdayStandard = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    const birthdayDisplay = this.formatBirthdayDisplay(selectedYear, selectedMonth, selectedDay);
    
    this.setData({
      birthday: birthdayStandard, // 保存标准格式供提交使用
      birthdayDisplay: birthdayDisplay, // 保存显示格式
      showBirthdayPicker: false
    });
    
    wx.showToast({
      title: this.t('profile.edit.birthdaySelected'),
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
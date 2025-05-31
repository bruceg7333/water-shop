const i18n = require('../../utils/i18n/index');
const { createPage } = require('../../utils/page-base');
const { api } = require('../../utils/request');
const { checkLogin } = require('../../utils/auth');

const pageConfig = {
  data: {
    userInfo: {
      avatarUrl: '/assets/images/profile/user-avatar.svg',
      nickName: '',
      memberLevel: ''
    },
    pointsBalance: 0,
    currentTab: 0,
    tabs: [],
    pointsRecords: [],
    pointsWays: [],
    i18n: {}, // 国际化文本对象
    isLogin: false // 登录状态
  },
  
  /**
   * 更新页面国际化文本
   */
  updateI18nText() {
    // 设置国际化文本
    this.setData({
      i18n: {
        pageTitle: this.t('page.points'),
        currentPoints: this.t('points.balance'),
        availablePoints: this.t('points.label'),
        emptyRecords: this.t('points.empty'),
        noExchangeItems: this.t('points.noExchangeItems'),
        pleaseLogin: this.t('common.loginFirst')
      },
      // 设置标签页
      tabs: [
        { name: this.t('points.tab.detail') },
        { name: this.t('points.tab.ways') },
        { name: this.t('points.tab.exchange') }
      ],
      // 设置获取途径
      pointsWays: [
        {
          icon: '/assets/images/points/shopping.png',
          title: this.t('points.ways.shopping.title'),
          desc: this.t('points.ways.shopping.desc'),
          points: this.t('points.ways.shopping.points')
        },
        {
          icon: '/assets/images/points/review.png',
          title: this.t('points.ways.review.title'),
          desc: this.t('points.ways.review.desc'),
          points: this.t('points.ways.review.points')
        },
        {
          icon: '/assets/images/points/share.png',
          title: this.t('points.ways.share.title'),
          desc: this.t('points.ways.share.desc'),
          points: this.t('points.ways.share.points')
        },
        {
          icon: '/assets/images/points/sign.png',
          title: this.t('points.ways.sign.title'),
          desc: this.t('points.ways.sign.desc'),
          points: this.t('points.ways.sign.points')
        }
      ]
    });
  },
  
  /**
   * 加载用户信息和积分数据
   */
  loadUserData() {
    wx.showLoading({
      title: this.t('common.loading')
    });
    
    // 获取用户信息，使用正确的API方法
    api.user.getCurrentUser()
      .then(res => {
        console.log('获取用户信息成功:', res);
        if (res.success && res.data) {
          // 从本地存储获取用户信息作为备用，确保数据显示
          const storedUser = wx.getStorageSync('userInfo') || {};
          
          // 从响应中提取用户信息，注意处理后端可能的不同数据结构
          let userData = res.data;
          if (res.data.user) {
            userData = res.data.user; // 如果数据嵌套在user字段中
          }
          
          // 获取积分数据
          const points = userData.points || storedUser.points || 0;
          
          // 设置用户数据
          this.setData({
            pointsBalance: points,
            userInfo: {
              avatarUrl: userData.avatar || storedUser.avatar || '/assets/images/profile/user-avatar.svg',
              nickName: userData.nickName || userData.username || storedUser.nickName || this.t('product.reviews.anonymous'),
              // 会员等级由积分决定，不再使用角色字段
              memberLevel: this.getMemberLevelByPoints(points)
            }
          });
          
          // 加载积分记录
          this.loadPointsRecords();
        } else {
          this.setData({
            pointsRecords: [],
            pointsBalance: 0
          });
        }
        wx.hideLoading();
      })
      .catch(err => {
        console.error('获取用户信息失败:', err);
        wx.hideLoading();
        
        // 如果是401错误，说明token过期，直接返回上一页
        if (err && (err.statusCode === 401 || err.code === 401)) {
          wx.showToast({
            title: '登录已过期，请重新登录',
            icon: 'none',
            duration: 2000
          });
          setTimeout(() => {
            wx.navigateBack();
          }, 2000);
          return;
        }
        
        this.setData({
          pointsRecords: [],
          pointsBalance: 0
        });
      });
  },
  
  /**
   * 根据积分获取会员等级文本
   */
  getMemberLevelByPoints(points) {
    if (points >= 5000) {
      return this.t('profile.member.diamond');  // 钻石会员 5000+
    } else if (points >= 2000) {
      return this.t('profile.member.platinum'); // 铂金会员 2000+
    } else if (points >= 1000) {
      return this.t('profile.member.gold');     // 黄金会员 1000+
    } else if (points >= 500) {
      return this.t('profile.member.silver');   // 白银会员 500+
    } else {
      return this.t('profile.member.bronze');   // 青铜会员 0+
    }
  },
  
  /**
   * 获取会员等级的国际化文本
   * @deprecated 使用getMemberLevelByPoints替代
   */
  getMemberLevelText(level) {
    // 如果是管理员，直接返回管理员文本
    if (level === 'admin') {
      return this.t('profile.member.admin');
    }
    
    // 根据用户积分确定会员等级
    const pointsBalance = this.data.pointsBalance || 0;
    
    if (pointsBalance >= 5000) {
      return this.t('profile.member.diamond');  // 钻石会员 5000+
    } else if (pointsBalance >= 2000) {
      return this.t('profile.member.platinum'); // 铂金会员 2000+
    } else if (pointsBalance >= 1000) {
      return this.t('profile.member.gold');     // 黄金会员 1000+
    } else if (pointsBalance >= 500) {
      return this.t('profile.member.silver');   // 白银会员 500+
    } else {
      return this.t('profile.member.bronze');   // 青铜会员 0+
    }
  },
  
  /**
   * 加载积分记录
   */
  loadPointsRecords() {
    console.log('开始加载积分记录');
    api.getPointsRecords()
      .then(res => {
        console.log('获取积分记录成功:', res);
        if (res.success && res.data && res.data.length > 0) {
          const records = res.data.map(record => {
            // 根据API返回的数据格式调整字段名称
            return {
              id: record._id || record.id,
              title: record.title,
              time: new Date(record.createdAt).toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              }),
              points: record.points,
              type: record.type,
              description: record.description || ''
            };
          });
          
          // 获取总积分（可能包含在返回数据中）
          const totalPoints = res.totalPoints || this.calculateTotalPoints(records);
          
          // 更新积分记录和总积分
          this.setData({
            pointsRecords: records,
            pointsBalance: totalPoints,
            userInfo: {
              ...this.data.userInfo,
              points: totalPoints,
              memberLevel: this.getMemberLevelByPoints(totalPoints)
            }
          });
          
          // 保存到本地存储，确保其他页面使用相同数据
          const userInfo = wx.getStorageSync('userInfo') || {};
          wx.setStorageSync('userInfo', {
            ...userInfo,
            points: totalPoints
          });
          
          // 通过API同步更新用户积分，确保所有页面数据一致
          api.updateUserPoints(totalPoints)
            .then(res => {
              console.log('积分数据同步成功:', res);
            })
            .catch(err => {
              console.error('积分数据同步失败:', err);
            });
          
          console.log('最终计算的总积分:', totalPoints);
          console.log('当前会员等级:', this.getMemberLevelByPoints(totalPoints));
        } else {
          console.log('积分记录为空');
          // 直接显示空记录，不加载演示数据
          this.setData({
            pointsRecords: [],
            pointsBalance: 0
          });
        }
      })
      .catch(err => {
        console.error('获取积分记录失败:', err);
        // 显示空记录
        this.setData({
          pointsRecords: [],
          pointsBalance: 0
        });
      });
  },
  
  /**
   * 计算总积分
   */
  calculateTotalPoints(records) {
    let totalPoints = 0;
    let increasedPoints = 0;
    let decreasedPoints = 0;
    
    for (const record of records) {
      if (record.type === 'increase') {
        totalPoints += record.points;
        increasedPoints += record.points;
        console.log(`增加积分: ${record.points}, 原因: ${record.title}`);
      } else if (record.type === 'decrease') {
        totalPoints -= record.points;
        decreasedPoints += record.points;
        console.log(`减少积分: ${record.points}, 原因: ${record.title}`);
      }
    }
    
    console.log('积分记录详情:');
    console.log(`总增加积分: ${increasedPoints}`);
    console.log(`总减少积分: ${decreasedPoints}`);
    console.log(`净积分: ${totalPoints}`);
    
    return totalPoints;
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    // 设置页面标题
    wx.setNavigationBarTitle({
      title: this.t('page.points')
    });

    // 初始化国际化文本
    this.updateI18nText();
    
    // 调试代码：测试会员等级翻译
    console.log('青铜会员翻译:', this.t('profile.member.bronze'));
    console.log('白银会员翻译:', this.t('profile.member.silver'));
    console.log('黄金会员翻译:', this.t('profile.member.gold'));
    console.log('铂金会员翻译:', this.t('profile.member.platinum'));
    console.log('钻石会员翻译:', this.t('profile.member.diamond'));
    console.log('管理员翻译:', this.t('profile.member.admin'));
    
    // 检查用户登录状态
    const isLoggedIn = checkLogin({
      redirectOnFail: false,
      showToast: false
    });
    
    this.setData({
      isLogin: isLoggedIn
    });
    
    if (isLoggedIn) {
      // 已登录，加载用户数据
      this.loadUserData();
    } else {
      // 未登录，显示提示
      wx.showToast({
        title: this.t('common.loginFirst'),
        icon: 'none'
      });
      
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },
  
  /**
   * 页面显示时触发
   */
  onShow() {
    // 检查登录状态是否变化
    const isLoggedIn = checkLogin({
      redirectOnFail: false,
      showToast: false
    });
    
    // 如果登录状态发生变化，刷新数据
    if (isLoggedIn !== this.data.isLogin) {
      this.setData({
        isLogin: isLoggedIn
      });
      
      if (isLoggedIn) {
        this.loadUserData();
      } else {
        wx.navigateBack();
      }
    }
  },
  
  switchTab: function(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentTab: index
    });
  }
};

// 使用createPage包装页面配置
Page(createPage(pageConfig)); 
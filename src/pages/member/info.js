const i18n = require('../../utils/i18n/index');
const { createPage } = require('../../utils/page-base');
const { api } = require('../../utils/request');
const { checkLogin } = require('../../utils/auth');

const pageConfig = {
  data: {
    userInfo: {
      avatarUrl: '/assets/images/profile/default-avatar.svg',
      nickName: '',
      memberLevel: '',
      points: 0
    },
    levelProgress: 0,        // 当前等级进度百分比
    pointsToNextLevel: 0,    // 距离下一等级所需积分
    nextLevel: '',           // 下一等级名称
    currentLevel: 0,         // 当前选中的等级索引
    levels: [],              // 会员等级配置（将通过updateI18nText更新）
    i18n: {}                 // 页面国际化文本
  },
  
  /**
   * 更新页面国际化文本
   */
  updateI18nText() {
    // 定义会员等级配置
    const getBenefits = (levelKey) => {
      // 方法1：直接尝试获取数组形式的权益数据
      const benefitsArray = this.t(`memberLevel.levels.${levelKey}.benefits`, null);
      
      // 如果是有效的数组，过滤并返回非空项
      if (Array.isArray(benefitsArray)) {
        return benefitsArray.filter(benefit => benefit && typeof benefit === 'string' && benefit.trim() !== '');
      }
      
      // 方法2：尝试获取对象形式的权益数据
      const benefits = [];
      
      // 只尝试获取前5个索引，避免过多的空项
      for (let i = 0; i < 5; i++) {
        const key = `memberLevel.levels.${levelKey}.benefits.${i}`;
        const benefit = this.t(key, null);
        
        // 仅当明确返回字符串，且非空时才添加
        if (benefit && typeof benefit === 'string' && benefit.trim() !== '') {
          benefits.push(benefit);
        }
      }
      
      return benefits;
    };
    
    // 获取会员等级配置
    const levels = [
      {
        id: 'bronze',
        name: this.t('profile.member.bronze'),
        icon: '🥉',
        points: 0,
        color: '#cd7f32',
        colorLight: '#f5d0b0',
        benefits: getBenefits('bronze')
      },
      {
        id: 'silver',
        name: this.t('profile.member.silver'),
        icon: '🥈',
        points: 500,
        color: '#c0c0c0',
        colorLight: '#e8e8e8',
        benefits: getBenefits('silver')
      },
      {
        id: 'gold',
        name: this.t('profile.member.gold'),
        icon: '👑',
        points: 1000,
        color: '#ffd700',
        colorLight: '#fff2b2',
        benefits: getBenefits('gold')
      },
      {
        id: 'platinum',
        name: this.t('profile.member.platinum'),
        icon: '💎',
        points: 2000,
        color: '#e5e4e2',
        colorLight: '#f5f5f5',
        benefits: getBenefits('platinum')
      },
      {
        id: 'diamond',
        name: this.t('profile.member.diamond'),
        icon: '💎💎',
        points: 5000,
        color: '#b9f2ff',
        colorLight: '#e6faff',
        benefits: getBenefits('diamond')
      }
    ];
    
    // 设置页面文本
    this.setData({
      levels,
      i18n: {
        title: this.t('memberLevel.title', '会员等级'),
        subtitle: this.t('memberLevel.subtitle', '会员特权介绍'),
        currentLevel: this.t('memberLevel.currentLevel', '当前等级'),
        nextLevel: this.t('memberLevel.nextLevel', '下一等级'),
        progressTitle: this.t('memberLevel.progressTitle', '当前等级进度'),
        maxLevel: this.t('memberLevel.maxLevel', '已达最高等级'),
        points: this.t('profile.points.label', '水滴积分'),
        pointsRequirement: this.t('memberLevel.pointsRequirement', '累计积分达到'),
        rules: {
          title: this.t('memberLevel.rules.title', '会员规则说明'),
          items: [
            this.t('memberLevel.rules.items.0', '会员等级根据累计积分自动升级，升级后不会降级'),
            this.t('memberLevel.rules.items.1', '积分获取方式：购物消费(1元=1积分)、活动奖励、邀请好友等'),
            this.t('memberLevel.rules.items.2', '积分可用于商品抵扣、兑换优惠券等'),
            this.t('memberLevel.rules.items.3', '会员特权包括但不限于：专属优惠、免运费、生日礼包等'),
            this.t('memberLevel.rules.items.4', '最终解释权归本平台所有')
          ]
        }
      }
    });
    
    // 打印日志检查权益项
    this.data.levels.forEach(level => {
      console.log(`${level.name} 权益数量: ${level.benefits.length}`, level.benefits);
    });
  },
  
  onLoad: function(options) {
    // 更新国际化文本
    this.updateI18nText();
    
    // 设置页面标题
    wx.setNavigationBarTitle({
      title: this.t('memberLevel.title', '会员等级')
    });
    
    // 检查用户登录状态
    const isLoggedIn = checkLogin({
      redirectOnFail: false,
      showToast: false
    });
    
    if (!isLoggedIn) {
      wx.showToast({
        title: this.t('common.loginFirst', '请先登录'),
        icon: 'none',
        success: () => {
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
      });
      return;
    }
    
    // 初始化用户信息
    this.loadUserInfo();
  },
  
  loadUserInfo: function() {
    wx.showLoading({
      title: this.t('common.loading')
    });
    
    // 先尝试从缓存获取用户信息作为快速加载
    const storedUser = wx.getStorageSync('userInfo');
    if (storedUser) {
      console.log('已从缓存获取用户信息:', storedUser);
      // 设置一个初始的用户信息，稍后可能会被API返回的数据更新
      this.setData({
        userInfo: {
          avatarUrl: storedUser.avatar || '/assets/images/profile/default-avatar.svg',
          nickName: storedUser.nickName || storedUser.username || this.t('product.reviews.anonymous'),
          points: storedUser.points || 0,
          memberLevel: this.getMemberLevelByPoints(storedUser.points || 0)
        }
      });
    }
    
    // 获取用户信息
    api.user.getCurrentUser()
      .then(res => {
        console.log('从API获取用户信息成功:', res);
        // 获取积分记录并计算总积分
        this.loadPointsAndCalculate();
      })
      .catch(err => {
        console.error('从API获取用户信息失败:', err);
        // 如果从API获取失败，使用从存储加载的信息
        if (storedUser) {
          // 已经在上面设置过了，这里只需计算等级进度
          this.calculateLevelProgress();
          this.initCurrentLevel();
        } else {
          // 如果连缓存都没有，加载演示数据
          this.loadDemoData();
        }
        wx.hideLoading();
      });
  },
  
  /**
   * 加载积分记录并计算总积分
   */
  loadPointsAndCalculate: function() {
    api.getPointsRecords()
      .then(res => {
        console.log('获取积分记录成功:', res);
        
        // 从本地存储获取用户信息
        const storedUser = wx.getStorageSync('userInfo') || {};
        let totalPoints = storedUser.points || 0; // 默认使用存储中的积分值
        
        // 如果有积分记录，计算总积分
        if (res.success && res.data && res.data.length > 0) {
          // 计算总积分
          totalPoints = 0; // 重置为0，然后累加记录中的积分
          for (const record of res.data) {
            if (record.type === 'increase') {
              totalPoints += record.points;
            } else if (record.type === 'decrease') {
              totalPoints -= record.points;
            }
          }
        } else {
          // 没有积分记录，使用存储中的积分或API返回的用户积分
          console.log('没有积分记录，使用存储中的积分:', totalPoints);
          
          // 如果API返回了用户信息中包含积分，优先使用
          if (res.userData && typeof res.userData.points === 'number') {
            totalPoints = res.userData.points;
            console.log('使用API返回的用户积分:', totalPoints);
          }
        }
        
        // 设置用户数据
        this.setData({
          userInfo: {
            avatarUrl: storedUser.avatar || '/assets/images/profile/default-avatar.svg',
            nickName: storedUser.nickName || storedUser.username || this.t('product.reviews.anonymous'),
            points: totalPoints,
            // 会员等级由积分决定，不再使用角色字段
            memberLevel: this.getMemberLevelByPoints(totalPoints)
          }
        });
        
        console.log('最终使用的总积分:', totalPoints);
        console.log('当前会员等级:', this.getMemberLevelByPoints(totalPoints));
        
        // 计算会员等级进度
        this.calculateLevelProgress();
        
        // 初始化当前会员等级tab
        this.initCurrentLevel();
        
        wx.hideLoading();
      })
      .catch(err => {
        console.error('获取积分记录失败:', err);
        this.loadUserInfoFromStorage();
        wx.hideLoading();
      });
  },
  
  /**
   * 从本地存储加载用户信息
   */
  loadUserInfoFromStorage: function() {
    // 从本地存储获取用户信息
    const storedUser = wx.getStorageSync('userInfo');
    
    if (storedUser) {
      // 确保积分为数字类型，默认至少为0
      const points = typeof storedUser.points === 'number' ? storedUser.points : 0;
      
      console.log('从存储加载用户积分:', points);
      
      this.setData({
        userInfo: {
          avatarUrl: storedUser.avatar || '/assets/images/profile/default-avatar.svg',
          nickName: storedUser.nickName || storedUser.username || this.t('product.reviews.anonymous'),
          points: points,
          memberLevel: this.getMemberLevelByPoints(points)
        }
      });
      
      // 计算会员等级进度
      this.calculateLevelProgress();
      
      // 初始化当前会员等级tab
      this.initCurrentLevel();
    } else {
      // 如果本地没有存储，使用演示数据
      this.loadDemoData();
    }
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
  
  loadDemoData: function() {
    // 设置模拟数据
    const points = 100; // 青铜会员等级的积分
    
    this.setData({
      userInfo: {
        avatarUrl: '/assets/images/profile/default-avatar.svg',
        nickName: this.t('product.reviews.anonymous'),
        points: points,
        memberLevel: this.getMemberLevelByPoints(points)
      }
    });
    
    // 计算会员等级进度
    this.calculateLevelProgress();
    
    // 初始化当前会员等级tab
    this.initCurrentLevel();
  },
  
  calculateLevelProgress: function() {
    const { userInfo, levels } = this.data;
    let currentLevelIndex = 0;
    
    // 找到当前等级的索引
    for (let i = 0; i < levels.length; i++) {
      if (levels[i].name === userInfo.memberLevel) {
        currentLevelIndex = i;
        break;
      }
    }
    
    // 如果已经是最高等级
    if (currentLevelIndex >= levels.length - 1) {
      this.setData({
        levelProgress: 100,
        pointsToNextLevel: 0,
        nextLevel: this.t('memberLevel.maxLevel', '已达最高等级'),
        progressTipText: this.t('memberLevel.maxLevel', '已达最高等级')
      });
      return;
    }
    
    // 计算下一等级所需总积分 - 确保是数字
    const nextLevelPoints = parseInt(levels[currentLevelIndex + 1].points, 10);
    // 计算当前等级所需起始积分 - 确保是数字
    const currentLevelPoints = parseInt(levels[currentLevelIndex].points, 10);
    // 计算用户在当前等级的进度 - 确保是数字
    const currentPoints = parseInt(userInfo.points, 10);
    const pointsInCurrentLevel = currentPoints - currentLevelPoints;
    // 计算当前等级的积分范围
    const levelPointsRange = nextLevelPoints - currentLevelPoints;
    // 计算进度百分比 (防止除以0)
    const progress = levelPointsRange > 0 ? 
      Math.min(Math.floor((pointsInCurrentLevel / levelPointsRange) * 100), 100) : 0;
    // 计算距离下一等级所需积分
    const pointsToNext = Math.max(nextLevelPoints - currentPoints, 0);
    
    // 生成进度条提示文本
    const progressTipText = this.t('memberLevel.pointsToNextLevel', '再获得{points}积分即可升级为{level}')
      .replace('{points}', pointsToNext)
      .replace('{level}', levels[currentLevelIndex + 1].name);
    
    this.setData({
      levelProgress: progress,
      pointsToNextLevel: pointsToNext,
      nextLevel: levels[currentLevelIndex + 1].name,
      progressTipText: progressTipText
    });
  },
  
  initCurrentLevel: function() {
    const { userInfo, levels } = this.data;
    
    // 找到当前等级在levels数组中的索引
    let index = 0;
    for (let i = 0; i < levels.length; i++) {
      if (levels[i].name === userInfo.memberLevel) {
        index = i;
        break;
      }
    }
    
    this.setData({
      currentLevel: index
    });
    
    // 根据当前等级设置卡片颜色
    this.setCardColor();
  },
  
  setCardColor: function() {
    const { currentLevel, levels } = this.data;
    
    // 确保index有效
    if (currentLevel < 0 || currentLevel >= levels.length) return;
    
    // 可以在这里动态设置卡片颜色等样式
    // 目前在WXML中直接使用levels数组的颜色
  },
  
  switchLevel: function(e) {
    const index = e.currentTarget.dataset.index;
    
    this.setData({
      currentLevel: index
    });
    
    // 切换等级后更新卡片颜色
    this.setCardColor();
  }
};

// 使用createPage包装页面配置
Page(createPage(pageConfig)); 
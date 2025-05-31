// 引入登录验证工具
const { checkLogin } = require('../../utils/auth');
const { api } = require('../../utils/request');
const i18n = require('../../utils/i18n/index');
const { createPage } = require('../../utils/page-base');

// 定义页面配置
const pageConfig = {
  data: {
    userInfo: {
      avatarUrl: 'https://placehold.co/120x120/cccccc/ffffff?text=User',
      nickName: '未登录',
      isLogin: false,
      memberLevel: '普通会员',
      points: 0,
      couponCount: 0
    },
    orderSummary: [
      {
        id: 1,
        text: '待付款',
        iconText: '¥',
        iconColor: '#ff9a9e',
        badge: 0,
        url: 'pages/order/index?status=pending_payment',
        status: 'pending_payment'
      },
      {
        id: 2,
        text: '待发货',
        iconText: '📦',
        iconColor: '#5ee7df',
        badge: 0,
        url: 'pages/order/index?status=pending_shipment',
        status: 'pending_shipment'
      },
      {
        id: 3,
        text: '待收货',
        iconText: '🚚',
        iconColor: '#a1c4fd',
        badge: 0,
        url: 'pages/order/index?status=pending_receipt',
        status: 'pending_receipt'
      },
      {
        id: 4,
        text: '已完成',
        iconText: '✓',
        iconColor: '#9be15d',
        badge: 0,
        url: 'pages/order/index?status=completed',
        status: 'completed'
      }
    ],
    menuList: [
      {
        id: 1,
        text: '我的收藏',
        iconText: '★',
        iconColor: '#ff9a9e',
        url: 'pages/favorite/list'
      },
      {
        id: 2,
        text: '优惠券',
        iconText: '¥',
        iconColor: '#ff9f7f',
        url: 'pages/coupon/list'
      },
      {
        id: 3,
        text: '水滴积分',
        iconText: '✦',
        iconColor: '#1a78c2',
        url: 'pages/points/index'
      },
      {
        id: 4,
        text: '收货地址',
        iconText: '⌖',
        iconColor: '#a1c4fd',
        url: 'pages/address/list'
      },
      {
        id: 5,
        text: '联系客服',
        iconText: '☎',
        iconColor: '#5ee7df',
        url: 'pages/service/index'
      },
      {
        id: 6,
        text: '关于我们',
        iconText: 'ⓘ',
        iconColor: '#9be15d',
        url: 'pages/about/index'
      }
    ],
    i18n: {}, // 国际化文本
    lastLoginToastTime: 0, // 新增：上次提示时间戳
    isLoadingUserData: false, // 新增：防止重复加载用户数据
    appHideLoginStatus: false // 新增：用于检测登录状态变化
  },

  /**
   * 更新页面国际化文本
   */
  updateI18nText() {
    // 更新订单状态文本
    const orderSummary = this.data.orderSummary.map(item => {
      let statusText = '';
      switch (item.status) {
        case 'pending_payment':
          statusText = this.t('order.status.pending');
          break;
        case 'pending_shipment':
          statusText = this.t('order.status.shipped');
          break;
        case 'pending_receipt':
          statusText = this.t('order.status.receipt');
          break;
        case 'completed':
          statusText = this.t('order.status.completed');
          break;
        default:
          statusText = this.t('order.status.unknown');
      }
      
      return {
        ...item,
        text: statusText
      };
    });
    
    // 更新菜单文本
    const menuList = this.data.menuList.map((item, index) => {
      let text = '';
      switch (index) {
        case 0:
          text = this.t('profile.menu.favorite');
          break;
        case 1:
          text = this.t('profile.menu.coupon');
          break;
        case 2:
          text = this.t('profile.points.label');
          break;
        case 3:
          text = this.t('profile.menu.address');
          break;
        case 4:
          text = this.t('profile.menu.service');
          break;
        case 5:
          text = this.t('profile.menu.about');
          break;
        default:
          text = item.text;
      }
      
      return {
        ...item,
        text
      };
    });
    
    this.setData({
      orderSummary,
      menuList,
      i18n: {
        // 页面标题
        title: this.t('page.profile'),
        
        // 用户信息
        notLogged: this.t('profile.notLogged'),
        login: this.t('profile.login'),
        loginHint: this.t('profile.loginHint'),
        
        // 积分和优惠券
        points: this.t('profile.points.label'),
        coupon: this.t('profile.coupon.label'),
        
        // 订单管理
        myOrders: this.t('profile.order.title'),
        viewAllOrders: this.t('profile.order.all'),
        
        // 退出登录
        logout: this.t('profile.logout'),
        logoutConfirm: this.t('profile.logoutConfirm'),
        logoutSuccess: this.t('profile.logoutSuccess'),
        
        // 会员等级 - 统一键值引用
        memberLevel: this.t('profile.member.normal'),
        regularMember: this.t('profile.member.normal'),
        adminLevel: this.t('profile.member.admin'),
        
        // 版本信息 - 直接提供中文，后续可添加到语言文件
        version: 'SPRINKLE v1.0.0'
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 更新导航栏标题
    wx.setNavigationBarTitle({
      title: this.t('page.profile')
    });
    
    // 初始化国际化文本
    this.updateI18nText();
    
    // 检查登录状态并加载用户信息
    this.checkLoginStatus();
  },

  /**
   * 监听登录成功事件
   */
  loginSuccessEventListener() {
    // 监听登录成功事件
    wx.onAppShow(() => {
      // 检查登录状态变化
      const currentLoginStatus = wx.getStorageSync('isLoggedIn');
      if (currentLoginStatus && !this.data.userInfo.isLogin) {
        // 用户刚刚登录成功，重新加载用户信息
        console.log('检测到用户登录，重新加载用户信息');
        this.checkLoginStatus();
      }
    });
    
    // 监听自定义登录成功事件
    wx.onAppShow(() => {
      const redirectUrl = wx.getStorageSync('redirectUrl');
      if (redirectUrl) {
        wx.removeStorageSync('redirectUrl');
        // 如果有重定向URL，说明是从登录页返回的
        this.checkLoginStatus();
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 检查登录状态变化
    const currentLoginStatus = wx.getStorageSync('isLoggedIn');
    const currentToken = wx.getStorageSync('token');
    
    // 如果登录状态发生变化，重新检查
    if (currentLoginStatus !== this.data.userInfo.isLogin || 
        (currentLoginStatus && !currentToken)) {
      console.log('登录状态发生变化，重新检查');
      this.checkLoginStatus();
    } else if (currentLoginStatus && this.data.userInfo.isLogin) {
      // 已登录状态，重新加载用户信息和订单统计（可能头像昵称已更新）
      console.log("重新加载用户信息以获取最新数据");
      this.loadUserInfo();
      this.loadOrderStatistics();
    }
    // 更新国际化文本（可能语言设置发生了变化）
    this.updateI18nText();
  },

  /**
   * 验证登录状态的有效性
   */
  validateLoginStatus() {
    const token = wx.getStorageSync('token');
    const isLoggedIn = wx.getStorageSync('isLoggedIn');
    const userInfo = wx.getStorageSync('userInfo');
    
    // 检查必要的登录信息是否完整
    if (!token || !isLoggedIn || !userInfo) {
      console.log('登录信息不完整，清除登录状态');
      this.handleInvalidLoginState();
      return false;
    }
    
    return true;
  },

  /**
   * 处理无效的登录状态
   */
  handleInvalidLoginState(showPrompt = true) {
    // 清除所有登录相关的本地存储
    wx.removeStorageSync('token');
    wx.removeStorageSync('userInfo');
    wx.removeStorageSync('isLoggedIn');
    
    // 更新UI为未登录状态
    this.setData({
      'userInfo.avatarUrl': 'https://placehold.co/120x120/cccccc/ffffff?text=User',
      'userInfo.nickName': this.t('profile.notLogged'),
      'userInfo.isLogin': false,
      'userInfo.memberLevel': this.t('profile.member.normal'),
      'userInfo.points': 0,
      'userInfo.couponCount': 0,
      isLoadingUserData: false
    });
    
    // 重置订单统计角标
    const orderSummary = this.data.orderSummary.map(item => ({
      ...item,
      badge: 0
    }));
    this.setData({ orderSummary });
    
    // 可选：显示登录提示
    if (showPrompt) {
      wx.showToast({
        title: this.t('common.loginExpired'),
        icon: 'none'
      });
    }
  },

  /**
   * 检查登录状态并加载相应数据
   */
  checkLoginStatus() {
    // 验证登录状态的有效性
    if (!this.validateLoginStatus()) {
      return;
    }
    
    // 更新登录状态
    this.setData({
      'userInfo.isLogin': true
    });
    
    // 加载用户信息
    this.loadUserInfo();
    
    // 加载订单统计
    this.loadOrderStatistics();
  },

  /**
   * 处理用户登录
   */
  handleUserLogin() {
    wx.navigateTo({
      url: '/pages/member/login'
    });
  },

  /**
   * 处理用户退出登录
   */
  handleLogout() {
    wx.showModal({
      title: this.t('common.tip'),
      content: this.t('profile.logoutConfirm'),
      confirmText: this.t('common.confirm'),
      cancelText: this.t('common.cancel'),
      success: (res) => {
        if (res.confirm) {
          // 清除登录信息
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          wx.removeStorageSync('isLoggedIn');
          
          // 更新UI状态
          this.handleInvalidLoginState(false);
          
          // 显示退出成功提示
          wx.showToast({
            title: this.t('profile.logoutSuccess'),
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 导航到菜单项
   */
  navigateToMenu(e) {
    const url = e.currentTarget.dataset.url;
    const index = e.currentTarget.dataset.index;
    
    // 某些功能需要登录
    const needLoginMenus = [0, 1, 2, 3]; // 收藏、优惠券、积分、地址
    
    if (needLoginMenus.includes(index) && !this.data.userInfo.isLogin) {
      // 防止短时间内重复提示
      const now = Date.now();
      if (now - this.data.lastLoginToastTime < 3000) {
        return; // 3秒内不重复提示
      }
      
      // 更新最后提示时间
      this.setData({ lastLoginToastTime: now });
      
      wx.showToast({
        title: this.t('common.loginFirst'),
        icon: 'none'
      });
      
      // 延迟跳转到登录页，给用户足够时间看到提示
      setTimeout(() => {
        // 记录当前URL以便登录后返回
        wx.setStorageSync('redirectUrl', '/' + url);
        wx.navigateTo({
          url: '/pages/member/login'
        });
      }, 1500);
      return;
    }
    
    // 跳转到对应页面
    wx.navigateTo({
      url: '/' + url
    });
  },

  /**
   * 导航到订单页面，带登录校验和防重复提示
   * 优化后的方法，添加了防重复提示逻辑
   */
  navigateToOrder(e) {
    const url = e.currentTarget.dataset.url;
    const status = e.currentTarget.dataset.status;
    
    // 检查是否已登录
    if (!this.data.userInfo.isLogin) {
      // 防止短时间内重复提示
      const now = Date.now();
      if (now - this.data.lastLoginToastTime < 3000) {
        return; // 3秒内不重复提示
      }
      
      // 更新最后提示时间
      this.setData({ lastLoginToastTime: now });
      
      wx.showToast({
        title: this.t('common.loginFirst'),
        icon: 'none'
      });
      
      // 延迟跳转到登录页，给用户足够时间看到提示
      setTimeout(() => {
        // 记录当前URL以便登录后返回
        wx.setStorageSync('redirectUrl', '/pages/order/index?status=' + status);
        wx.navigateTo({
          url: '/pages/member/login'
        });
      }, 1500);
      return;
    }
    
    // 使用全局变量存储订单状态，供订单页面读取
    getApp().globalData = getApp().globalData || {};
    getApp().globalData.orderStatus = status || '';
    
    console.log('准备导航到: /pages/order/index，状态:', status);
    
    // 使用switchTab跳转到tabbar页面
    wx.switchTab({
      url: '/pages/order/index',
      success: () => {
        console.log('导航成功');
      },
      fail: (err) => {
        console.error('导航失败:', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 查看所有订单，带登录校验和防重复提示
   * 优化后的方法，添加了防重复提示逻辑
   */
  navigateToAllOrders() {
    // 检查是否已登录
    if (!this.data.userInfo.isLogin) {
      // 防止短时间内重复提示
      const now = Date.now();
      if (now - this.data.lastLoginToastTime < 3000) {
        return; // 3秒内不重复提示
      }
      
      // 更新最后提示时间
      this.setData({ lastLoginToastTime: now });
      
      wx.showToast({
        title: this.t('common.loginFirst'),
        icon: 'none'
      });
      
      // 延迟跳转到登录页，给用户足够时间看到提示
      setTimeout(() => {
        // 记录当前URL以便登录后返回
        wx.setStorageSync('redirectUrl', '/pages/order/index');
        wx.navigateTo({
          url: '/pages/member/login'
        });
      }, 1500);
      return;
    }
    
    // 使用全局变量存储订单状态，供订单页面读取
    getApp().globalData = getApp().globalData || {};
    getApp().globalData.orderStatus = '';  // 空字符串表示查看全部订单

    // 使用switchTab跳转到tabbar页面
    wx.switchTab({
      url: '/pages/order/index'
    });
  },

  navigateToMemberInfo(e) {
    // 检查是否已登录
    if (!this.data.userInfo.isLogin) {
      wx.navigateTo({
        url: '/pages/member/login'
      });
      return;
    }
    
    wx.navigateTo({
      url: '/pages/member/info'
    });
  },

  /**
   * 跳转到编辑资料页面
   */
  navigateToProfileEdit() {
    // 检查是否已登录
    if (!this.data.userInfo.isLogin) {
      wx.navigateTo({
        url: '/pages/member/login'
      });
      return;
    }
    
    wx.navigateTo({
      url: '/pages/profile-edit/index'
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
   * 加载用户信息
   * 优化API请求失败时的回退逻辑，确保UI状态一致
   */
  loadUserInfo() {
    // 防止重复加载
    if (this.data.isLoadingUserData) {
      return;
    }
    
    // 检查登录状态
    const token = wx.getStorageSync('token');
    const isLoggedIn = wx.getStorageSync('isLoggedIn');
    
    if (!token || !isLoggedIn) {
      // 如果未登录，直接更新UI为未登录状态
      this.handleInvalidLoginState(false); // 传入false表示不显示提示
      return;
    }
    
    // 标记为正在加载
    this.setData({ isLoadingUserData: true });
    
    // 先尝试从API获取最新用户信息
    console.log('开始从API获取用户信息');
    api.user.getCurrentUser()
      .then(res => {
        console.log('API获取用户信息结果:', res);
        if (res.success && res.data) {
          // 从API返回数据提取用户信息
          let userData = res.data;
          if (res.data.user) {
            userData = res.data.user; // 处理嵌套数据结构
          }
          
          // 提取积分
          const points = userData.points || 0;
          console.log('API获取的积分数据:', points);
          
          // 计算会员等级
          const memberLevel = userData.role === 'admin' ? 
            this.t('profile.member.admin') : 
            this.getMemberLevelByPoints(points);
          
          // 更新UI
          this.setData({
            'userInfo.avatarUrl': userData.avatar || 'https://placehold.co/120x120/1a78c2/ffffff?text=User',
            'userInfo.nickName': userData.nickName || userData.username,
            'userInfo.isLogin': true,
            'userInfo.memberLevel': memberLevel,
            'userInfo.points': points,
            isLoadingUserData: false
          });
          
          // 同时更新本地存储的用户信息
          wx.setStorageSync('userInfo', {
            ...wx.getStorageSync('userInfo'),
            points: points,
            avatar: userData.avatar,
            nickName: userData.nickName || userData.username
          });
        } else {
          // API获取失败，回退到使用本地存储的数据
          console.log('API获取用户信息失败，使用本地存储数据');
          this.loadUserInfoFromStorage();
        }
        
        // 获取优惠券数量
        this.loadCouponCount();
      })
      .catch(err => {
        console.error('API获取用户信息出错:', err);
        
        // request.js会处理401错误并清除登录状态，这里只需要更新UI
        // 由于401已经在request.js中处理，这里只需要回退到使用本地存储的数据
        this.loadUserInfoFromStorage();
        
        // 如果isLoggedIn被request.js取消了，更新UI状态
        if (!wx.getStorageSync('isLoggedIn')) {
          this.handleInvalidLoginState(false); // 传入false表示不显示提示，避免重复
        } else {
          // 获取优惠券数量
          this.loadCouponCount();
        }
      })
      .finally(() => {
        // 确保加载状态被重置
        this.setData({ isLoadingUserData: false });
      });
  },
  
  /**
   * 从本地存储加载用户信息
   * 优化错误处理
   */
  loadUserInfoFromStorage() {
    // 从本地存储获取用户信息
    const userInfo = wx.getStorageSync('userInfo') || null;
    console.log('本地存储的用户信息:', userInfo);
    
    if (userInfo) {
      // 计算会员等级
      const points = userInfo.points || 0;
      console.log('本地存储的积分数据:', points);
      
      const memberLevel = userInfo.role === 'admin' ? 
        this.t('profile.member.admin') : 
        this.getMemberLevelByPoints(points);
      
      this.setData({
        'userInfo.avatarUrl': userInfo.avatar || 'https://placehold.co/120x120/1a78c2/ffffff?text=User',
        'userInfo.nickName': userInfo.nickName || userInfo.username,
        'userInfo.isLogin': true,
        'userInfo.memberLevel': memberLevel,
        'userInfo.points': points,
        isLoadingUserData: false
      });
    } else {
      // 如果本地存储也没有用户信息，确保UI处于未登录状态
      this.setData({
        'userInfo.avatarUrl': 'https://placehold.co/120x120/cccccc/ffffff?text=User',
        'userInfo.nickName': this.t('profile.notLogged'),
        'userInfo.isLogin': false,
        'userInfo.memberLevel': this.t('profile.member.normal'),
        'userInfo.points': 0,
        'userInfo.couponCount': 0,
        isLoadingUserData: false
      });
    }
  },
  
  /**
   * 加载用户优惠券数量
   */
  loadCouponCount() {
    // 获取优惠券数量
    api.coupon.getList()
      .then(res => {
        if (res.success && res.data && res.data.coupons) {
          this.setData({
            'userInfo.couponCount': res.data.coupons.length
          });
        }
      })
      .catch(err => {
        console.error('获取优惠券失败:', err);
      });
  },

  /**
   * 加载订单统计数据 - 修复版本，启用真实API调用
   */
  loadOrderStatistics() {
    console.log('开始加载订单统计数据');
    
    // 检查登录状态
    if (!this.data.userInfo.isLogin) {
      console.log('用户未登录，重置订单角标为0');
      // 未登录状态下重置订单角标为0
      const orderSummary = this.data.orderSummary.map(item => ({
        ...item,
        badge: 0
      }));
      this.setData({ orderSummary });
      return;
    }
    
    // 调用API获取真实订单统计数据
    console.log('用户已登录，开始调用订单统计API');
    api.order.getStatistics().then(res => {
      console.log('订单统计API响应:', res);
      
      if (res.success && res.data) {
        // 处理订单统计数据并更新UI
        const orderStats = res.data || {};
        console.log('订单统计数据:', orderStats);
        
        const orderSummary = this.data.orderSummary.map(item => {
          let badge = 0;
          
          if (item.status === 'pending_payment') {
            badge = orderStats.pendingPayment || orderStats.pending_payment || 0;
          } else if (item.status === 'pending_shipment') {
            badge = orderStats.pendingShipment || orderStats.pending_shipment || 0;
          } else if (item.status === 'pending_receipt') {
            badge = orderStats.pendingReceipt || orderStats.pending_receipt || 0;
          } else if (item.status === 'completed') {
            badge = 0; // 已完成订单不显示角标
          }
          
          console.log(`订单状态 ${item.status} 的角标数量: ${badge}`);
          
          return {
            ...item,
            badge
          };
        });
        
        console.log('更新后的订单摘要:', orderSummary);
        this.setData({ orderSummary });
      } else {
        console.error('订单统计API返回失败:', res);
        // 显示默认值
        this.setDefaultOrderBadges();
      }
    }).catch(err => {
      console.error('获取订单统计失败:', err);
      
      // API调用失败时显示默认值
      this.setDefaultOrderBadges();
    });
  },
  
  // 设置默认订单角标
  setDefaultOrderBadges() {
    console.log('设置默认订单角标');
    const orderSummary = this.data.orderSummary.map(item => ({
      ...item,
      badge: 0
    }));
    
    this.setData({ orderSummary });
  }
};

// 使用createPage包装页面配置
Page(createPage(pageConfig)); 
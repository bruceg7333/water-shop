const i18n = require('../../utils/i18n/index');
const { api } = require('../../utils/request');

Page({
  data: {
    currentTab: 'available',
    tabs: [],
    coupons: [],
    filteredCoupons: [],
    loading: true,
    error: false
  },
  
  onLoad: function() {
    // 注册国际化页面
    const app = getApp();
    if (app && app.globalData) {
      app.globalData.i18nPages = app.globalData.i18nPages || [];
      app.globalData.i18nPages.push(this);
    }
    
    // 更新国际化文本
    this.updateI18nText();
    
    // 加载优惠券数据
    this.loadCouponData();
  },
  
  onShow: function() {
    // 返回页面时刷新数据
    this.loadCouponData();
  },
  
  // 加载优惠券数据
  loadCouponData: function() {
    this.setData({
      loading: true,
      error: false
    });
    
    api.coupon.getList().then(res => {
      this.setData({
        coupons: res.data?.coupons || [],
        loading: false
      });
      this.filterCoupons();
    }).catch(err => {
      console.error('获取优惠券列表失败:', err);
      this.setData({
        error: true,
        loading: false
      });
    });
  },
  
  // 更新页面的国际化文本
  updateI18nText: function() {
    // 更新标题
    wx.setNavigationBarTitle({
      title: i18n.t('page.coupon')
    });
    
    // 更新页面文本
    this.setData({
      i18n: {
        empty: i18n.t('coupon.empty'),
        use: i18n.t('coupon.use'),
        used: i18n.t('coupon.used'),
        expired: i18n.t('coupon.expired'),
        validPeriod: i18n.t('coupon.validPeriod')
      },
      tabs: [
        { name: i18n.t('coupon.tabs.available'), value: 'available' },
        { name: i18n.t('coupon.tabs.used'), value: 'used' },
        { name: i18n.t('coupon.tabs.expired'), value: 'expired' }
      ]
    });
  },
  
  filterCoupons: function() {
    const filteredCoupons = this.data.coupons.filter(coupon => coupon.status === this.data.currentTab);
    this.setData({
      filteredCoupons: filteredCoupons
    });
  },
  
  switchTab: function(e) {
    const value = e.currentTarget.dataset.value;
    this.setData({
      currentTab: value
    });
    this.filterCoupons();
  },
  
  useCoupon: function(e) {
    const coupon = e.currentTarget.dataset.coupon;
    
    // 验证优惠券是否有效
    api.coupon.claim(coupon.id).then(res => {
      if (res.success) {
        // 存储选中的优惠券信息
        wx.setStorageSync('selectedCoupon', coupon);
        
        // 跳转到商品列表页面
        wx.switchTab({
          url: '/pages/index/index'
        });
        
        wx.showToast({
          title: i18n.t('coupon.toast.selected'),
          icon: 'none'
        });
      } else {
        wx.showToast({
          title: res.message || i18n.t('common.error'),
          icon: 'none'
        });
      }
    }).catch(err => {
      console.error('验证优惠券失败:', err);
      wx.showToast({
        title: i18n.t('common.error'),
        icon: 'none'
      });
    });
  }
})
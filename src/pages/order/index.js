// 引入登录验证工具
const { checkLogin } = require('../../utils/auth');
const { api } = require('../../utils/request');
const i18n = require('../../utils/i18n/index');
const { createPage } = require('../../utils/page-base');

// 定义页面配置
const pageConfig = {
  data: {
    currentStatus: '',
    orders: [],
    filteredOrders: [],
    isLogin: false, // 添加登录状态标识
    i18n: {}, // 国际化文本
    isLoading: false, // 添加加载状态控制
    lastLoadTime: 0 // 添加上次加载时间
  },
  
  /**
   * 更新页面国际化文本
   */
  updateI18nText() {
    // 更新页面所有国际化文本
    this.setData({
      i18n: {
        // 页面标题
        title: this.t('page.order'),
        
        // 登录提示
        loginRequired: this.t('common.loginFirst'),
        goToLogin: this.t('profile.login'),
        
        // 订单状态标签
        tabAll: this.t('order.tab.all'),
        tabPending: this.t('order.tab.pending'),
        tabShipped: this.t('order.tab.shipped'),
        tabReceipt: this.t('order.tab.receipt'),
        tabCompleted: this.t('order.tab.completed'),
        
        // 订单状态文本
        statusPending: this.t('order.status.pending'),
        statusShipped: this.t('order.status.shipped'),
        statusReceipt: this.t('order.status.receipt'),
        statusCompleted: this.t('order.status.completed'),
        statusCanceled: this.t('order.status.canceled'),
        
        // 订单信息文本
        orderNumber: this.t('order.number'),
        pieces: this.t('order.pieces'),
        totalAmount: this.t('order.totalAmount'),
        shippingFee: this.t('order.shippingFee'),
        goodsSpec: this.t('order.goodsSpec'),
        currencySymbol: this.t('common.unit.yuan'),
        quantityPrefix: this.t('order.quantityPrefix'),
        openParenthesis: this.t('common.openParenthesis'),
        closeParenthesis: this.t('common.closeParenthesis'),
        
        // 操作按钮文本
        cancelOrder: this.t('order.action.cancel'),
        payNow: this.t('order.action.pay'),
        viewDetail: this.t('order.action.viewDetail'),
        contactService: this.t('order.action.contactService'),
        viewLogistics: this.t('order.action.viewLogistics'),
        confirmReceipt: this.t('order.action.confirmReceipt'),
        deleteOrder: this.t('order.action.delete'),
        reviewOrder: this.t('order.action.review'),
        buyAgain: this.t('order.action.buyAgain'),
        
        // 提示文本
        empty: this.t('order.empty'),
        goShopping: this.t('order.goShopping'),
        cancelConfirm: this.t('order.confirm.cancel'),
        cancelSuccess: this.t('order.success.cancel')
      }
    });
    
    // 更新当前显示的订单状态文本
    this.updateOrderStatusText();
  },
  
  // 更新订单状态文本
  updateOrderStatusText() {
    const orders = this.data.orders;
    
    if (!orders || orders.length === 0) {
      return;
    }
    
    // 为每个订单添加状态文本
    const ordersWithStatus = orders.map(order => {
      // 定义后端状态码到国际化键的映射
      const statusMapping = {
        'pending_payment': 'pending',
        'pending_shipment': 'shipped',
        'pending_receipt': 'receipt',
        'completed': 'completed',
        'canceled': 'canceled'
      };
      
      // 使用映射中的键，如果没有对应的映射则使用原状态码
      const statusKey = `order.status.${statusMapping[order.status] || order.status}`;
      const statusText = this.t(statusKey) || order.status;
      
      return {
        ...order,
        statusText
      };
    });
    
    this.setData({
      orders: ordersWithStatus
    });
    
    // 执行订单过滤
    this.filterOrders();
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 更新导航栏标题
    wx.setNavigationBarTitle({
      title: this.t('page.order')
    });
    
    // 初始化国际化文本
    this.updateI18nText();
    
    // 首先检查全局变量中的订单状态（来自tabbar跳转）
    let status = '';
    const globalData = getApp().globalData;
    if (globalData && globalData.orderStatus !== undefined) {
      status = globalData.orderStatus;
      console.log('从全局变量获取订单状态:', status);
      // 清除全局变量，避免下次误用
      delete globalData.orderStatus;
    }

    // 如果没有全局状态，从URL参数中获取订单状态
    if (!status && options && options.status) {
      status = options.status;
      console.log('从URL参数获取订单状态:', status);
    }

    console.log('最终使用的订单状态:', status);
    
    this.setData({
      currentStatus: status
    });
    
    // 检查用户是否已登录
    const isLoggedIn = checkLogin({
      redirectOnFail: false, // 不自动跳转
      showToast: false // 不显示提示
    });
    
    this.setData({
      isLogin: isLoggedIn
    });
    
    // 如果已登录，加载订单数据
    if (isLoggedIn) {
      this.loadOrders();
    } else {
      // 未登录，显示空数据
      this.setData({ orders: [], filteredOrders: [] });
      console.log('用户未登录，请登录后查看订单');
    }
  },
  
  /**
   * 页面显示时触发
   */
  onShow() {
    // 再次检查用户是否已登录
    const isLoggedIn = checkLogin({
      redirectOnFail: false,
      showToast: false
    });
    
    // 如果登录状态发生变化，更新页面状态
    if (isLoggedIn !== this.data.isLogin) {
      this.setData({
        isLogin: isLoggedIn
      });
      
      // 如果已登录，重新加载订单数据
      if (isLoggedIn) {
        this.loadOrders();
      } else {
        // 如果登出了，清空订单数据
        this.setData({ orders: [], filteredOrders: [] });
      }
    } else if (isLoggedIn) {
      // 已登录状态未变，检查是否需要重新加载数据
      // 如果上次加载时间超过30秒，才重新加载
      const now = Date.now();
      if (now - this.data.lastLoadTime > 30000) {
        this.loadOrders();
      }
    }
  },
  
  // 跳转到登录页面
  goToLogin() {
    wx.navigateTo({
      url: '/pages/member/login'
    });
  },
  
  // 从API加载订单数据
  loadOrders() {
    // 如果未登录或正在加载中，不再请求
    if (!this.data.isLogin || this.data.isLoading) {
      return;
    }
    
    // 设置加载状态
    this.setData({
      isLoading: true
    });
    
    wx.showLoading({
      title: this.t('common.loading')
    });
    
    // 调用API获取订单列表
    api.order.getList()
      .then(res => {
        wx.hideLoading();
        console.log('获取订单列表返回:', res);
        
        // 更新加载状态和时间
        this.setData({
          isLoading: false,
          lastLoadTime: Date.now()
        });
        
        // 处理API返回的数据
        if (res.success && res.data) {
          // API已返回直接可用的订单数组
          const orderList = res.data;
          
          console.log('获取到的订单列表:', orderList);
          
          this.setData({
            orders: orderList
          });
          
          // 更新订单状态文本并触发过滤
          this.updateOrderStatusText();
        } else {
          console.error('获取订单列表失败:', res);
          wx.showToast({
            title: res.message || this.t('common.error'),
            icon: 'none'
          });
        }
      })
      .catch(err => {
        wx.hideLoading();
        console.error('获取订单列表出错:', err);
        
        // 更新加载状态
        this.setData({
          isLoading: false
        });
        
        wx.showToast({
          title: this.t('common.error'),
          icon: 'none'
        });
      });
  },
  
  // 根据当前选中的状态筛选订单
  filterOrders() {
    const currentStatus = this.data.currentStatus;
    const orders = this.data.orders || [];
    
    let filteredOrders = orders;
    
    // 如果选择了特定状态，进行过滤
    if (currentStatus) {
      filteredOrders = orders.filter(order => order.status === currentStatus);
    }
    
    console.log('过滤后的订单列表:', filteredOrders);
    
    this.setData({
      filteredOrders
    });
  },
  
  switchTab: function(e) {
    const status = e.currentTarget.dataset.status;
    
    this.setData({
      currentStatus: status
    });
    
    this.filterOrders();
  },
  
  goShopping: function() {
    wx.navigateTo({
      url: '/pages/product/list'
    });
  },
  
  goToDetail: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/order/detail?id=' + id
    });
  },
  
  cancelOrder: function(e) {
    // 如果未登录，提示登录
    if (!this.data.isLogin) {
      wx.showToast({
        title: this.t('common.loginFirst'),
        icon: 'none'
      });
      return;
    }
    
    const id = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: this.t('common.tip'),
      content: this.t('order.confirm.cancel'),
      success: (res) => {
        if (res.confirm) {
          // 调用取消订单API
          api.order.cancel(id)
            .then(res => {
              if (res.success) {
                // 更新本地数据
                let orders = this.data.orders.map(order => {
                  if (order.id === id) {
                    // 将订单状态改为已取消
                    return {
                      ...order,
                      status: 'canceled',
                      statusText: this.t('order.status.canceled')
                    };
                  }
                  return order;
                });
                
                this.setData({
                  orders: orders
                });
                
                this.filterOrders();
                
                wx.showToast({
                  title: this.t('order.success.cancel'),
                  icon: 'success'
                });
              } else {
                wx.showToast({
                  title: res.message || this.t('common.error'),
                  icon: 'none'
                });
              }
            })
            .catch(err => {
              console.error('取消订单失败:', err);
              wx.showToast({
                title: this.t('common.error'),
                icon: 'none'
              });
            });
        }
      }
    });
  },
  
  payOrder: function(e) {
    // 如果未登录，提示登录
    if (!this.data.isLogin) {
      wx.showToast({
        title: this.t('common.loginFirst'),
        icon: 'none'
      });
      return;
    }
    
    const id = e.currentTarget.dataset.id;
    
    // 跳转到支付页面
    wx.navigateTo({
      url: '/pages/order/payment?id=' + id
    });
  },
  
  viewDetail: function(e) {
    // 如果未登录，提示登录
    if (!this.data.isLogin) {
      wx.showToast({
        title: this.t('common.loginFirst'),
        icon: 'none'
      });
      return;
    }
    
    const id = e.currentTarget.dataset.id;
    
    wx.navigateTo({
      url: '/pages/order/detail?id=' + id
    });
  },
  
  contactService: function(e) {
    wx.navigateTo({
      url: '/pages/service/index'
    });
  },
  
  viewLogistics: function(e) {
    // 如果未登录，提示登录
    if (!this.data.isLogin) {
      wx.showToast({
        title: this.t('common.loginFirst'),
        icon: 'none'
      });
      return;
    }
    
    const id = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: this.t('order.logistics.title'),
      content: this.t('order.logistics.developing'),
      showCancel: false
    });
  },
  
  confirmReceipt: function(e) {
    // 如果未登录，提示登录
    if (!this.data.isLogin) {
      wx.showToast({
        title: this.t('common.loginFirst'),
        icon: 'none'
      });
      return;
    }
    
    const id = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: this.t('common.tip'),
      content: this.t('order.confirm.receipt'),
      success: (res) => {
        if (res.confirm) {
          // 调用确认收货API
          api.order.confirm(id)
            .then(res => {
              if (res.success) {
                // 更新本地数据
                let orders = this.data.orders.map(order => {
                  if (order.id === id) {
                    // 将订单状态改为已完成
                    return {
                      ...order,
                      status: 'completed',
                      statusText: this.t('order.status.completed')
                    };
                  }
                  return order;
                });
                
                this.setData({
                  orders: orders
                });
                
                this.filterOrders();
                
                wx.showToast({
                  title: this.t('order.success.receipt'),
                  icon: 'success'
                });
              } else {
                wx.showToast({
                  title: res.message || this.t('common.error'),
                  icon: 'none'
                });
              }
            })
            .catch(err => {
              console.error('确认收货失败:', err);
              wx.showToast({
                title: this.t('common.error'),
                icon: 'none'
              });
            });
        }
      }
    });
  },
  
  deleteOrder: function(e) {
    // 如果未登录，提示登录
    if (!this.data.isLogin) {
      wx.showToast({
        title: this.t('common.loginFirst'),
        icon: 'none'
      });
      return;
    }
    
    const id = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: this.t('common.tip'),
      content: this.t('order.confirm.delete'),
      success: (res) => {
        if (res.confirm) {
          // 调用删除订单API
          api.order.delete(id)
            .then(res => {
              if (res.success) {
                // 更新本地数据
                let orders = this.data.orders.filter(order => order.id !== id);
                
                this.setData({
                  orders: orders
                });
                
                this.filterOrders();
                
                wx.showToast({
                  title: this.t('order.success.delete'),
                  icon: 'success'
                });
              } else {
                wx.showToast({
                  title: res.message || this.t('common.error'),
                  icon: 'none'
                });
              }
            })
            .catch(err => {
              console.error('删除订单失败:', err);
              wx.showToast({
                title: this.t('common.error'),
                icon: 'none'
              });
            });
        }
      }
    });
  },
  
  reviewOrder: function(e) {
    // 如果未登录，提示登录
    if (!this.data.isLogin) {
      wx.showToast({
        title: this.t('common.loginFirst'),
        icon: 'none'
      });
      return;
    }
    
    const id = e.currentTarget.dataset.id;
    
    wx.navigateTo({
      url: '/pages/order/review?id=' + id
    });
  },
  
  buyAgain: function(e) {
    // 如果未登录，提示登录
    if (!this.data.isLogin) {
      wx.showToast({
        title: this.t('common.loginFirst'),
        icon: 'none'
      });
      return;
    }
    
    const id = e.currentTarget.dataset.id;
    
    // 调用再次购买API，将商品添加到购物车
    api.order.buyAgain(id)
      .then(res => {
        if (res.success) {
          wx.showToast({
            title: this.t('order.success.buyAgain'),
            icon: 'success'
          });
          
          // 跳转到购物车页面
          wx.switchTab({
            url: '/pages/cart/index'
          });
        } else {
          wx.showToast({
            title: res.message || this.t('common.error'),
            icon: 'none'
          });
        }
      })
      .catch(err => {
        console.error('再次购买失败:', err);
        wx.showToast({
          title: this.t('common.error'),
          icon: 'none'
        });
      });
  }
};

// 使用createPage包装页面配置
Page(createPage(pageConfig));

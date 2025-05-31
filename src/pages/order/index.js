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
    
    // 从URL参数中获取订单状态（如果有）
    let status = '';
    if (options && options.status) {
      status = options.status;
    }
    
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
      // 未登录，加载本地演示数据
      console.log('用户未登录，显示本地演示数据');
      this.loadDemoOrders();
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
        // 如果登出了，清空订单数据并加载演示数据
        this.setData({ orders: [], filteredOrders: [] });
        this.loadDemoOrders();
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
  
  // 加载演示订单数据
  loadDemoOrders() {
    // 获取当前登录用户信息
    const userInfo = wx.getStorageSync('userInfo') || { nickName: '默认用户' };
    const now = new Date();
    
    // 格式化当前日期
    const formatDate = (date, offsetDays = 0) => {
      const d = new Date(date);
      d.setDate(d.getDate() - offsetDays);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hour = String(d.getHours()).padStart(2, '0');
      const minute = String(d.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hour}:${minute}`;
    };
    
    // 生成订单号
    const generateOrderNumber = (date, index = 0) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const randomNum = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
      return `${year}${month}${day}${index + 1}${randomNum}`;
    };
    
    // 商品数据 - 使用正确的图片路径
    const products = [
      {
        id: 'p001',
        name: 'SPRINKLE 纯净水',
        specs: ['550ml', '1.5L', '4L'],
        prices: [3.50, 6.50, 12.00],
        images: ['/assets/images/products/water1.jpg']
      },
      {
        id: 'p002',
        name: 'SPRINKLE 矿泉水',
        specs: ['500ml', '1L', '5L'],
        prices: [4.00, 7.00, 15.00],
        images: ['/assets/images/products/water2.jpg']
      },
      {
        id: 'p003',
        name: 'SPRINKLE 山泉水',
        specs: ['380ml', '2L'],
        prices: [5.00, 10.00],
        images: ['/assets/images/products/water3.jpg']
      },
      {
        id: 'p004',
        name: 'SPRINKLE 苏打水',
        specs: ['330ml', '500ml'],
        prices: [6.00, 8.50],
        images: ['/assets/images/products/water4.jpg']
      },
      {
        id: 'p005',
        name: 'SPRINKLE 弱碱性水',
        specs: ['550ml'],
        prices: [7.50],
        images: ['/assets/images/products/water1.jpg']
      }
    ];
    
    // 随机生成订单商品
    const generateOrderItems = (count = 1) => {
      const items = [];
      const usedIndices = new Set();
      
      // 确保至少添加一个商品
      while (items.length < count) {
        // 随机选择产品
        const productIndex = Math.floor(Math.random() * products.length);
        
        // 避免重复添加相同商品
        if (count > 1 && items.length > 0 && usedIndices.has(productIndex)) {
          continue;
        }
        
        usedIndices.add(productIndex);
        const product = products[productIndex];
        
        // 随机选择规格
        const specIndex = Math.floor(Math.random() * product.specs.length);
        const spec = product.specs[specIndex];
        const price = product.prices[specIndex];
        
        // 随机数量 1-5
        const itemCount = Math.floor(Math.random() * 5) + 1;
        
        items.push({
          id: product.id,
          name: product.name,
          spec: spec,
          price: price,
          count: itemCount,
          imageUrl: product.images[0]
        });
      }
      
      return items;
    };
    
    // 创建不同状态的订单
    const orders = [
      // 待支付订单
      {
        id: 'ord001',
        orderNumber: generateOrderNumber(now),
        status: 'pending_payment',
        createTime: formatDate(now),
        goods: generateOrderItems(1),
        get totalCount() {
          return this.goods.reduce((sum, item) => sum + item.count, 0);
        },
        get totalAmount() {
          return this.goods.reduce((sum, item) => sum + item.price * item.count, 0) + this.shippingFee;
        },
        shippingFee: 0.00
      },
      
      // 待发货订单
      {
        id: 'ord002',
        orderNumber: generateOrderNumber(now, 1),
        status: 'pending_shipment',
        createTime: formatDate(now, 1),
        goods: generateOrderItems(2),
        get totalCount() {
          return this.goods.reduce((sum, item) => sum + item.count, 0);
        },
        get totalAmount() {
          return this.goods.reduce((sum, item) => sum + item.price * item.count, 0) + this.shippingFee;
        },
        shippingFee: 0.00
      },
      
      // 待收货订单
      {
        id: 'ord003',
        orderNumber: generateOrderNumber(now, 2),
        status: 'pending_receipt',
        createTime: formatDate(now, 3),
        goods: generateOrderItems(1),
        get totalCount() {
          return this.goods.reduce((sum, item) => sum + item.count, 0);
        },
        get totalAmount() {
          return this.goods.reduce((sum, item) => sum + item.price * item.count, 0) + this.shippingFee;
        },
        shippingFee: 0.00,
        shippingInfo: {
          company: '顺丰速运',
          trackingNumber: 'SF' + Math.floor(Math.random() * 100000000)
        }
      },
      
      // 已完成订单
      {
        id: 'ord004',
        orderNumber: generateOrderNumber(now, 3),
        status: 'completed',
        createTime: formatDate(now, 7),
        goods: generateOrderItems(3),
        get totalCount() {
          return this.goods.reduce((sum, item) => sum + item.count, 0);
        },
        get totalAmount() {
          return this.goods.reduce((sum, item) => sum + item.price * item.count, 0) + this.shippingFee;
        },
        shippingFee: 0.00,
        isReviewed: Math.random() > 0.5 // 随机是否已评价
      },
      
      // 已取消订单
      {
        id: 'ord005',
        orderNumber: generateOrderNumber(now, 4),
        status: 'canceled',
        createTime: formatDate(now, 10),
        goods: generateOrderItems(1),
        get totalCount() {
          return this.goods.reduce((sum, item) => sum + item.count, 0);
        },
        get totalAmount() {
          return this.goods.reduce((sum, item) => sum + item.price * item.count, 0) + this.shippingFee;
        },
        shippingFee: 0.00,
        cancelReason: '用户取消'
      }
    ];
    
    // 计算金额，转为两位小数的字符串
    orders.forEach(order => {
      order.totalAmount = order.totalAmount.toFixed(2);
    });
    
    this.setData({
      orders: orders
    }, () => {
      // 设置数据后，确保更新订单状态文本并过滤订单
      this.updateOrderStatusText();
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

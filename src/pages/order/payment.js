const { createPage } = require('../../utils/page-base');
const i18n = require('../../utils/i18n/index');

// 定义页面配置
const pageConfig = {
  data: {
    orderId: null,
    order: {
      orderNo: 'SP202404280001',
      totalPrice: 86.00
    },
    paymentMethods: [
      {
        id: 'wechat',
        name: '',
        icon: '/assets/images/payment/wechat.png'
      },
      {
        id: 'alipay',
        name: '',
        icon: '/assets/images/payment/alipay.png'
      }
    ],
    selectedMethod: 'wechat',
    i18n: {} // 国际化文本
  },
  
  /**
   * 更新页面国际化文本
   */
  updateI18nText() {
    // 更新页面所有国际化文本
    this.setData({
      i18n: {
        // 页面标题
        title: this.t('order.payment.title'),
        
        // 金额相关
        amountLabel: this.t('order.payment.amount'),
        orderInfoTitle: this.t('order.payment.orderInfo'),
        
        // 订单信息
        orderNoLabel: this.t('order.number'),
        productAmountLabel: this.t('order.payment.productAmount'),
        discountAmountLabel: this.t('order.payment.discountAmount'),
        payAmountLabel: this.t('order.payment.payAmount'),
        
        // 按钮文本
        payNow: this.t('order.payment.confirm'),
        
        // 支付方式
        paymentMethodTitle: this.t('order.payment.method'),
        
        // 货币符号
        currencySymbol: this.t('common.unit.yuan')
      }
    });
    
    // 更新支付方式名称
    const paymentMethods = this.data.paymentMethods.map(method => {
      switch (method.id) {
        case 'wechat':
          method.name = this.t('order.payment.wechat');
          break;
        case 'alipay':
          method.name = this.t('order.payment.alipay');
          break;
        case 'unionpay':
          method.name = this.t('order.payment.unionpay');
          break;
      }
      return method;
    });
    
    this.setData({ paymentMethods });
  },
  
  onLoad: function(options) {
    // 更新导航栏标题
    wx.setNavigationBarTitle({
      title: this.t('order.payment.title')
    });
    
    // 初始化国际化文本
    this.updateI18nText();
    
    // 保存订单ID和金额（如果有）
    let orderAmount = null;
    if (options.id) {
      this.setData({
        orderId: options.id
      });
      
      // 保存金额参数（如有），用于初始显示
      if (options.amount) {
        orderAmount = parseFloat(options.amount);
        this.setData({
          'order.totalPrice': orderAmount
        });
        console.log('从URL获取的订单金额:', orderAmount);
      }
      
      // 加载订单数据
      this.loadOrderData(options.id, orderAmount);
    }
  },
  
  // 加载订单数据
  loadOrderData: function(orderId, preserveAmount) {
    wx.showLoading({
      title: this.t('common.loading')
    });
    
    // 调用API获取订单详情
    const api = require('../../utils/request').api;
    api.order.getDetail(orderId)
      .then(res => {
        wx.hideLoading();
        if (res.success && res.data && res.data.order) {
          // 从API响应中提取订单数据
          const orderData = res.data.order;
          
          // 构建完整的订单对象
          const formattedOrder = {
            orderNo: orderData.orderNumber || `未知订单号`,
            // 优先使用从URL获取的金额，其次使用API返回的不同可能的金额字段
            totalPrice: preserveAmount || orderData.totalPrice || orderData.totalAmount || 0
          };
          
          console.log('从API获取的订单数据:', orderData);
          console.log('格式化后的订单数据:', formattedOrder);
          
          this.setData({
            order: formattedOrder
          });
        } else {
          console.error('订单数据格式错误:', res);
          // 如果API返回错误，仍然确保订单金额显示
          if (preserveAmount) {
            this.setData({
              'order.totalPrice': preserveAmount,
              'order.orderNo': `订单${orderId}`
            });
          } else {
            wx.showToast({
              title: res.message || this.t('common.error'),
              icon: 'none'
            });
          }
        }
      })
      .catch(err => {
        wx.hideLoading();
        console.error('获取订单详情失败:', err);
        
        // 出错时，仍然确保订单金额显示
        if (preserveAmount) {
          this.setData({
            'order.totalPrice': preserveAmount,
            'order.orderNo': `订单${orderId}`
          });
        } else {
          wx.showToast({
            title: this.t('common.error'),
            icon: 'none'
          });
        }
      });
  },
  
  selectPaymentMethod: function(e) {
    const methodId = e.currentTarget.dataset.id;
    this.setData({
      selectedMethod: methodId
    });
  },
  
  confirmPayment: function() {
    if (!this.data.orderId) {
      wx.showToast({
        title: this.t('order.payment.invalidOrder'),
        icon: 'none'
      });
      return;
    }
    
    wx.showLoading({
      title: this.t('order.payment.processing'),
      mask: true
    });
    
    const api = require('../../utils/request').api;
    
    // 打印调试信息
    console.log('开始支付过程，订单ID:', this.data.orderId, '支付方式: 微信支付');
    
    // 1. 调用后端获取支付参数
    api.payment.getPaymentParams({
      orderId: this.data.orderId,
      paymentMethod: 'wechat'
    })
      .then(res => {
        wx.hideLoading();
        
        console.log('获取支付参数响应:', res);
        
        if (!res.success || !res.data || !res.data.paymentParams) {
          wx.showToast({
            title: res.message || this.t('order.payment.failed'),
            icon: 'none'
          });
          return;
        }
        
        const payParams = res.data.paymentParams;
        
        // 在开发环境中可以模拟支付成功
        const isDevelopment = true; // 在小程序环境中固定为开发模式，移除对process.env的依赖
        
        if (isDevelopment || !payParams.appId || payParams.appId === 'mock_app_id') {
          console.log('模拟支付环境，直接调用支付成功逻辑');
          // 直接调用支付成功逻辑
          this.handlePaymentSuccess({
            transactionId: 'mock_' + Date.now()
          });
          return;
        }
        
        // 调用微信支付API
        console.log('调用微信支付，参数:', payParams);
        wx.requestPayment({
          timeStamp: payParams.timeStamp,
          nonceStr: payParams.nonceStr,
          package: payParams.package,
          signType: payParams.signType,
          paySign: payParams.paySign,
          success: (result) => {
            this.handlePaymentSuccess(result);
          },
          fail: (err) => {
            this.handlePaymentFailure(err);
          }
        });
      })
      .catch(err => {
        wx.hideLoading();
        console.error('获取支付参数失败:', err);
        wx.showToast({
          title: this.t('order.payment.failed'),
          icon: 'none'
        });
      });
  },
  
  // 处理支付成功
  handlePaymentSuccess: function(result) {
    console.log('支付成功:', result);
    // 3. 支付成功，调用后端确认接口
    const api = require('../../utils/request').api;
    
    api.payment.confirmPayment({
      orderId: this.data.orderId,
      transactionId: result.transactionId || 'mock_' + Date.now() // 微信支付可能返回交易ID
    })
      .then(confirmRes => {
        if (confirmRes.success) {
          // 4. 确认成功，跳转到结果页
          wx.redirectTo({
            url: `/pages/order/result?type=payment&id=${this.data.orderId}`
          });
        } else {
          // 支付成功但确认失败，提示用户
          wx.showModal({
            title: this.t('common.tip'),
            content: this.t('order.payment.confirmFailed'),
            showCancel: false,
            success: () => {
              wx.redirectTo({
                url: '/pages/order/index?status=pending_payment'
              });
            }
          });
        }
      })
      .catch(err => {
        console.error('支付确认失败:', err);
        wx.showModal({
          title: this.t('common.tip'),
          content: this.t('order.payment.confirmFailed'),
          showCancel: false,
          success: () => {
            wx.redirectTo({
              url: '/pages/order/index?status=pending_payment'
            });
          }
        });
      });
  },
  
  // 处理支付失败
  handlePaymentFailure: function(err) {
    // 支付失败或取消，返回订单列表
    console.error('支付失败:', err);
    wx.showToast({
      title: err.errMsg === 'requestPayment:fail cancel' ? 
        this.t('order.payment.cancelled') : 
        this.t('order.payment.failed'),
      icon: 'none'
    });
    
    // 延迟跳转，让用户能看到提示
    setTimeout(() => {
      wx.redirectTo({
        url: '/pages/order/index?status=pending_payment'
      });
    }, 1500);
  },

  // 返回订单列表
  goToOrderList: function() {
    wx.redirectTo({
      url: '/pages/order/index?status=pending_payment'
    });
  },

  // 处理微信支付失败
  handlePaymentFail: function(errorMsg = '') {
    console.error('微信支付失败:', errorMsg);
    
    this.setData({
      paymentStatus: 'fail',
      paymentErrorMsg: errorMsg || '支付失败，请稍后重试'
    });
    
    wx.showToast({
      title: '支付失败，请稍后重试',
      icon: 'none',
      duration: 2000
    });
    
    // 2秒后返回订单列表
    setTimeout(() => {
      wx.redirectTo({
        url: '/pages/order/index?status=pending_payment'
      });
    }, 2000);
  },

  // 处理微信支付取消
  handlePaymentCancel: function() {
    console.log('用户取消了支付');
    
    this.setData({
      paymentStatus: 'cancel'
    });
    
    wx.showToast({
      title: '支付已取消',
      icon: 'none',
      duration: 2000
    });
    
    // 2秒后返回订单列表
    setTimeout(() => {
      wx.redirectTo({
        url: '/pages/order/index?status=pending_payment'
      });
    }, 2000);
  }
};

// 创建页面
Page(createPage(pageConfig)); 
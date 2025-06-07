const { createPage } = require('../../utils/page-base');
const i18n = require('../../utils/i18n/index');
const api = require('../../utils/request').api;

// 定义页面配置
const pageConfig = {
  data: {
    success: true,
    resultTitle: '',
    resultDesc: '',
    orderInfo: {
      orderNo: 'SP202404290001',
      createTime: '2024-04-29 16:30',
      paymentMethod: '',
      totalAmount: '22.00'
    },
    orderId: 1,
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
        title: this.t('order.result.title'),
        
        // 结果文本
        createSuccessTitle: this.t('order.result.createSuccess'),
        createSuccessDesc: this.t('order.result.createDesc'),
        paySuccessTitle: this.t('order.result.paySuccess'),
        paySuccessDesc: this.t('order.result.payDesc'),
        cancelTitle: this.t('order.result.cancelTitle'),
        cancelDesc: this.t('order.result.cancelDesc'),
        
        // 订单信息
        orderNoLabel: this.t('order.number'),
        orderTimeLabel: this.t('order.result.orderTime'),
        paymentMethodLabel: this.t('order.payment.method'),
        orderAmountLabel: this.t('order.result.orderAmount'),
        
        // 按钮文本
        viewOrder: this.t('order.result.viewOrder'),
        backToHome: this.t('order.result.backToHome'),
        
        // 货币符号
        currencySymbol: this.t('common.unit.yuan')
      }
    });
    
    // 如果已设置resultTitle，则更新支付方式名称
    if (this.data.orderInfo && this.data.orderInfo.paymentMethod) {
      const orderInfo = this.data.orderInfo;
      
      switch (orderInfo.paymentMethod) {
        case 'wechat':
          orderInfo.paymentMethod = this.t('order.payment.wechat');
          break;
        case 'alipay':
          orderInfo.paymentMethod = this.t('order.payment.alipay');
          break;
        case 'unionpay':
          orderInfo.paymentMethod = this.t('order.payment.unionpay');
          break;
      }
      
      this.setData({ orderInfo });
    }
  },
  
  onLoad: function(options) {
    // 更新导航栏标题
    wx.setNavigationBarTitle({
      title: this.t('order.result.title')
    });
    
    // 初始化国际化文本
    this.updateI18nText();
    
    // 从options获取参数
    if (options.success) {
      this.setData({
        success: options.success === 'true'
      });
    }
    
    if (options.type) {
      this.setResultInfo(options.type);
    }
    
    if (options.id) {
      this.setData({
        orderId: options.id
      });
      
      // 加载真实的订单数据
      this.loadOrderData(options.id);
    } else {
      // 如果没有订单ID，设置默认信息
      console.log('未传递订单ID，使用默认订单信息');
      const defaultOrderInfo = {
        orderNo: '未知订单',
        createTime: this.formatDate(new Date()),
        paymentMethod: this.t('order.payment.wechat'),
        totalAmount: '0.00'
      };
      
      this.setData({
        orderInfo: defaultOrderInfo
      });
    }
  },
  
  setResultInfo: function(type) {
    switch(type) {
      case 'create':
        this.setData({
          resultTitle: this.data.i18n.createSuccessTitle,
          resultDesc: this.data.i18n.createSuccessDesc
        });
        break;
      case 'payment':
        this.setData({
          resultTitle: this.data.i18n.paySuccessTitle,
          resultDesc: this.data.i18n.paySuccessDesc
        });
        break;
      case 'cancel':
        this.setData({
          success: false,
          resultTitle: this.data.i18n.cancelTitle,
          resultDesc: this.data.i18n.cancelDesc
        });
        break;
      default:
        break;
    }
  },

  // 加载订单数据
  loadOrderData: function(orderId) {
    if (!orderId) {
      console.log('订单ID为空，跳过数据加载');
      return;
    }

    wx.showLoading({
      title: this.t('common.loading'),
      mask: true
    });

    api.order.getDetail(orderId)
      .then(res => {
        wx.hideLoading();
        
        if (res.success && res.data && res.data.order) {
          const orderData = res.data.order;
          console.log('获取到的订单数据:', orderData);
          
          // 格式化订单信息
          const orderInfo = {
            orderNo: orderData.orderNumber || orderId,
            createTime: this.formatDate(orderData.createdAt || orderData.createTime),
            paymentMethod: this.getPaymentMethodName(orderData.paymentMethod),
            totalAmount: (orderData.totalPrice || orderData.totalAmount || 0).toFixed(2)
          };

          this.setData({
            orderInfo: orderInfo
          });

          console.log('订单信息已更新:', orderInfo);
        } else {
          console.error('获取订单详情失败:', res);
          // 如果获取失败，仍然显示基本信息，但提示用户
          const fallbackOrderInfo = {
            orderNo: orderId,
            createTime: this.formatDate(new Date()),
            paymentMethod: this.t('order.payment.wechat'), // 默认微信支付
            totalAmount: '0.00'
          };
          
          this.setData({
            orderInfo: fallbackOrderInfo
          });

          wx.showToast({
            title: res.message || '获取订单详情失败，显示基本信息',
            icon: 'none',
            duration: 2000
          });
        }
      })
      .catch(err => {
        wx.hideLoading();
        console.error('加载订单数据失败:', err);
        
        // 如果网络错误，也显示基本信息
        const fallbackOrderInfo = {
          orderNo: orderId,
          createTime: this.formatDate(new Date()),
          paymentMethod: this.t('order.payment.wechat'), // 默认微信支付
          totalAmount: '0.00'
        };
        
        this.setData({
          orderInfo: fallbackOrderInfo
        });

        wx.showToast({
          title: '网络错误，显示基本信息',
          icon: 'none',
          duration: 2000
        });
      });
  },

  // 格式化日期
  formatDate: function(dateString) {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).replace(/\//g, '-');
    } catch (e) {
      console.error('日期格式化失败:', e);
      return dateString;
    }
  },

  // 获取支付方式名称
  getPaymentMethodName: function(paymentMethod) {
    if (!paymentMethod) return '';
    
    // 如果已经是中文名称，直接返回
    if (paymentMethod === '微信支付' || paymentMethod === '支付宝' || paymentMethod === '银联支付') {
      return paymentMethod;
    }
    
    // 英文转中文
    switch (paymentMethod.toLowerCase()) {
      case 'wechat':
      case 'wechat_pay':
      case 'wxpay':
        return this.t('order.payment.wechat');
      case 'alipay':
        return this.t('order.payment.alipay');
      case 'unionpay':
        return this.t('order.payment.unionpay');
      default:
        return paymentMethod;
    }
  },
  
  viewOrder: function() {
    wx.redirectTo({
      url: `/pages/order/detail?id=${this.data.orderId}`
    });
  },
  
  goHome: function() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
};

// 创建页面
Page(createPage(pageConfig)); 
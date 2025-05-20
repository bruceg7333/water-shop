const { createPage } = require('../../utils/page-base');
const i18n = require('../../utils/i18n/index');

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
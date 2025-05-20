const { createPage } = require('../../utils/page-base');
const i18n = require('../../utils/i18n/index');

// 定义页面配置
const pageConfig = {
  data: {
    orderId: null,
    order: {
      id: 1,
      orderNo: 'SP202404280001',
      status: 'pending_payment', // pending_payment, pending_shipment, pending_receipt, completed, canceled
      statusText: '',
      createTime: '2024-04-28 15:30',
      paymentMethod: '',
      payTime: '',
      deliveryTime: '',
      completedTime: '',
      remark: '',
      goodsAmount: 86.00,
      shippingFee: 0.00,
      discountAmount: 0.00,
      totalAmount: 86.00,
      recipient: {
        name: '张三',
        phone: '13800138000',
        address: '广东省深圳市南山区科技园南区'
      },
      goods: [
        {
          id: 1,
          name: 'SPRINKLE 纯净水',
          spec: '550ml',
          price: 8.50,
          count: 4,
          imageUrl: '/static/images/products/sprinkle.png'
        },
        {
          id: 2,
          name: 'SPRINKLE 矿泉水',
          spec: '1L',
          price: 9.50,
          count: 3,
          imageUrl: '/static/images/products/sprinkle.png'
        },
        {
          id: 3,
          name: 'SPRINKLE 山泉水',
          spec: '2L',
          price: 10.00,
          count: 3,
          imageUrl: '/static/images/products/sprinkle.png'
        }
      ]
    },
    statusColors: {
      'pending_payment': 'linear-gradient(135deg, #ff9a9e, #ff4d4f)',
      'pending_shipment': 'linear-gradient(135deg, #5ee7df, #0088cc)',
      'pending_receipt': 'linear-gradient(135deg, #a1c4fd, #3f51b5)',
      'completed': 'linear-gradient(135deg, #9be15d, #00e58c)',
      'canceled': 'linear-gradient(135deg, #c9c9c9, #757575)'
    },
    statusDescriptions: {},
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
        title: this.t('page.orderDetail'),
        
        // 订单状态描述
        statusDescPending: this.t('order.statusDesc.pending'),
        statusDescShipped: this.t('order.statusDesc.shipped'),
        statusDescReceipt: this.t('order.statusDesc.receipt'),
        statusDescCompleted: this.t('order.statusDesc.completed'),
        statusDescCanceled: this.t('order.statusDesc.canceled'),
        
        // 订单信息
        addressTitle: this.t('order.addressTitle'),
        orderInfoTitle: this.t('order.infoTitle'),
        orderNoLabel: this.t('order.number'),
        createTimeLabel: this.t('order.createTime'),
        paymentMethodLabel: this.t('order.payment.method'),
        payTimeLabel: this.t('order.payment.time'),
        deliveryTimeLabel: this.t('order.deliveryTime'),
        completedTimeLabel: this.t('order.completedTime'),
        remarkLabel: this.t('order.remark'),
        noRemark: this.t('order.noRemark'),
        
        // 商品信息
        goodsInfoTitle: this.t('order.goodsInfoTitle'),
        goodsSpecLabel: this.t('order.goodsSpec'),
        currencySymbol: this.t('common.unit.yuan'),
        quantityPrefix: this.t('order.quantityPrefix'),
        
        // 订单金额
        goodsAmountLabel: this.t('order.goodsAmount'),
        shippingFeeLabel: this.t('order.shippingFee'),
        discountAmountLabel: this.t('order.discountAmount'),
        totalAmountLabel: this.t('order.payment.payAmount'),
        
        // 操作按钮
        cancelOrder: this.t('order.action.cancel'),
        payNow: this.t('order.action.pay'),
        confirmReceipt: this.t('order.action.confirmReceipt'),
        contactService: this.t('order.action.contactService'),
        
        // 提示文本
        cancelConfirm: this.t('order.confirm.cancel'),
        receiptConfirm: this.t('order.confirm.receipt'),
        processing: this.t('common.loading'),
        cancelSuccess: this.t('order.success.cancel'),
        receiptSuccess: this.t('order.success.receipt')
      }
    });
    
    // 设置状态描述
    const statusDescriptions = {
      'pending_payment': this.t('order.statusDesc.pending'),
      'pending_shipment': this.t('order.statusDesc.shipped'),
      'pending_receipt': this.t('order.statusDesc.receipt'),
      'completed': this.t('order.statusDesc.completed'),
      'canceled': this.t('order.statusDesc.canceled')
    };
    
    this.setData({ statusDescriptions });
    
    // 更新订单状态文本
    if (this.data.order) {
      this.updateOrderStatusText();
    }
  },
  
  // 更新订单状态文本
  updateOrderStatusText() {
    const order = this.data.order;
    let statusText = '';
    
    // 根据状态码设置对应的国际化文本
    switch (order.status) {
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
      case 'canceled':
        statusText = this.t('order.status.canceled');
        break;
      default:
        statusText = this.t('order.status.unknown');
    }
    
    // 更新订单状态文本
    order.statusText = statusText;
    
    // 如果有设置支付方式，更新支付方式名称
    if (order.paymentMethod) {
      switch (order.paymentMethod) {
        case 'wechat':
          order.paymentMethod = this.t('order.payment.wechat');
          break;
        case 'alipay':
          order.paymentMethod = this.t('order.payment.alipay');
          break;
        case 'unionpay':
          order.paymentMethod = this.t('order.payment.unionpay');
          break;
      }
    }
    
    this.setData({ order });
  },
  
  onLoad: function(options) {
    // 更新导航栏标题
    wx.setNavigationBarTitle({
      title: this.t('page.orderDetail')
    });
    
    // 初始化国际化文本
    this.updateI18nText();
    
    if (options.id) {
      this.setData({
        orderId: options.id
      });
      this.getOrderDetail(options.id);
    }
  },
  
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    // 清理资源或状态
    console.log('订单详情页卸载');
  },
  
  /**
   * 返回上一页
   */
  navigateBack: function() {
    wx.navigateBack({
      delta: 1
    });
  },
  
  getOrderDetail: function(orderId) {
    // 显示加载提示
    wx.showLoading({
      title: this.t('common.loading')
    });
    
    console.log('获取订单详情:', orderId);
    
    // 获取API引用
    const api = require('../../utils/request').api;
    
    // 调用API获取订单详情
    api.order.getDetail(orderId)
      .then(res => {
        wx.hideLoading();
        
        if (res.success && res.data && res.data.order) {
          // 从API响应中提取订单数据
          const orderData = res.data.order;
          console.log('获取到的订单数据:', orderData);
          
          // 创建一个标准格式的订单对象，映射字段
          const formattedOrder = {
            id: orderData._id || orderData.id,
            orderNo: orderData.orderNumber || '',
            status: this.mapOrderStatus(orderData.status) || 'pending_payment',
            createTime: this.formatDate(orderData.createdAt || orderData.createTime || ''),
            paymentMethod: orderData.paymentMethod || '',
            payTime: this.formatDate(orderData.paidAt || ''),
            deliveryTime: this.formatDate(orderData.deliveredAt || ''),
            completedTime: this.formatDate(orderData.completedAt || ''),
            remark: orderData.remark || '',
            
            // 金额相关
            goodsAmount: orderData.itemsPrice || 0,
            shippingFee: orderData.shippingPrice || 0,
            discountAmount: orderData.discountAmount || 0, 
            totalAmount: orderData.totalPrice || orderData.totalAmount || 0,
            
            // 收件人信息
            recipient: {
              name: orderData.shippingAddress?.name || '',
              phone: orderData.shippingAddress?.phone || '',
              address: this.formatAddress(orderData.shippingAddress)
            },
            
            // 商品列表
            goods: this.formatOrderItems(orderData.orderItems || [])
          };
          
          console.log('格式化后的订单数据:', formattedOrder);
          
          this.setData({
            order: formattedOrder
          });
          
          // 更新订单状态文本
          this.updateOrderStatusText();
        } else {
          // 数据格式不正确，提示错误
          console.error('订单数据格式错误:', res);
          wx.showToast({
            title: res.message || this.t('common.error'),
            icon: 'none'
          });
        }
      })
      .catch(err => {
        wx.hideLoading();
        console.error('获取订单详情失败:', err);
        wx.showToast({
          title: this.t('common.error'),
          icon: 'none'
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
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  },
  
  // 映射后端订单状态到前端状态码
  mapOrderStatus: function(backendStatus) {
    // 根据后端实际状态字段映射到前端使用的状态码
    const statusMap = {
      'created': 'pending_payment',
      'pending': 'pending_payment',
      'paid': 'pending_shipment',
      'shipped': 'pending_receipt',
      'delivered': 'completed',
      'cancelled': 'canceled',
      'pending_payment': 'pending_payment',
      'pending_shipment': 'pending_shipment',
      'pending_receipt': 'pending_receipt',
      'completed': 'completed',
      'canceled': 'canceled'
    };
    
    return statusMap[backendStatus] || 'pending_payment';
  },
  
  // 格式化地址信息
  formatAddress: function(addressData) {
    if (!addressData) return '';
    
    const { province, city, district, address } = addressData;
    let formattedAddress = '';
    
    if (province) formattedAddress += province;
    if (city) formattedAddress += city;
    if (district) formattedAddress += district;
    if (address) formattedAddress += address;
    
    return formattedAddress;
  },
  
  // 格式化订单商品
  formatOrderItems: function(items) {
    if (!items || !items.length) return [];
    
    return items.map(item => ({
      id: item.productId || item.product || item._id || item.id,
      name: item.name || '',
      spec: item.spec || '',
      price: item.price || 0,
      count: item.quantity || item.count || 0,
      imageUrl: item.image || item.imageUrl || '/static/images/products/sprinkle.png'
    }));
  },
  
  cancelOrder: function() {
    wx.showModal({
      title: this.t('common.tip'),
      content: this.data.i18n.cancelConfirm,
      confirmText: this.t('common.confirm'),
      cancelText: this.t('common.cancel'),
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: this.data.i18n.processing
          });
          
          setTimeout(() => {
            wx.hideLoading();
            
            // 更新订单状态
            let order = this.data.order;
            order.status = 'canceled';
            
            this.setData({
              order: order
            });
            
            // 更新订单状态文本
            this.updateOrderStatusText();
            
            wx.showToast({
              title: this.data.i18n.cancelSuccess,
              icon: 'success'
            });
          }, 1500);
        }
      }
    });
  },
  
  payOrder: function() {
    wx.navigateTo({
      url: `/pages/order/payment?id=${this.data.orderId}`
    });
  },
  
  confirmReceipt: function() {
    wx.showModal({
      title: this.t('common.tip'),
      content: this.data.i18n.receiptConfirm,
      confirmText: this.t('common.confirm'),
      cancelText: this.t('common.cancel'),
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: this.data.i18n.processing
          });
          
          setTimeout(() => {
            wx.hideLoading();
            
            // 更新订单状态
            let order = this.data.order;
            order.status = 'completed';
            order.completedTime = new Date().toLocaleString();
            
            this.setData({
              order: order
            });
            
            // 更新订单状态文本
            this.updateOrderStatusText();
            
            wx.showToast({
              title: this.data.i18n.receiptSuccess,
              icon: 'success'
            });
          }, 1500);
        }
      }
    });
  },
  
  contactService: function() {
    wx.navigateTo({
      url: '/pages/service/chat'
    });
  },
  
  viewProduct: function(e) {
    const productId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/product/detail?id=${productId}`
    });
  }
};

// 创建页面
Page(createPage(pageConfig)); 
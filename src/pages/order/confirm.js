const { createPage } = require('../../utils/page-base');
const i18n = require('../../utils/i18n/index');
const { api } = require('../../utils/request');

// 定义页面配置
const pageConfig = {
  data: {
    address: {
      name: '张三',
      phone: '13800138000',
      province: '广东省',
      city: '深圳市',
      district: '南山区',
      detail: '科技园南区'
    },
    orderItems: [
      {
        id: 1,
        name: 'SPRINKLE 纯净水',
        spec: '550ml',
        price: 2.00,
        quantity: 1,
        imageUrl: '/static/images/products/sprinkle.png'
      }
    ],
    deliveryOptions: [],
    selectedDelivery: 'express',
    paymentOptions: [],
    selectedPayment: 'wechat',
    remark: '',
    totalPrice: '0.00',
    i18n: {} // 国际化文本
  },
  
  /**
   * 更新页面国际化文本
   */
  updateI18nText() {
    // 更新页面所有国际化文本
    const newI18nData = {
        title: this.t('page.orderConfirm'),
        selectAddress: this.t('order.confirmPage.selectAddress'),
        noAddress: this.t('order.confirmPage.addressRequired'),
        changeAddress: this.t('order.confirmPage.changeAddress') || '更换地址',
        productInfo: this.t('order.confirmPage.productInfo'),
        deliveryTitle: this.t('order.confirmPage.delivery_title'),
        paymentTitle: this.t('order.confirmPage.payment_title'),
        payment_wechat: this.t('order.confirmPage.payment_wechat'),
        remarkTitle: this.t('order.confirmPage.remark'),
        remarkPlaceholder: this.t('order.confirmPage.remarkPlaceholder'),
        total: this.t('cart.total'),
        submit: this.t('order.confirmPage.submit'),
        addressRequired: this.t('order.confirmPage.addressRequired'),
        goodsSpec: this.t('order.goodsSpec'),
        currencySymbol: this.t('common.unit.yuan'),
        quantityPrefix: this.t('order.quantityPrefix'),

        // 订单创建流程相关键
        creatingOrder: this.t('order.confirmPage.creatingOrder'),
        createOrderFailed: this.t('order.confirmPage.createOrderFailed'),
        orderPlacedAwaitingPayment: this.t('order.confirmPage.orderPlacedAwaitingPayment') // 新增键
    };
    this.setData({ i18n: newI18nData });
    
    // 设置配送方式选项 - 所有运费设为0
    const deliveryOptions = [
      {
        label: this.t('order.confirmPage.delivery_express'),
        value: 'express',
        price: 0
      },
      {
        label: this.t('order.confirmPage.delivery_selfPickup'),
        value: 'self-pickup',
        price: 0
      }
    ];
    
    // 设置支付方式选项 - 只保留微信支付
    const paymentOptions = [
      {
        label: this.t('order.confirmPage.payment_wechat'),
        value: 'wechat'
      }
    ];
    
    this.setData({
      deliveryOptions,
      paymentOptions
    }, () => {
      // 在设置运费选项后，重新计算总价
      this.calculateTotalPrice();
    });
  },
  
  onLoad: function(options) {
    // 更新导航栏标题 - 使用 page.orderConfirm 作为标准
    wx.setNavigationBarTitle({
      title: this.t('page.orderConfirm') 
    });
    
    // 初始化国际化文本
    this.updateI18nText();
    
    // 从缓存中获取结算商品信息
    const checkoutItems = wx.getStorageSync('checkoutItems');
    
    if (checkoutItems && checkoutItems.items && checkoutItems.items.length > 0) {
      // 将购物车选中的商品转换为订单商品格式
      const orderItems = checkoutItems.items.map(item => {
        return {
          id: item.id,
          productId: item.id, // 确保添加productId，这是后端API所需的字段
          name: item.name,
          spec: item.spec || '',
          price: item.price,
          quantity: item.count, // 购物车中是count，订单中是quantity
          imageUrl: item.imageUrl || item.image || ''
        };
      });
      
      this.setData({
        orderItems: orderItems,
        isDirect: options.direct === 'true' || checkoutItems.fromDirect === true
      }, () => {
        // 在设置完商品后，初始化运费选项，然后计算总价
        this.updateI18nText();
      });
    }
    
    // 加载默认地址
    this.loadDefaultAddress();
  },
  
  onShow: function() {
    // 检查是否有从地址选择页面返回的选中地址
    const selectedAddress = wx.getStorageSync('selectedAddress');
    if (selectedAddress) {
      this.setData({
        address: selectedAddress
      });
      // 清除缓存中的选中地址，防止重复使用
      wx.removeStorageSync('selectedAddress');
    }
  },
  
  // 加载默认地址
  loadDefaultAddress: function() {
    // 调用API获取地址列表
    api.getAddresses()
      .then(res => {
        if (res.success && res.data && res.data.addresses && res.data.addresses.length > 0) {
          // 找到默认地址或使用第一个地址
          const defaultAddress = res.data.addresses.find(addr => addr.isDefault) || res.data.addresses[0];
          
          this.setData({
            address: {
              name: defaultAddress.name,
              phone: defaultAddress.phone,
              province: defaultAddress.province,
              city: defaultAddress.city,
              district: defaultAddress.district,
              detail: defaultAddress.address
            }
          });
        }
      })
      .catch(err => {
        console.error('获取地址失败:', err);
        // 由于地址API错误，显示一个友好的错误提示
        wx.showToast({
          title: this.t('address.fetchError') || '获取地址失败',
          icon: 'none'
        });
      });
  },
  
  calculateTotalPrice: function() {
    let goodsTotal = 0;
    
    this.data.orderItems.forEach(item => {
      goodsTotal += item.price * item.quantity;
    });
    
    // 运费始终为0
    const deliveryPrice = 0;
    const totalPrice = (goodsTotal + deliveryPrice).toFixed(2);
    
    console.log('计算总价：商品总价', goodsTotal, '运费', deliveryPrice, '最终价格', totalPrice);
    
    this.setData({
      totalPrice: totalPrice
    });
  },
  
  selectAddress: function() {
    // 跳转到地址选择页面，并传递来源参数和当前语言的标题
    const addressTitle = encodeURIComponent(this.t('page.address'));
    wx.navigateTo({
      url: `/pages/address/list?from=checkout&title=${addressTitle}`
    });
  },
  
  selectDelivery: function(e) {
    const value = e.currentTarget.dataset.value;
    this.setData({
      selectedDelivery: value
    });
    // 重新计算总价
    this.calculateTotalPrice();
  },
  
  selectPayment: function(e) {
    // 由于只有微信支付，此处不需要改变选择
    this.setData({
      selectedPayment: 'wechat'
    });
  },
  
  onRemarkInput: function(e) {
    this.setData({
      remark: e.detail.value
    });
  },
  
  submitOrder: function() {
    if (!this.data.address) {
      wx.showToast({
        title: this.data.i18n.addressRequired,
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: this.data.i18n.creatingOrder, // 使用 "正在创建订单..."
      mask: true
    });

    // 获取API引用
    const api = require('../../utils/request').api;

    // 构建订单数据，按照后端API期望的格式
    const orderData = {
      // 构建与后端模型完全匹配的订单项数据
      orderItems: this.data.orderItems.map(item => {
        return {
          productId: item.id || item.productId, // 确保使用正确的ID字段
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.imageUrl,
          spec: item.spec || ''
        };
      }),
      // 确保地址格式与后端shippingAddress模型匹配
      shippingAddress: {
        name: this.data.address.name,
        phone: this.data.address.phone,
        province: this.data.address.province,
        city: this.data.address.city,
        district: this.data.address.district,
        address: this.data.address.detail // 后端期望的是address字段
      },
      paymentMethod: this.getPaymentMethodValue(),
      itemsPrice: this.calculateItemsTotal(),
      shippingPrice: this.getShippingPrice(),
      totalPrice: parseFloat(this.data.totalPrice),
      remark: this.data.remark
    };

    // 记录发送的数据，方便调试
    console.log('发送的订单数据:', JSON.stringify(orderData));

    // 调用后端API创建订单
    api.order.create(orderData)
      .then(res => {
        wx.hideLoading();
        
        if (res.success && res.data && res.data.orderId) {
          // 订单创建成功，获取到订单ID
          const orderId = res.data.orderId;
          
          // 清除已结算的购物车商品 (如果是从购物车来的)
          wx.removeStorageSync('checkoutItems');
          
          // 从购物车中移除已下单的商品
          this.removeOrderedItemsFromCart();
          
          // 微信支付处理
          wx.navigateTo({
            url: `/pages/order/payment?id=${orderId}&amount=${this.data.totalPrice}`,
            success: () => {
              console.log('跳转到支付页面成功，参数:', {
                orderId: orderId,
                amount: this.data.totalPrice
              });
            },
            fail: (err) => {
              console.error('跳转到支付页面失败:', err);
              wx.showToast({
                title: this.t('common.error'),
                icon: 'none'
              });
            }
          });
        } else {
          // 订单创建失败
          wx.showToast({
            title: res.message || this.data.i18n.createOrderFailed,
            icon: 'none',
            duration: 2000
          });
        }
      })
      .catch(err => {
        wx.hideLoading();
        console.error('创建订单失败:', err);
        wx.showToast({
          title: this.data.i18n.createOrderFailed,
          icon: 'none',
          duration: 2000
        });
      });
  },
  
  // 计算商品总价
  calculateItemsTotal: function(items) {
    let total = 0;
    // 使用传入的items或当前订单项
    const orderItems = items || this.data.orderItems;
    orderItems.forEach(item => {
      total += item.price * (item.quantity || item.count || 1);
    });
    return parseFloat(total.toFixed(2));
  },
  
  // 获取配送费用
  getShippingPrice: function() {
    // 始终返回0运费
    return 0;
  },
  
  // 获取支付方式对应的后端值
  getPaymentMethodValue: function() {
    // 只有微信支付
    return '微信支付';
  },

  // 从购物车中移除已下单的商品
  removeOrderedItemsFromCart: function() {
    // 获取当前购物车
    const cartItems = wx.getStorageSync('cartItems') || [];
    if (cartItems.length === 0) return;
    
    // 获取当前下单的商品ID列表
    const orderedProductIds = this.data.orderItems.map(item => item.id || item.productId);
    
    // 过滤购物车，保留未下单的商品
    const remainingItems = cartItems.filter(item => !orderedProductIds.includes(item.id));
    
    // 更新购物车存储
    wx.setStorageSync('cartItems', remainingItems);
    
    // 更新TabBar购物车徽标
    if (typeof getApp().updateTabBarBadge === 'function') {
      getApp().updateTabBarBadge(remainingItems.length);
    }
    
    console.log('已从购物车移除已下单商品', orderedProductIds);
  }
};

// 使用createPage包装页面配置
Page(createPage(pageConfig)); 
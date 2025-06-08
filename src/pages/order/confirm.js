const { createPage } = require('../../utils/page-base');
const i18n = require('../../utils/i18n/index');
const { api } = require('../../utils/request');

// 定义页面配置
const pageConfig = {
  data: {
    address: null,
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
    // 优惠券相关
    availableCoupons: [],
    selectedCoupon: null,
    originalPrice: '0.00',
    discountAmount: '0.00',
    showCouponModal: false,
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
        orderPlacedAwaitingPayment: this.t('order.confirmPage.orderPlacedAwaitingPayment'), // 新增键
        
        // 优惠券相关
        couponTitle: this.t('order.confirmPage.couponTitle'),
        selectCoupon: this.t('order.confirmPage.selectCoupon'),
        couponAvailable: this.t('order.confirmPage.couponAvailable'),
        originalPrice: this.t('order.confirmPage.originalPrice'),
        discount: this.t('order.confirmPage.discount'),
        couponCondition: this.t('order.confirmPage.couponCondition'),
        couponConditionSuffix: this.t('order.confirmPage.couponConditionSuffix'),
        couponDefaultDesc: this.t('order.confirmPage.couponDefaultDesc'),
        couponExpire: this.t('order.confirmPage.couponExpire'),
        noCoupon: this.t('order.confirmPage.noCoupon'),
        notUseCoupon: this.t('order.confirmPage.notUseCoupon')
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
    
    // 加载用户可用优惠券
    this.loadAvailableCoupons();
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
    } else if (!this.data.address) {
      // 如果没有选中地址且当前也没有地址，则加载默认地址
      this.loadDefaultAddress();
    }
  },
  
  // 加载默认地址
  loadDefaultAddress: function() {
    // 调用API获取地址列表
    api.getAddresses()
      .then(res => {
        console.log('获取地址API响应:', res);
        if (res.success && res.data && res.data.length > 0) {
          // 找到默认地址或使用第一个地址
          const defaultAddress = res.data.find(addr => addr.isDefault) || res.data[0];
          
          this.setData({
            address: {
              name: defaultAddress.name,
              phone: defaultAddress.phone,
              province: defaultAddress.province,
              city: defaultAddress.city,
              district: defaultAddress.district,
              detail: defaultAddress.detail
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
    const originalPrice = goodsTotal + deliveryPrice;
    
    // 计算优惠券折扣
    let discountAmount = 0;
    if (this.data.selectedCoupon) {
      const coupon = this.data.selectedCoupon;
      if (coupon.type === 'percentage') {
        discountAmount = goodsTotal * (coupon.amount / 100);
        if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
          discountAmount = coupon.maxDiscount;
        }
      } else if (coupon.type === 'fixed') {
        discountAmount = Math.min(coupon.amount, goodsTotal);
      }
    }
    
    const finalPrice = Math.max(0, originalPrice - discountAmount);
    
    console.log('计算总价：商品总价', goodsTotal, '运费', deliveryPrice, '原价', originalPrice, '折扣', discountAmount, '最终价格', finalPrice);
    
    this.setData({
      originalPrice: originalPrice.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
      totalPrice: finalPrice.toFixed(2)
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
      isTestData: true, // 添加测试数据标记，告诉后端这可能是测试商品
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
      totalPrice: this.calculateItemsTotal() + this.getShippingPrice(), // 传递原始总价，让后端计算优惠券
      remark: this.data.remark,
      couponId: this.data.selectedCoupon ? this.data.selectedCoupon.id : null
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
            url: `/pages/order/payment?id=${orderId}`, // 不传递金额，让支付页面从API获取
            success: () => {
              console.log('跳转到支付页面成功，订单ID:', orderId);
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
      getApp().updateTabBarBadge();
    }
    
    console.log('已从购物车移除已下单商品', orderedProductIds);
  },
  
  // 加载用户可用优惠券
  loadAvailableCoupons: function() {
    api.coupon.getUserCoupons({ status: 'unused' })
      .then(res => {
        if (res.success && res.data && res.data.coupons) {
          const availableCoupons = res.data.coupons.filter(coupon => {
            // 过滤出可用的优惠券（未使用且未过期）
            return coupon.status === 'available' && !coupon.isUsed;
          });
          
          this.setData({
            availableCoupons: availableCoupons
          });
          
          // 自动选择最优惠券
          this.autoSelectBestCoupon();
        }
      })
      .catch(err => {
        console.error('获取优惠券失败:', err);
      });
  },
  
  // 自动选择最优惠券
  autoSelectBestCoupon: function() {
    const { availableCoupons } = this.data;
    if (availableCoupons.length === 0) return;
    
    const itemsTotal = this.calculateItemsTotal();
    let bestCoupon = null;
    let maxDiscount = 0;
    
    availableCoupons.forEach(couponData => {
      // 检查最低消费条件
      if (couponData.condition && itemsTotal < couponData.condition) {
        return; // 不满足使用条件
      }
      
      // 计算折扣金额 - 修复类型判断逻辑
      let discount = 0;
      const couponType = couponData.type || 'fixed'; // 默认为固定金额类型
      
      if (couponType === 'percentage') {
        // 百分比折扣 - 统一使用price字段
        discount = itemsTotal * (couponData.price / 100);
        if (couponData.maxDiscount && discount > couponData.maxDiscount) {
          discount = couponData.maxDiscount;
        }
      } else {
        // 固定金额折扣 (fixed类型)
        discount = Math.min(couponData.price, itemsTotal);
      }
      
      if (discount > maxDiscount) {
        maxDiscount = discount;
        bestCoupon = {
          id: couponData.id,
          name: couponData.name,
          type: couponType,
          amount: couponData.price,
          maxDiscount: couponData.maxDiscount,
          condition: couponData.condition
        };
      }
    });
    
    if (bestCoupon) {
      this.setData({
        selectedCoupon: bestCoupon
      });
      this.calculateTotalPrice();
    }
  },
  
  // 显示优惠券选择弹窗
  showCouponModal: function() {
    this.setData({
      showCouponModal: true
    });
  },
  
  // 隐藏优惠券选择弹窗
  hideCouponModal: function() {
    this.setData({
      showCouponModal: false
    });
  },
  
  // 选择优惠券
  selectCoupon: function(e) {
    const index = e.currentTarget.dataset.index;
    const couponData = this.data.availableCoupons[index];
    
    // 检查最低消费条件
    const itemsTotal = this.calculateItemsTotal();
    if (couponData.condition && itemsTotal < couponData.condition) {
      wx.showToast({
        title: `订单金额不满足使用条件，最低消费${couponData.condition}元`,
        icon: 'none'
      });
      return;
    }
    
    const selectedCoupon = {
      id: couponData.id,
      name: couponData.name,
      type: couponData.type || 'fixed',
      amount: couponData.price,
      maxDiscount: couponData.maxDiscount,
      condition: couponData.condition
    };
    
    this.setData({
      selectedCoupon: selectedCoupon,
      showCouponModal: false
    });
    
    this.calculateTotalPrice();
  },
  
  // 不使用优惠券
  clearCoupon: function() {
    this.setData({
      selectedCoupon: null,
      showCouponModal: false
    });
    this.calculateTotalPrice();
  }
};

// 使用createPage包装页面配置
Page(createPage(pageConfig));
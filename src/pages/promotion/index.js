Page({
  data: {
    activeTab: 'coupon', // 默认显示新人礼包
    userInfo: {
      isLogin: false
    },
    newUserCoupons: [
      {
        id: 1,
        value: 5,
        name: '新用户专享券',
        condition: '无门槛使用',
        validTime: '领取后30天内有效',
        isReceived: false
      },
      {
        id: 2,
        value: 10,
        name: '满减优惠券',
        condition: '满30元可用',
        validTime: '领取后30天内有效',
        isReceived: false
      },
      {
        id: 3,
        value: 20,
        name: '大额优惠券',
        condition: '满80元可用',
        validTime: '领取后30天内有效',
        isReceived: false
      }
    ],
    discountProducts: [
      {
        id: 1,
        name: 'SPRINKLE 纯净水 500ml*24瓶',
        description: '来自高山冰川，纯净甘甜',
        originalPrice: 48.00,
        discountPrice: 38.40,
        discount: 8,
        imageUrl: '/assets/images/products/sprinkle.png',
        soldPercentage: 75
      },
      {
        id: 2,
        name: 'SPRINKLE 矿泉水 380ml*24瓶',
        description: '富含矿物质，健康饮用水选择',
        originalPrice: 36.00,
        discountPrice: 25.20,
        discount: 7,
        imageUrl: '/assets/images/products/sprinkle.png',
        soldPercentage: 60
      },
      {
        id: 3,
        name: 'SPRINKLE 天然苏打水 500ml*12瓶',
        description: '无糖配方，清爽饮用',
        originalPrice: 59.00,
        discountPrice: 41.30,
        discount: 7,
        imageUrl: '/assets/images/products/sprinkle.png',
        soldPercentage: 50
      }
    ],
    groupProducts: [
      {
        id: 1,
        name: 'SPRINKLE 纯净水家庭装 4L*4桶',
        description: '大容量家庭装，经济实惠',
        originalPrice: 100.00,
        groupPrice: 79.00,
        groupSize: 3,
        groupCount: 25,
        imageUrl: '/assets/images/products/sprinkle.png'
      },
      {
        id: 2,
        name: 'SPRINKLE 矿泉水礼盒装 500ml*12瓶',
        description: '精美礼盒包装，送礼佳选',
        originalPrice: 68.00,
        groupPrice: 49.00,
        groupSize: 2,
        groupCount: 42,
        imageUrl: '/assets/images/products/sprinkle.png'
      },
      {
        id: 3,
        name: 'SPRINKLE 婴幼儿饮用水 350ml*24瓶',
        description: '专为婴幼儿设计，安全无添加',
        originalPrice: 128.00,
        groupPrice: 99.00,
        groupSize: 5,
        groupCount: 18,
        imageUrl: '/assets/images/products/sprinkle.png'
      }
    ]
  },

  onLoad(options) {
    // 检查登录状态
    this.checkLoginStatus();
    
    // 根据参数切换选项卡
    if (options && options.tab) {
      this.setData({
        activeTab: options.tab
      });
    }
  },

  checkLoginStatus() {
    const isLoggedIn = wx.getStorageSync('isLoggedIn') || false;
    
    this.setData({
      'userInfo.isLogin': isLoggedIn
    });
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });
  },

  handleLogin() {
    wx.navigateTo({
      url: '/pages/profile/index',
      events: {
        // 监听登录成功事件
        loginSuccess: () => {
          this.checkLoginStatus();
        }
      },
      success: () => {
        // 提示用户登录
        wx.showToast({
          title: '请先登录',
          icon: 'none'
        });
      }
    });
  },

  receiveCoupon(e) {
    // 检查是否已登录
    if (!this.data.userInfo.isLogin) {
      this.handleLogin();
      return;
    }

    const couponId = e.currentTarget.dataset.id;
    const couponIndex = this.data.newUserCoupons.findIndex(item => item.id === couponId);
    
    if (couponIndex === -1) return;
    
    // 检查优惠券是否已领取
    if (this.data.newUserCoupons[couponIndex].isReceived) {
      wx.showToast({
        title: '优惠券已领取',
        icon: 'none'
      });
      return;
    }

    // 更新优惠券状态
    const newCoupons = [...this.data.newUserCoupons];
    newCoupons[couponIndex].isReceived = true;
    
    this.setData({
      newUserCoupons: newCoupons
    });

    // 模拟添加优惠券到用户账户
    // 在实际应用中，这里应该发送请求到服务器
    setTimeout(() => {
      wx.showToast({
        title: '领取成功',
        icon: 'success'
      });
    }, 300);
  },

  onProductTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/product/detail?id=${id}`
    });
  },

  onBuyNow(e) {
    const id = e.currentTarget.dataset.id;
    const product = this.data.discountProducts.find(item => item.id === id);
    
    if (!product) return;
    
    // 将商品加入购物车
    let cartItems = wx.getStorageSync('cartItems') || [];
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.count += 1;
    } else {
      cartItems.push({
        id: product.id,
        name: product.name,
        price: product.discountPrice,
        count: 1,
        selected: true,
        imageUrl: product.imageUrl
      });
    }
    
    wx.setStorageSync('cartItems', cartItems);
    
    // 更新购物车徽标
    getApp().updateTabBarBadge(cartItems.length);
    
    // 提示添加成功
    wx.showToast({
      title: '已加入购物车',
      icon: 'success'
    });
    
    // 跳转到购物车页面
    setTimeout(() => {
      wx.switchTab({
        url: '/pages/cart/index'
      });
    }, 1500);
  },

  onGroupTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/product/detail?id=${id}&type=group`
    });
  },

  onJoinGroup(e) {
    const id = e.currentTarget.dataset.id;
    // 检查是否已登录
    if (!this.data.userInfo.isLogin) {
      this.handleLogin();
      return;
    }
    
    // 在实际应用中，这里应该跳转到拼团详情页面
    wx.navigateTo({
      url: `/pages/product/detail?id=${id}&type=group`
    });
  }
}) 
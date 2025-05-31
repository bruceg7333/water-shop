// 引入登录验证工具
const { checkLogin } = require('../../utils/auth');
const { api } = require('../../utils/request');
const i18n = require('../../utils/i18n/index');
const { createPage } = require('../../utils/page-base');

// 定义页面配置
const pageConfig = {
  data: {
    cartItems: [],
    totalPrice: 0,
    selectedAll: false,
    isEmpty: true,
    isLogin: false, // 添加登录状态
    isLoading: false, // 添加加载状态
    i18n: {}, // 国际化文本
    // 触摸相关数据
    touchStartX: 0,
    touchStartY: 0,
    touchMoveX: 0,
    currentIndex: -1,
    isMoving: false,
    // 鼠标相关数据（用于开发者工具测试）
    mouseDown: false,
    mouseStartX: 0
  },

  onLoad() {
    // 初始化国际化文本
    this.updateI18nText();
    
    // 设置页面标题
    wx.setNavigationBarTitle({
      title: this.t('page.cart')
    });
    
    // 检查登录状态并加载数据
    this.checkLoginAndLoadData();
  },

  /**
   * 更新页面国际化文本
   */
  updateI18nText() {
    this.setData({
      i18n: {
        // 页面标题
        title: this.t('page.cart'),
        
        // 登录提示
        loginRequired: this.t('common.loginFirst'),
        goToLogin: this.t('profile.login'),
        
        // 购物车状态
        empty: this.t('cart.empty'),
        goShopping: this.t('cart.goShopping'),
        
        // 结算区域
        selectAll: this.t('cart.selectAll'),
        total: this.t('cart.total'),
        pieces: this.t('cart.pieces').replace('{count}', this.data.cartItems.length),
        checkout: this.t('cart.checkout'),
        
        // 确认框文本
        confirmRemove: this.t('cart.confirmRemove'),
        removeSuccess: this.t('cart.removeSuccess'),
        
        // 提示信息
        selectItemsFirst: this.t('cart.selectItemsFirst'),
        
        // 删除按钮
        delete: this.t('common.delete'),
        
        // 其他文本
        unit: this.t('common.unit.yuan')
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 检查登录状态并加载数据
    this.checkLoginAndLoadData();
  },

  // 检查登录状态并加载数据
  checkLoginAndLoadData() {
    const isLoggedIn = checkLogin({
      redirectOnFail: false, // 不自动跳转
      showToast: false // 不显示提示
    });
    
    this.setData({
      isLogin: isLoggedIn
    });
    
    if (isLoggedIn) {
      // 已登录，从API加载购物车数据
      this.loadCartFromAPI();
    } else {
      // 未登录，清空数据并显示登录提示
      this.setData({
        cartItems: [],
        isEmpty: true,
        totalPrice: 0,
        selectedAll: false
      });
    }
  },

  // 从API加载购物车数据
  loadCartFromAPI() {
    console.log('从API加载购物车数据');
    api.getCart()
      .then(res => {
        console.log('API购物车响应:', res);
        if (res.success && res.data) {
          // 转换API数据格式为前端需要的格式
          const apiItems = res.data.items || [];
          const cartItems = apiItems.map(item => {
            const product = item.product || {};
            return {
              id: product._id || product.id,
              name: product.name || item.name,
              price: parseFloat(item.price || product.price || 0),
              count: item.quantity || 1,
              imageUrl: product.imageUrl || item.imageUrl || '/assets/images/default-product.png',
              spec: item.spec || '默认规格',
              selected: true, // 默认选中
              x: 0 // 确保滑动位置为0
            };
          });
          
          const isEmpty = cartItems.length === 0;
          
          this.setData({
            cartItems,
            isEmpty
          });
          
          // 更新全选状态和总价
          this.updateSelectedStatus();
          this.calculateTotal();
          
          // 更新全局购物车角标
          if (getApp() && typeof getApp().updateCartBadge === 'function') {
            getApp().updateCartBadge();
          }
          
          console.log('购物车数据加载完成:', cartItems);
        } else {
          console.log('API返回空购物车或失败:', res);
          this.setData({
            cartItems: [],
            isEmpty: true
          });
        }
      })
      .catch(err => {
        console.error('加载购物车失败:', err);
        // 加载失败时设置空购物车
        this.setData({
          cartItems: [],
          isEmpty: true,
          isLogin: false // 可能是登录过期
        });
        
        // 如果是认证错误，提示用户重新登录
        if (err.needLogin) {
          wx.showToast({
            title: this.t('common.loginExpired'),
            icon: 'none'
          });
        }
      });
  },

  // 跳转到登录页面
  goToLogin() {
    wx.navigateTo({
      url: '/pages/member/login'
    });
  },

  // 加载购物车数据（保留原有方法作为备用）
  loadCartData() {
    // 如果已登录，使用API加载
    if (this.data.isLogin) {
      this.loadCartFromAPI();
      return;
    }
    
    // 未登录时的处理逻辑
    const cartItems = wx.getStorageSync('cartItems') || [];
    const isEmpty = cartItems.length === 0;
    
    // 确保每个购物车项目都有x属性
    cartItems.forEach(item => {
      item.x = 0;
    });
    
    this.setData({
      cartItems,
      isEmpty
    });
    
    // 更新全选状态和总价
    this.updateSelectedStatus();
    this.calculateTotal();
    
    // 更新购物车徽标
    getApp().updateTabBarBadge(cartItems.length);
    
    // 更新结算按钮文本中的商品数量
    if (this.data.i18n.pieces) {
      this.setData({
        'i18n.pieces': this.t('cart.pieces').replace('{count}', cartItems.length)
      });
    }
  },

  // 更新选中状态
  updateSelectedStatus() {
    const { cartItems } = this.data;
    const selectedAll = cartItems.length > 0 && cartItems.every(item => item.selected);
    
    this.setData({
      selectedAll
    });
  },

  // 计算总价
  calculateTotal() {
    const { cartItems } = this.data;
    let total = 0;
    
    cartItems.forEach(item => {
      if (item.selected) {
        total += item.price * item.count;
      }
    });
    
    this.setData({
      totalPrice: total.toFixed(2)
    });
  },

  // 切换全选状态
  toggleSelectAll() {
    const { selectedAll, cartItems } = this.data;
    const newSelectedAll = !selectedAll;
    
    const newCartItems = cartItems.map(item => {
      return {
        ...item,
        selected: newSelectedAll
      };
    });
    
    this.setData({
      selectedAll: newSelectedAll,
      cartItems: newCartItems
    });
    
    // 保存到本地存储
    wx.setStorageSync('cartItems', newCartItems);
    
    // 计算总价
    this.calculateTotal();
  },

  // 切换单个商品选中状态
  toggleSelect(e) {
    const { index } = e.currentTarget.dataset;
    const { cartItems } = this.data;
    
    cartItems[index].selected = !cartItems[index].selected;
    
    this.setData({
      cartItems
    });
    
    // 保存到本地存储
    wx.setStorageSync('cartItems', cartItems);
    
    // 更新全选状态和总价
    this.updateSelectedStatus();
    this.calculateTotal();
  },

  // 增加商品数量
  increaseCount(e) {
    const { index } = e.currentTarget.dataset;
    const { cartItems } = this.data;
    
    cartItems[index].count += 1;
    
    this.setData({
      cartItems
    });
    
    // 保存到本地存储
    wx.setStorageSync('cartItems', cartItems);
    
    // 更新总价
    this.calculateTotal();
    
    // 使用全局updateCartBadge方法更新购物车角标，确保与API数据同步
    const app = getApp();
    if (app && typeof app.updateCartBadge === 'function') {
      app.updateCartBadge().then(count => {
        console.log('增加商品后角标更新完成，数量:', count);
      }).catch(err => {
        console.log('增加商品后角标更新失败:', err);
      });
    }
  },

  // 减少商品数量
  decreaseCount(e) {
    const { index } = e.currentTarget.dataset;
    const { cartItems } = this.data;
    
    if (cartItems[index].count > 1) {
      cartItems[index].count -= 1;
      
      this.setData({
        cartItems
      });
      
      // 保存到本地存储
      wx.setStorageSync('cartItems', cartItems);
      
      // 更新总价
      this.calculateTotal();
      
      // 使用全局updateCartBadge方法更新购物车角标，确保与API数据同步
      const app = getApp();
      if (app && typeof app.updateCartBadge === 'function') {
        app.updateCartBadge().then(count => {
          console.log('减少商品后角标更新完成，数量:', count);
        }).catch(err => {
          console.log('减少商品后角标更新失败:', err);
        });
      }
    }
  },

  // 删除商品
  deleteItem(e) {
    const { index } = e.currentTarget.dataset;
    const { cartItems } = this.data;
    
    wx.showModal({
      title: this.t('common.tip'),
      content: this.t('cart.confirmRemove'),
      confirmText: this.t('common.confirm'),
      cancelText: this.t('common.cancel'),
      success: (res) => {
        if (res.confirm) {
          cartItems.splice(index, 1);
          
          // 重置所有滑动状态
          cartItems.forEach(item => {
            item.x = 0;
          });
          
          const isEmpty = cartItems.length === 0;
          
          this.setData({
            cartItems,
            isEmpty
          });
          
          // 保存到本地存储
          wx.setStorageSync('cartItems', cartItems);
          
          // 更新全选状态和总价
          this.updateSelectedStatus();
          this.calculateTotal();
          
          // 更新购物车徽标
          getApp().updateTabBarBadge(cartItems.length);
          
          // 更新结算按钮文本中的商品数量
          if (this.data.i18n.pieces) {
            this.setData({
              'i18n.pieces': this.t('cart.pieces').replace('{count}', cartItems.length)
            });
          }
          
          wx.showToast({
            title: this.t('cart.removeSuccess'),
            icon: 'success'
          });
        } else {
          // 取消删除，重置滑动状态
          this.setData({
            [`cartItems[${index}].x`]: 0
          });
        }
      }
    });
  },

  // 去结算
  checkout() {
    const { cartItems, totalPrice } = this.data;
    
    // 过滤出选中的商品
    const selectedItems = cartItems.filter(item => item.selected);
    
    if (selectedItems.length === 0) {
      wx.showToast({
        title: this.t('cart.selectItemsFirst'),
        icon: 'none'
      });
      return;
    }
    
    // 保存结算商品到缓存，确保每个商品都有必要的字段
    const enhancedItems = selectedItems.map(item => ({
      id: item.id,
      productId: item.id, // 添加productId字段，确保与后端API匹配
      name: item.name,
      price: parseFloat(item.price),
      count: item.count,
      quantity: item.count, // 添加quantity字段，确保与订单页面匹配
      spec: item.spec || '',
      image: item.image || '',
      imageUrl: item.imageUrl || item.image || '',
    }));
    
    // 计算实际总价
    let calculatedTotal = 0;
    enhancedItems.forEach(item => {
      calculatedTotal += item.price * item.count;
    });
    
    // 总价保留两位小数
    const formattedTotalPrice = calculatedTotal.toFixed(2);
    
    wx.setStorageSync('checkoutItems', {
      items: enhancedItems,
      totalPrice: formattedTotalPrice
    });
    
    console.log('准备结算的商品:', enhancedItems);
    console.log('结算总价:', formattedTotalPrice);
    
    // 跳转到结算页面
    wx.navigateTo({
      url: '/pages/order/confirm'
    });
  },

  // 去购物
  goShopping() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  // 处理触摸开始事件
  handleTouchStart(e) {
    const { index } = e.currentTarget.dataset;
    const touch = e.touches[0];
    
    this.setData({
      touchStartX: touch.clientX,
      touchStartY: touch.clientY,
      currentIndex: index,
      isMoving: false
    });
    
    // 重置其他项的滑动状态
    const { cartItems } = this.data;
    cartItems.forEach((item, i) => {
      if (i !== index) {
        item.x = 0;
      }
    });
    this.setData({ cartItems });
  },

  // 处理触摸移动事件
  handleTouchMove(e) {
    const { touchStartX, touchStartY, currentIndex } = this.data;
    const touch = e.touches[0];
    const moveX = touch.clientX - touchStartX;
    const moveY = touch.clientY - touchStartY;
    
    // 判断是否为水平滑动
    if (Math.abs(moveX) > Math.abs(moveY) && Math.abs(moveX) > 10) {
      // 防止页面滚动
      e.preventDefault && e.preventDefault();
      
      this.setData({
        isMoving: true,
        touchMoveX: moveX
      });
      
      // 限制滑动范围：向左滑动最多150px，向右滑动回到0
      let translateX = 0;
      if (moveX < 0) {
        // 向左滑动，显示删除按钮
        translateX = Math.max(moveX, -150);
      } else {
        // 向右滑动，回到原位
        translateX = Math.min(moveX, 0);
      }
      
      // 更新当前项的位置
      this.setData({
        [`cartItems[${currentIndex}].x`]: translateX
      });
    }
  },

  // 处理触摸结束事件
  handleTouchEnd(e) {
    const { index } = e.currentTarget.dataset;
    const touch = e.detail || e.changedTouches[0];
    
    // 如果是movable-view的事件，直接返回
    if (e.detail && e.detail.source) {
      return;
    }
    
    // 原有的触摸结束逻辑
    const { touchMoveX, currentIndex, isMoving } = this.data;
    
    if (!isMoving || currentIndex === -1) {
      return;
    }
    
    // 根据滑动距离决定最终状态
    let finalX = 0;
    if (touchMoveX < -50) {
      // 滑动距离超过50px，显示删除按钮
      finalX = -150;
    }
    
    // 更新最终位置
    this.setData({
      [`cartItems[${currentIndex}].x`]: finalX,
      isMoving: false,
      currentIndex: -1,
      touchMoveX: 0
    });
  },

  // 重置滑动状态
  resetSlide(e) {
    const { index } = e.currentTarget.dataset;
    
    // 如果正在滑动，不处理点击事件
    if (this.data.isMoving) {
      return;
    }
    
    // 重置当前项的滑动状态
    this.setData({
      [`cartItems[${index}].x`]: 0
    });
  },

  // 鼠标按下事件（开发者工具支持）
  handleMouseDown(e) {
    const { index } = e.currentTarget.dataset;
    
    this.setData({
      mouseDown: true,
      mouseStartX: e.detail.x,
      currentIndex: index,
      isMoving: false
    });
    
    // 重置其他项的滑动状态
    const { cartItems } = this.data;
    cartItems.forEach((item, i) => {
      if (i !== index) {
        item.x = 0;
      }
    });
    this.setData({ cartItems });
  },

  // 鼠标移动事件（开发者工具支持）
  handleMouseMove(e) {
    const { mouseDown, mouseStartX, currentIndex } = this.data;
    
    if (!mouseDown || currentIndex === -1) {
      return;
    }
    
    const moveX = e.detail.x - mouseStartX;
    
    if (Math.abs(moveX) > 10) {
      this.setData({
        isMoving: true,
        touchMoveX: moveX
      });
      
      // 限制滑动范围
      let translateX = 0;
      if (moveX < 0) {
        translateX = Math.max(moveX, -150);
      } else {
        translateX = Math.min(moveX, 0);
      }
      
      this.setData({
        [`cartItems[${currentIndex}].x`]: translateX
      });
    }
  },

  // 鼠标抬起事件（开发者工具支持）
  handleMouseUp(e) {
    this.handleMouseEnd();
  },

  // 鼠标离开事件（开发者工具支持）
  handleMouseLeave(e) {
    this.handleMouseEnd();
  },

  // 鼠标结束事件处理
  handleMouseEnd() {
    const { mouseDown, touchMoveX, currentIndex, isMoving } = this.data;
    
    if (!mouseDown || !isMoving || currentIndex === -1) {
      this.setData({
        mouseDown: false,
        isMoving: false,
        currentIndex: -1,
        touchMoveX: 0
      });
      return;
    }
    
    // 根据滑动距离决定最终状态
    let finalX = 0;
    if (touchMoveX < -50) {
      finalX = -150;
    }
    
    this.setData({
      [`cartItems[${currentIndex}].x`]: finalX,
      mouseDown: false,
      isMoving: false,
      currentIndex: -1,
      touchMoveX: 0
    });
  },

  // 处理movable-view的滑动变化
  handleMovableChange(e) {
    const { index } = e.currentTarget.dataset;
    const { x } = e.detail;
    
    // 限制滑动范围
    let finalX = 0;
    if (x < -50) {
      finalX = -150; // 显示删除按钮
    } else if (x > -50) {
      finalX = 0; // 隐藏删除按钮
    }
    
    // 更新当前项的位置
    this.setData({
      [`cartItems[${index}].x`]: finalX
    });
  },
};

// 使用createPage包装页面配置
Page(createPage(pageConfig)); 
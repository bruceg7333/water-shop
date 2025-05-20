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
    i18n: {} // 国际化文本
  },

  onLoad() {
    // 初始化国际化文本
    this.updateI18nText();
    this.loadCartData();
    
    // 设置页面标题
    wx.setNavigationBarTitle({
      title: this.t('page.cart')
    });
  },

  /**
   * 更新页面国际化文本
   */
  updateI18nText() {
    this.setData({
      i18n: {
        // 页面标题
        title: this.t('page.cart'),
        
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
    // 检查用户是否已登录
    if (!checkLogin({
      redirectOnFail: true,
      showToast: false // 不显示提示，直接跳转
    })) {
      return; // 未登录，已跳转到登录页
    }
    
    // 用户已登录，继续加载数据
    this.loadCartData();
  },

  // 加载购物车数据
  loadCartData() {
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

  // 处理左滑事件
  handleMovableChange(e) {
    const { index } = e.currentTarget.dataset;
    const { x } = e.detail;
    
    // 记录当前滑动的位置，但不触发界面更新
    if(!this.data.cartItems[index]) return;
    this.data.cartItems[index].x = x;
  },
  
  // 处理滑动结束事件
  handleTouchEnd(e) {
    const { index } = e.currentTarget.dataset;
    const { cartItems } = this.data;
    const x = cartItems[index].x || 0;
    
    // 如果滑动距离超过一定阈值，固定显示删除按钮
    if (x < -50) {
      cartItems[index].x = -150; // 显示删除按钮的宽度
    } else {
      cartItems[index].x = 0; // 复位
    }
    
    this.setData({
      [`cartItems[${index}].x`]: cartItems[index].x
    });
  },

  // 重置滑动状态
  resetSlide(e) {
    const { index } = e.currentTarget.dataset;
    // 阻止事件冒泡
    e.stopPropagation();
    
    // 重置当前项的滑动状态
    this.setData({
      [`cartItems[${index}].x`]: 0
    });
  }
};

// 使用createPage包装页面配置
Page(createPage(pageConfig)); 
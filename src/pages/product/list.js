// 引入必要的模块
const i18n = require('../../utils/i18n/index');
const { createPage } = require('../../utils/page-base');
const { api } = require('../../utils/request');

// 定义页面配置
const pageConfig = {
  data: {
    productList: [],
    activeCategory: 'all',
    categories: [],
    sortOptions: [],
    activeSort: 'default',
    filteredProducts: [],
    isLoading: true,
    i18n: {}, // 国际化文本
    page: 1, // 当前页码
    limit: 10, // 每页数量
    hasMore: true, // 是否有更多数据
    loadingMore: false, // 是否正在加载更多
    cartItemCount: 0, // 购物车商品数量
    viewMode: 'grid' // 视图模式：grid(网格) / list(列表)
  },
  
  /**
   * 更新国际化文本
   */
  updateI18nText() {
    // 更新页面的国际化文本
    const i18nText = {
      title: this.t('page.products'),
      empty: this.t('product.list.empty'),
      addToCart: this.t('product.detail.addToCart'),
      addedToCart: this.t('product.list.addedToCart'),
      buyNow: this.t('product.list.buyNow'),
      currencySymbol: this.t('common.unit.yuan'),
      soldPrefix: this.t('product.list.soldPrefix'),
      soldSuffix: this.t('product.list.soldSuffix'),
      loading: this.t('common.loading'),
      loadMore: this.t('common.loadMore'),
      noMoreData: this.t('common.noMoreData'),
      tagHot: this.t('product.list.tag.hot'),
      tagNew: this.t('product.list.tag.new'),
      tagDiscount: this.t('product.list.tag.discount')
    };
    
    // 分类和排序选项
    const categories = [
      {
        "id": "初音未来",
        "name": "初音未来"
      },
      {
        "id": "第五人格",
        "name": "第五人格"
      },
      {
        "id": "进击的巨人",
        "name": "进击的巨人"
      },
      {
        "id": "蓝色监狱",
        "name": "蓝色监狱"
      },
      {
        "id": "名侦探柯南",
        "name": "名侦探柯南"
      },
      {
        "id": "排球少年",
        "name": "排球少年"
      },
      {
        "id": "新世纪福音战士",
        "name": "新世纪福音战士"
      },
      {
        "id": "喜羊羊与灰太狼",
        "name": "喜羊羊与灰太狼"
      },
      {
        "id": "阴阳师×初音未来",
        "name": "阴阳师×初音未来"
      }
    ]
    
    const sortOptions = [
      { id: 'default', name: this.t('product.list.sort.default') },
      { id: 'sales', name: this.t('product.list.sort.sales') },
      { id: 'price-asc', name: this.t('product.list.sort.priceAsc') },
      { id: 'price-desc', name: this.t('product.list.sort.priceDesc') }
    ];
    
    this.setData({
      i18n: i18nText,
      categories,
      sortOptions
    });
  },
  
  onLoad: function(options) {
    // 更新导航栏标题
    wx.setNavigationBarTitle({
      title: this.t('page.products')
    });
    
    // 初始化国际化文本
    this.updateI18nText();
    
    // 从本地存储加载用户的视图模式偏好
    const savedViewMode = wx.getStorageSync('productViewMode');
    if (savedViewMode && (savedViewMode === 'grid' || savedViewMode === 'list')) {
      this.setData({
        viewMode: savedViewMode
      });
    }
    
    // 如果有查询参数，可以处理
    if (options && options.category) {
      this.setData({
        activeCategory: options.category
      });
    }
    
    // 加载商品数据
    this.loadProducts();
  },
  
  onShow: function() {
    // 更新购物车数量
    this.updateCartCount();
  },
  
  // 从API加载商品数据
  loadProducts: function(loadMore = false) {
    // 如果是加载更多，且没有更多数据，则直接返回
    if (loadMore && !this.data.hasMore) {
      return;
    }
    
    // 设置加载状态
    if (loadMore) {
      this.setData({ loadingMore: true });
    } else {
      this.setData({ 
        isLoading: true,
        page: 1, // 重置页码
        filteredProducts: [] // 清空现有数据
      });
    }
    
    // 构建API查询参数
    const params = {
      page: loadMore ? this.data.page : 1,
      limit: this.data.limit
    };
    
    if (this.data.activeCategory !== 'all') {
      params.category = this.data.activeCategory;
    }
    
    // 根据排序选项设置排序参数
    if (this.data.activeSort === 'sales') {
      params.sort = 'sales';
    } else if (this.data.activeSort === 'price-asc') {
      params.sort = 'price_asc';
    } else if (this.data.activeSort === 'price-desc') {
      params.sort = 'price_desc';
    }
    
    // 添加调试日志
    console.log('请求商品参数:', params);
    
    // 调用商品API获取数据
    api.product.getList(params)
      .then(res => {
        // 打印API返回结果
        console.log('商品API返回:', res);
        
        if (res.success && res.data) {
          // 直接从返回结构中获取products数组
          let products = res.data.products || [];
          const total = res.data.total || 0;
          console.log('商品数据:', products);
          
          // 处理每个商品，确保有有效的ID
          products = products.map(p => {
            // 确保有id字段，优先使用_id，然后是id
            const productId = p._id || p.id;
            
            // MongoDB ObjectId可能是对象，需要转为字符串
            let finalId = productId;
            if (productId && typeof productId === 'object' && productId.toString) {
              finalId = productId.toString();
            }
            
            // 日志记录商品ID
            console.log(`商品ID处理: 原始=${JSON.stringify(productId)}, 最终=${finalId}`);
            
            // 国际化商品标签
            let displayTagText = p.tag; // 默认使用数据库原始值
            if (p.tag === '热销') {
              // 如果翻译的标签不是key本身，则使用翻译后的值，否则使用原始值
              displayTagText = (this.data.i18n.tagHot && this.data.i18n.tagHot !== 'product.list.tag.hot') ? this.data.i18n.tagHot : p.tag;
            } else if (p.tag === '新品') {
              displayTagText = (this.data.i18n.tagNew && this.data.i18n.tagNew !== 'product.list.tag.new') ? this.data.i18n.tagNew : p.tag;
            } else if (p.tag === '优惠') {
              displayTagText = (this.data.i18n.tagDiscount && this.data.i18n.tagDiscount !== 'product.list.tag.discount') ? this.data.i18n.tagDiscount : p.tag;
            }
            
            return { 
              ...p, 
              id: finalId,  // 使用处理后的ID
              _id: finalId, // 保留_id字段
              displayTag: displayTagText 
            };
          });
          
          // 计算是否还有更多数据
          const hasMore = products.length > 0 && 
            (loadMore ? this.data.filteredProducts.length + products.length : products.length) < total;
          
          // 如果是加载更多，则追加数据，否则替换数据
          const newProductList = loadMore ? 
            [...this.data.filteredProducts, ...products] : 
            products;
          
          this.setData({
            productList: newProductList,
            filteredProducts: newProductList,
            isLoading: false,
            loadingMore: false,
            hasMore: hasMore,
            page: loadMore ? this.data.page + 1 : 2 // 更新页码
          });
          
          // 商品为空时提示
          if (newProductList.length === 0) {
            wx.showToast({
              title: this.data.i18n.empty,
              icon: 'none',
              duration: 2000
            });
          }
        } else {
          console.error('获取商品列表失败:', res);
          this.setData({ 
            isLoading: false,
            loadingMore: false
          });
          wx.showToast({
            title: res.message || this.t('common.error'),
            icon: 'none',
            duration: 2000
          });
          // 加载失败时使用本地演示数据
          if (!loadMore) {
            this.loadDemoProducts();
          }
        }
      })
      .catch(err => {
        console.error('获取商品列表出错:', err);
        this.setData({ 
          isLoading: false,
          loadingMore: false
        });
        wx.showToast({
          title: this.t('common.networkError') || '网络错误',
          icon: 'none',
          duration: 2000
        });
        // 加载失败时使用本地演示数据
        if (!loadMore) {
          this.loadDemoProducts();
        }
      });
  },
  
  // 加载更多商品
  loadMoreProducts: function() {
    if (!this.data.loadingMore && this.data.hasMore) {
      this.loadProducts(true);
    }
  },
  
  // 页面上拉触底事件处理函数
  onReachBottom: function() {
    this.loadMoreProducts();
  },
  
  // 下拉刷新事件
  onPullDownRefresh: function() {
    this.loadProducts();
    wx.stopPullDownRefresh();
  },
  
  // 加载演示商品数据（仅在API调用失败时使用）
  loadDemoProducts: function() {
    console.log('加载演示商品数据');
    
    const demoProductsRaw = [
      {
        id: "1",  // 使用字符串类型ID
        name: 'SPRINKLE 纯净水',
        description: '来自高山冰川，纯净甘甜',
        price: 2.00,
        imageUrl: '/assets/images/products/sprinkle.png',
        sales: 1000,
        stock: 100,
        tag: '热销' // 数据库原始标签
      },
      {
        id: "2",  // 使用字符串类型ID
        name: 'SPRINKLE 矿泉水',
        description: '富含矿物质，健康饮用水选择',
        price: 2.50,
        imageUrl: '/assets/images/products/sprinkle.png',
        sales: 800,
        stock: 100,
        tag: '优惠' // 数据库原始标签
      },
      {
        id: 3,
        name: 'SPRINKLE 山泉水',
        description: '大容量家庭装，经济实惠',
        price: 3.00,
        imageUrl: '/assets/images/products/sprinkle.png',
        sales: 600,
        stock: 100,
        tag: '新品' // 数据库原始标签
      },
      {
        id: 4,
        name: 'SPRINKLE 苏打水',
        description: '天然矿物质，口感清爽',
        price: 3.50,
        imageUrl: '/assets/images/products/sprinkle.png',
        sales: 500,
        stock: 100
      },
      {
        id: 5,
        name: 'SPRINKLE 饮用纯净水',
        description: '适合婴幼儿饮用，纯净无添加',
        price: 4.00,
        imageUrl: '/assets/images/products/sprinkle.png',
        sales: 300,
        stock: 100,
        tag: '热销'
      },
      {
        id: 6,
        name: 'SPRINKLE 天然矿泉水',
        description: '源自天然矿泉，富含矿物质',
        price: 4.50,
        imageUrl: '/assets/images/products/sprinkle.png',
        sales: 200,
        stock: 100
      }
    ];
    
    // 对演示数据也进行标签国际化处理
    const demoProducts = demoProductsRaw.map(p => {
      let displayTagText = p.tag;
      if (p.tag === '热销') {
        displayTagText = (this.data.i18n.tagHot && this.data.i18n.tagHot !== 'product.list.tag.hot') ? this.data.i18n.tagHot : p.tag;
      } else if (p.tag === '新品') {
        displayTagText = (this.data.i18n.tagNew && this.data.i18n.tagNew !== 'product.list.tag.new') ? this.data.i18n.tagNew : p.tag;
      } else if (p.tag === '优惠') {
        displayTagText = (this.data.i18n.tagDiscount && this.data.i18n.tagDiscount !== 'product.list.tag.discount') ? this.data.i18n.tagDiscount : p.tag;
      }
      return { ...p, displayTag: displayTagText };
    });
    
    this.setData({
      productList: demoProducts,
      filteredProducts: demoProducts,
      isLoading: false
    });
  },
  
  // 切换分类
  switchCategory: function(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      activeCategory: category,
      page: 1, // 重置页码
      hasMore: true // 重置加载更多状态
    });
    
    // 重新加载商品
    this.loadProducts();
  },
  
  // 切换排序
  switchSort: function(e) {
    const sort = e.currentTarget.dataset.sort;
    this.setData({
      activeSort: sort,
      page: 1, // 重置页码
      hasMore: true // 重置加载更多状态
    });
    
    // 重新加载商品
    this.loadProducts();
  },
  
  // 查看商品详情
  viewProductDetail: function(e) {
    const id = e.currentTarget.dataset.id;
    
    console.log('查看商品详情，原始ID:', id);
    
    // 确保ID不为undefined
    if (!id) {
      console.error('无效的商品ID:', id);
      wx.showToast({
        title: '无效的商品ID',
        icon: 'none'
      });
      return;
    }
    
    // 从商品列表中找到对应的商品
    const product = this.data.filteredProducts.find(p => 
      p.id && (p.id.toString() === id.toString() || 
      (p._id && p._id.toString() === id.toString()))
    );
    
    if (!product) {
      console.error('找不到对应ID的商品:', id);
      wx.showToast({
        title: '商品不存在',
        icon: 'none'
      });
      return;
    }
    
    // 获取MongoDB _id或普通id
    const productId = product._id || product.id;
    
    console.log('跳转到商品详情页，处理后ID:', productId);
    
    wx.navigateTo({
      url: `/pages/product/detail?id=${productId}`
    });
  },
  
  // 更新购物车数量
  updateCartCount: function() {
    api.getCartCount()
      .then(res => {
        if (res.success && typeof res.data === 'number') {
          this.setData({
            cartItemCount: res.data
          });
        }
      })
      .catch(err => {
        console.error('获取购物车数量失败:', err);
        // 设置默认值
        this.setData({
          cartItemCount: 0
        });
      });
  },
  
  // 前往购物车
  goToCart: function() {
    wx.navigateTo({
      url: '/pages/cart/index'
    });
  },
  
  // 添加到购物车
  addToCart: function(e) {
    const id = e.currentTarget.dataset.id;
    const product = this.data.filteredProducts.find(item => 
      item.id && (item.id.toString() === id.toString() || 
      (item._id && item._id.toString() === id.toString()))
    );
    
    if (!product) {
      wx.showToast({
        title: this.t('common.error') || '商品不存在',
        icon: 'none'
      });
      return;
    }
    
    // 检查登录状态
    const isLoggedIn = wx.getStorageSync('isLoggedIn');
    
    if (!isLoggedIn) {
      
      // 根据当前语言获取固定的短文本，确保符合微信4字符限制
      const currentLang = wx.getStorageSync('language') || 'zh_CN';
      let tipTitle, loginRequired, toLogin, cancel;
      
      if (currentLang === 'en') {
        tipTitle = 'Tip';
        loginRequired = 'You need to login first to use this feature';
        toLogin = 'Go';
        cancel = 'No';
      } else if (currentLang === 'th') {
        tipTitle = 'แจ้ง';
        loginRequired = 'คุณต้องเข้าสู่ระบบก่อนใช้งานคุณสมบัตินี้';
        toLogin = 'เข้า';
        cancel = 'ไม่';
      } else if (currentLang === 'zh_TW') {
        tipTitle = '提示';
        loginRequired = '您需要登錄後才能使用此功能';
        toLogin = '登錄';
        cancel = '取消';
      } else {
        // 默认中文简体
        tipTitle = '提示';
        loginRequired = '您需要登录后才能使用此功能';
        toLogin = '登录';
        cancel = '取消';
      }
      
              wx.showModal({
        title: tipTitle,
        content: loginRequired,
        confirmText: toLogin,
        cancelText: cancel,
        success: (res) => {
          console.log('商品列表页模态框响应:', res);
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/member/login'
            });
          }
        },
        fail: (err) => {
          console.error('商品列表页显示模态框失败:', err);
        }
      });
      return;
    }
    
    console.log('商品列表页用户已登录，继续添加购物车流程');
    
    // 添加到购物车API
    api.addToCart({
      productId: product._id || product.id,
      quantity: 1
    }).then(res => {
      if (res.success) {
        wx.showToast({
          title: this.data.i18n.addedToCart,
          icon: 'success'
        });
        // 更新购物车数量
        this.updateCartCount();
      } else {
        wx.showToast({
          title: res.message || this.t('common.error'),
          icon: 'none'
        });
      }
    }).catch(err => {
      console.error('添加到购物车失败:', err);
      // 如果是认证错误，request.js会自动处理
      // 这里不需要再次处理
    });
  },

  // 立即购买
  buyNow: function(e) {
    const id = e.currentTarget.dataset.id;
    const product = this.data.filteredProducts.find(item => 
      item.id && (item.id.toString() === id.toString() || 
      (item._id && item._id.toString() === id.toString()))
    );
    
    if (!product) {
      wx.showToast({
        title: this.t('common.error'),
        icon: 'none'
      });
      return;
    }
    
    // 检查登录状态
    const isLoggedIn = wx.getStorageSync('isLoggedIn');
    
    if (!isLoggedIn) {
      
      // 根据当前语言获取固定的短文本，确保符合微信4字符限制
      const currentLang = wx.getStorageSync('language') || 'zh_CN';
      let tipTitle, loginRequired, toLogin, cancel;
      
      if (currentLang === 'en') {
        tipTitle = 'Tip';
        loginRequired = 'You need to login first to buy products';
        toLogin = 'Go';
        cancel = 'No';
      } else if (currentLang === 'th') {
        tipTitle = 'แจ้ง';
        loginRequired = 'คุณต้องเข้าสู่ระบบก่อนซื้อสินค้า';
        toLogin = 'เข้า';
        cancel = 'ไม่';
      } else if (currentLang === 'zh_TW') {
        tipTitle = '提示';
        loginRequired = '您需要登錄後才能購買商品';
        toLogin = '登錄';
        cancel = '取消';
      } else {
        // 默认中文简体
        tipTitle = '提示';
        loginRequired = '您需要登录后才能购买商品';
        toLogin = '登录';
        cancel = '取消';
      }
      
              wx.showModal({
        title: tipTitle,
        content: loginRequired,
        confirmText: toLogin,
        cancelText: cancel,
        success: (res) => {
          console.log('商品列表页buyNow模态框响应:', res);
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/member/login'
            });
          }
        },
        fail: (err) => {
          console.error('商品列表页buyNow显示模态框失败:', err);
        }
      });
      return;
    }
    
    console.log('商品列表页buyNow用户已登录，继续购买流程');
    
    // 设置结算商品信息到缓存，供订单确认页使用
    const checkoutItem = {
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      count: 1,  // 注意这里是count而不是quantity
      spec: product.spec || ''
    };
    
    // 保存到checkoutItems缓存
    wx.setStorageSync('checkoutItems', {
      items: [checkoutItem],
      totalPrice: product.price.toFixed(2),
      fromDirect: true // 标记为直接购买，而非购物车结算
    });
    
    // 直接跳转到结算页面
    wx.navigateTo({
      url: '/pages/order/confirm?direct=true'
    });
  },

  // 切换视图模式
  switchViewMode: function(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({
      viewMode: mode
    });
    
    // 可以保存用户偏好到本地存储
    wx.setStorageSync('productViewMode', mode);
    
    // 提示用户模式已切换
    const modeText = mode === 'grid' ? '网格模式' : '列表模式';
    wx.showToast({
      title: `已切换到${modeText}`,
      icon: 'none',
      duration: 1000
    });
  }
};

// 使用createPage包装页面配置
Page(createPage(pageConfig));
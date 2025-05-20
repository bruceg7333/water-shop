const { api } = require('../../utils/request');
const i18n = require('../../utils/i18n/index');
const { createPage } = require('../../utils/page-base');

// 定义页面配置
const pageConfig = {
  data: {
    bannerList: [
      {
        id: 1,
        imageUrl: '/assets/images/banner/banner1.jpg',
        title: 'SPRINKLE 纯净水',
        subtitle: '来自大自然的纯净馈赠',
        linkUrl: 'pages/product/detail?id=1'
      },
      {
        id: 2,
        imageUrl: '/assets/images/banner/banner2.jpg',
        title: 'SPRINKLE 纯净水',
        subtitle: '富含天然矿物质',
        linkUrl: 'pages/product/detail?id=2'
      },
      {
        id: 3,
        imageUrl: '/assets/images/banner/banner3.jpg',
        title: '健康饮水',
        subtitle: '每日8杯水，健康每一天',
        linkUrl: '/pages/article/detail?id=1'
      }
    ],
    productList: [], // 改为空数组，通过API获取
    brandInfo: {
      title: '品牌故事',
      content: 'SPRINKLE 的水源来自海拔3800米的高山冰川，经过18层过滤和严格的质量控制，为您提供最纯净、健康的饮用水。20年专注饮用水研发，只为您的健康饮水体验。',
      tags: ['0添加', '18层过滤', '天然矿物质', '低钠', '适合婴幼儿']
    },
    articles: [
      {
        id: 1,
        title: '每天应该喝多少水？科学饮水指南',
        imageUrl: '/assets/images/articles/article1.jpg',
        views: 1254,
        shares: 328,
        tag: '饮水健康'
      },
      {
        id: 2,
        title: '不同类型饮用水的区别与选择',
        imageUrl: '/assets/images/articles/article2.jpg',
        views: 986,
        shares: 215,
        tag: '水质知识'
      },
      {
        id: 3,
        title: '饮水与健康：关于水的几个误区',
        imageUrl: '/assets/images/articles/article3.jpg',
        views: 750,
        shares: 186,
        tag: '健康提示'
      }
    ],
    promotions: {
      title: '限时优惠',
      description: '新客首单立减5元',
      color: 'linear-gradient(135deg, #0088cc, #00c6ff)'
    },
    searchValue: '',
    takeWayOptions: [
      { 
        id: 0, 
        name: '外卖', 
        icon: 'delivery' 
      },
      { 
        id: 1, 
        name: '自取', 
        icon: 'self-pickup' 
      }
    ],
    loading: false, // 加载状态
    error: null, // 错误信息
    
    // 国际化字段
    i18n: {},
    showLanguageSelector: false, // 是否显示语言选择器
    languages: i18n.getSupportedLanguages(), // 支持的语言列表
    currentLanguage: i18n.getCurrentLang(), // 当前语言
    currentLanguageName: '' // 当前语言名称
  },

  /**
   * 更新页面国际化文本
   */
  updateI18nText() {
    // 更新首页上的所有国际化文本
    const bannerList = [
      {
        id: 1,
        imageUrl: '/assets/images/banner/banner1.jpg',
        title: this.t('home.banner.title1'),
        subtitle: this.t('home.banner.subtitle1'),
        linkUrl: 'pages/product/detail?id=1'
      },
      {
        id: 2,
        imageUrl: '/assets/images/banner/banner2.jpg',
        title: this.t('home.banner.title2'),
        subtitle: this.t('home.banner.subtitle2'),
        linkUrl: 'pages/product/detail?id=2'
      },
      {
        id: 3,
        imageUrl: '/assets/images/banner/banner3.jpg',
        title: this.t('home.banner.title3'),
        subtitle: this.t('home.banner.subtitle3'),
        linkUrl: '/pages/article/detail?id=1'
      }
    ];
    
    // 确保brandInfo.tags是数组
    let brandTags = this.t('home.brand.tags');
    if (!Array.isArray(brandTags)) {
      try {
        if (typeof brandTags === 'string' && brandTags.trim().startsWith('[')) {
          brandTags = JSON.parse(brandTags);
        } else {
          // 使用独立的标签数据（保证一定能获取到标签）
          brandTags = [
            this.t('home.brand.tag1'), 
            this.t('home.brand.tag2'), 
            this.t('home.brand.tag3'), 
            this.t('home.brand.tag4'), 
            this.t('home.brand.tag5')
          ];
        }
      } catch (e) {
        console.error('解析品牌标签失败:', e);
        // 使用独立的标签数据作为后备
        brandTags = [
          this.t('home.brand.tag1'), 
          this.t('home.brand.tag2'), 
          this.t('home.brand.tag3'), 
          this.t('home.brand.tag4'), 
          this.t('home.brand.tag5')
        ];
      }
    }
    
    const promotions = {
      title: this.t('home.promotion.title'),
      description: this.t('home.promotion.description'),
      color: 'linear-gradient(135deg, #0088cc, #00c6ff)'
    };
    
    // 更新取餐方式文本
    const takeWayOptions = [
      { 
        id: 0, 
        name: this.t('home.takeWay.delivery') || '外卖', 
        icon: 'delivery' 
      },
      { 
        id: 1, 
        name: this.t('home.takeWay.selfPickup') || '自取', 
        icon: 'self-pickup' 
      }
    ];
    
    // 获取当前语言的显示名称
    const currentLangCode = i18n.getCurrentLang();
    const languages = i18n.getSupportedLanguages();
    const currentLangObj = languages.find(lang => lang.code === currentLangCode) || { code: currentLangCode, name: currentLangCode };
    
    // 设置国际化文本
    this.setData({
      bannerList,
      promotions,
      takeWayOptions,
      currentLanguage: currentLangCode,
      currentLanguageName: currentLangObj.name,
      languages,
      i18n: {
        // 搜索栏
        searchPlaceholder: this.t('home.search.placeholder'),
        
        // 导航区
        navAllProducts: this.t('home.nav.allProducts'),
        navWaterKnowledge: this.t('home.nav.waterKnowledge'),
        navPromotions: this.t('home.nav.promotions'),
        navNewUserGift: this.t('home.nav.newUserGift'),
        
        // 区域标题
        hotProducts: this.t('home.section.hotProducts'),
        waterScience: this.t('home.section.waterScience'),
        brandStory: this.t('home.section.brandStory'),
        
        // 品牌故事
        brandTitle: this.t('home.brand.title'),
        brandContent: this.t('home.brand.content'),
        brandTags: brandTags,
        tag1: this.t('home.brand.tag1'),
        tag2: this.t('home.brand.tag2'),
        tag3: this.t('home.brand.tag3'),
        tag4: this.t('home.brand.tag4'),
        tag5: this.t('home.brand.tag5'),
        
        // 文章标签
        readsFormat: this.t('home.article.reads'),
        sharesFormat: this.t('home.article.shares'),
        viewsLabel: this.t('articleList.viewsLabel') || '阅读',
        articleDateLabel: this.t('articleList.dateLabel') || '发布日期',
        
        // 商品标签
        tagHot: this.t('home.product.tag.hot'),
        tagNew: this.t('home.product.tag.new'),
        tagDiscount: this.t('home.product.tag.discount'),
        
        // 查看更多
        viewAll: this.t('common.viewAll'),
        buy: this.t('home.product.buy'),
        soldFormat: this.t('home.product.sold'),
        
        // 状态提示
        loading: this.t('common.loading'),
        empty: this.t('common.empty'),
        retry: this.t('common.retry'),
        
        // 语言
        langSwitch: this.t('home.language.switch'),
        currentLang: this.t('home.language.current'),
        
        // 促销相关
        viewNow: this.t('home.promotion.action')
      }
    });
    
    // 更新商品列表中的标签为国际化文本
    if (this.data.productList && this.data.productList.length > 0) {
      const productList = this.data.productList.map(product => {
        // 创建一个新的商品对象
        const newProduct = { ...product };
        
        // 确定标签类型和国际化文本
        if (product.tag === '热销' || product.tag === 'hot') {
          newProduct.tagType = 'hot';
          newProduct.tag = this.t('home.product.tag.hot');
        } else if (product.tag === '新品' || product.tag === 'new') {
          newProduct.tagType = 'new';
          newProduct.tag = this.t('home.product.tag.new');
        } else if (product.tag === '优惠' || product.tag === 'discount') {
          newProduct.tagType = 'discount';
          newProduct.tag = this.t('home.product.tag.discount');
        }
        
        return newProduct;
      });
      
      this.setData({ productList });
    }

    // 更新文章列表中的标签为国际化文本
    if (this.data.articles && this.data.articles.length > 0) {
      const articles = this.data.articles.map(article => {
        // 创建一个新的文章对象
        const newArticle = { ...article };
        
        // 处理标签数据，最多保留1个标签
        let tags = [];
        if (article.tags && Array.isArray(article.tags) && article.tags.length > 0) {
          tags = article.tags.slice(0, 1); // 最多取1个标签
        } else if (article.tag) {
          tags = [article.tag]; // 如果只有单个tag字段，也转为数组
        }
        
        // 为每个标签应用国际化
        const translatedTags = tags.map(tag => {
          if (tag === '饮水健康' || tag === 'Water Health') {
            return this.t('home.article.tag.health');
          } else if (tag === '水质知识' || tag === 'Water Quality') {
            return this.t('home.article.tag.knowledge');
          } else if (tag === '健康提示' || tag === 'Health Tips') {
            return this.t('home.article.tag.tips');
          } else if (tag === '科普' || tag === 'Science') {
            return this.t('home.article.tag.science');
          } else if (tag === '研究' || tag === 'Research') {
            return this.t('home.article.tag.research');
          } else if (tag === '生活方式' || tag === 'Lifestyle') {
            return this.t('home.article.tag.lifestyle');
          }
          return tag;
        });
        
        return {
          id: article.id,
          title: article.title,
          imageUrl: article.imageUrl,
          views: article.views || 0,
          publishDate: this.formatDate(new Date(article.publishDate)),
          summary: article.summary || article.content?.substring(0, 50) || '',
          tags: translatedTags
        };
      });
      
      this.setData({ articles });
    }
  },

  onLoad() {
    // 初始化品牌信息
    this.setData({
      brandInfo: {
        title: '品牌故事',
        content: 'SPRINKLE 的水源来自海拔3800米的高山冰川，经过18层过滤和严格的质量控制，为您提供最纯净、健康的饮用水。20年专注饮用水研发，只为您的健康饮水体验。',
        tags: ['0添加', '18层过滤', '天然矿物质', '低钠', '适合婴幼儿']
      }
    });
    
    // 更新国际化文本
    this.updateI18nText();
    
    // 获取商品列表
    this.fetchProducts();
    
    // 获取热门文章
    this.fetchArticles();
  },

  // 显示语言选择器
  showLanguageMenu() {
    this.setData({
      showLanguageSelector: true
    });
  },
  
  // 隐藏语言选择器
  hideLanguageMenu() {
    this.setData({
      showLanguageSelector: false
    });
  },
  
  // 切换语言
  changeLanguage(e) {
    const { lang } = e.currentTarget.dataset;
    if (!lang || lang === this.data.currentLanguage) {
      this.hideLanguageMenu();
      return;
    }
    
    // 使用page-base中的switchLanguage方法切换语言
    this.switchLanguage(lang);
    
    // 隐藏菜单
    this.hideLanguageMenu();
  },

  // 获取商品数据
  fetchProducts() {
    this.setData({ loading: true, error: null });
    
    // 调用热销商品API，只获取销量前3的商品
    api.product.getHotProducts()
      .then(res => {
        if (res.success && res.data) {
          // API返回的数据结构转换为前端需要的结构
          const products = res.data.map(item => {
            let tag = item.tag || '';
            
            // 将服务器返回的标签转换为国际化文本
            if (tag === '热销' || tag === 'hot') {
              tag = this.t('home.product.tag.hot');
            } else if (tag === '新品' || tag === 'new') {
              tag = this.t('home.product.tag.new');
            } else if (tag === '优惠' || tag === 'discount') {
              tag = this.t('home.product.tag.discount');
            }
            
            return {
              id: item._id, // 使用MongoDB的_id作为商品ID
              name: item.name,
              description: item.description,
              price: item.price,
              imageUrl: item.imageUrl,
              sales: item.sales,
              stock: item.stock,
              tag: tag // 使用国际化后的标签
            };
          });
          
          this.setData({
            productList: products,
            loading: false
          });
        } else {
          this.setData({
            error: this.t('common.error'),
            loading: false
          });
        }
      })
      .catch(err => {
        console.error('获取热销商品出错:', err);
        this.setData({
          error: this.t('common.error'),
          loading: false,
          // 使用静态数据作为备用
          productList: [
            {
              id: 1,
              name: 'SPRINKLE 纯净水',
              description: '来自高山冰川，纯净甘甜',
              price: 2.00,
              imageUrl: '/assets/images/products/sprinkle.png',
              sales: 1000,
              stock: 100,
              tag: this.t('home.product.tag.hot')
            },
            {
              id: 2,
              name: 'SPRINKLE 纯净水',
              description: '富含矿物质，健康饮用水选择',
              price: 2.00,
              imageUrl: '/assets/images/products/sprinkle.png',
              sales: 800,
              stock: 100,
              tag: this.t('home.product.tag.discount')
            }
          ]
        });
      });
  },

  // 搜索框输入事件
  onSearchInput(e) {
    this.setData({
      searchValue: e.detail.value
    });
  },

  // 搜索框确认事件
  onSearchConfirm() {
    // 根据搜索内容跳转到对应的商品或商品列表页
    wx.navigateTo({
      url: `/pages/product/search?keyword=${this.data.searchValue}`
    });
  },

  // 轮播图点击事件
  onBannerTap(e) {
    const { id } = e.currentTarget.dataset;
    const banner = this.data.bannerList.find(item => item.id === id);
    if (banner && banner.linkUrl) {
      wx.navigateTo({
        url: `/${banner.linkUrl}`
      });
    }
  },

  // 商品点击事件
  onProductTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/product/detail?id=${id}`
    });
  },

  // 取餐方式点击事件
  onTakeWayTap(e) {
    const { id } = e.currentTarget.dataset;
    // 跳转到菜单页面并传递取餐方式参数
    wx.switchTab({
      url: '/pages/cart/index',
      success: () => {
        // 将取餐方式保存到全局变量，供其他页面使用
        getApp().globalData.takeWayIndex = id;
      }
    });
  },

  // 立即购买
  onBuyNow(e) {
    const { id } = e.currentTarget.dataset;
    const product = this.data.productList.find(item => item.id === id);
    
    if (!product) {
      wx.showToast({
        title: this.t('common.error'),
        icon: 'none'
      });
      return;
    }
    
    // 设置结算商品信息到缓存，供订单确认页使用
    const checkoutItem = {
      id: product.id,
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

  // 文章点击事件
  onArticleTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/article/detail?id=${id}`
    });
  },

  // 查看全部商品
  viewAllProducts() {
    wx.navigateTo({
      url: '/pages/product/list'
    });
  },

  // 查看全部文章
  viewAllArticles() {
    wx.navigateTo({
      url: '/pages/article/list'
    });
  },

  // 点击促销活动
  onPromotionTap() {
    wx.navigateTo({
      url: '/pages/promotion/index'
    });
  },

  // 点击新人礼包
  onNewUserGiftTap() {
    wx.navigateTo({
      url: '/pages/promotion/new-user'
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    // 刷新商品数据
    this.fetchProducts().finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  // 获取热门文章
  fetchArticles() {
    // 调用API获取热门文章
    api.article.getHotArticles(3)
      .then(res => {
        if (res.success && res.data && res.data.articles && res.data.articles.length > 0) {
          const articles = res.data.articles.map(article => {
            // 格式化日期，根据当前语言环境
            let formattedDate = '';
            if (article.publishDate) {
              formattedDate = this.formatDate(new Date(article.publishDate));
            } else if (article.createdAt) {
              formattedDate = this.formatDate(new Date(article.createdAt));
            } else {
              // 如果没有发布日期和创建日期，使用当前日期
              formattedDate = this.formatDate(new Date());
            }
            
            // 处理标签数据，最多保留1个标签
            let tags = [];
            if (article.tags && Array.isArray(article.tags) && article.tags.length > 0) {
              tags = article.tags.slice(0, 1); // 最多取1个标签
            } else if (article.tag) {
              tags = [article.tag]; // 如果只有单个tag字段，也转为数组
            }
            
            // 为每个标签应用国际化
            const translatedTags = tags.map(tag => {
              if (tag === '饮水健康' || tag === 'Water Health') {
                return this.t('home.article.tag.health');
              } else if (tag === '水质知识' || tag === 'Water Quality') {
                return this.t('home.article.tag.knowledge');
              } else if (tag === '健康提示' || tag === 'Health Tips') {
                return this.t('home.article.tag.tips');
              } else if (tag === '科普' || tag === 'Science') {
                return this.t('home.article.tag.science');
              } else if (tag === '研究' || tag === 'Research') {
                return this.t('home.article.tag.research');
              } else if (tag === '生活方式' || tag === 'Lifestyle') {
                return this.t('home.article.tag.lifestyle');
              }
              return tag;
            });
            
            // 构造前端需要的文章数据结构
            return {
              id: article.id,
              title: article.title,
              imageUrl: article.imageUrl,
              views: article.views || 0,
              publishDate: formattedDate,
              summary: article.summary || article.content?.substring(0, 50) || '',
              tags: translatedTags
            };
          });
          
          this.setData({ articles });
        } else {
          console.error('获取热门文章失败:', res);
          // 使用默认测试数据作为后备
          const today = new Date();
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          const twoDaysAgo = new Date(today);
          twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
          
          this.setData({
            articles: [
              {
                id: 1,
                title: '每天应该喝多少水？科学饮水指南',
                imageUrl: '/assets/images/articles/article1.jpg',
                views: 1254,
                publishDate: this.formatDate(today),
                summary: '适量饮水对健康至关重要，但每个人需要的水量有所不同...',
                tags: [this.t('home.article.tag.health')]
              },
              {
                id: 2,
                title: '不同类型饮用水的区别与选择',
                imageUrl: '/assets/images/articles/article2.jpg',
                views: 986,
                publishDate: this.formatDate(yesterday),
                summary: '市场上有多种类型的饮用水，包括纯净水、矿泉水和蒸馏水等...',
                tags: [this.t('home.article.tag.knowledge')]
              },
              {
                id: 3,
                title: '饮水与健康：关于水的几个误区',
                imageUrl: '/assets/images/articles/article3.jpg',
                views: 750,
                publishDate: this.formatDate(twoDaysAgo),
                summary: '关于饮水有很多常见误区，比如运动时不要喝水等...',
                tags: [this.t('home.article.tag.tips')]
              }
            ]
          });
        }
      })
      .catch(err => {
        console.error('获取热门文章出错:', err);
        // 使用默认测试数据作为后备
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const twoDaysAgo = new Date(today);
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        
        this.setData({
          articles: [
            {
              id: 1,
              title: '每天应该喝多少水？科学饮水指南',
              imageUrl: '/assets/images/articles/article1.jpg',
              views: 1254,
              publishDate: this.formatDate(today),
              summary: '适量饮水对健康至关重要，但每个人需要的水量有所不同...',
              tags: [this.t('home.article.tag.health')]
            },
            {
              id: 2,
              title: '不同类型饮用水的区别与选择',
              imageUrl: '/assets/images/articles/article2.jpg',
              views: 986,
              publishDate: this.formatDate(yesterday),
              summary: '市场上有多种类型的饮用水，包括纯净水、矿泉水和蒸馏水等...',
              tags: [this.t('home.article.tag.knowledge')]
            },
            {
              id: 3,
              title: '饮水与健康：关于水的几个误区',
              imageUrl: '/assets/images/articles/article3.jpg',
              views: 750,
              publishDate: this.formatDate(twoDaysAgo),
              summary: '关于饮水有很多常见误区，比如运动时不要喝水等...',
              tags: [this.t('home.article.tag.tips')]
            }
          ]
        });
      });
  },
  
  // 更新文章标签的国际化
  updateArticleTags() {
    // 整个函数可以删除，因为我们不再使用标签
  },
};

// 使用createPage包装页面配置
Page(createPage(pageConfig)); 
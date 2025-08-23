const { createPage } = require('../../utils/page-base');
const i18n = require('../../utils/i18n/index');
const { api } = require('../../utils/request');
const { checkLogin } = require('../../utils/auth');

// 定义页面配置
const pageConfig = {
  data: {
    product: {
    },
    selectedSpec: '',
    currentTab: 0,
    tabs: [],
    reviews: [], // 评论列表
    reviewTotal: 0, // 评论总数
    isFavorite: false, // 是否已收藏
    cartCount: 0, // 购物车商品数量
    i18n: {}
  },

  onLoad: function(options) {
    // 获取商品ID
    const id = options.id;
    console.log('商品ID:', id);

    // 初始化国际化文本
    this.updateI18nText();
    
    // 设置页面标题
    wx.setNavigationBarTitle({
      title: this.t('page.productDetail')
    });
    
    // 获取商品数据
    if (id && id !== 'undefined' && id !== 'null') {
      this.loadProductData(id);
      this.loadProductReviews(id);
      
      // 检查是否已收藏该商品
      this.checkIsFavorite(id);
    } else {
      // 如果没有ID，显示错误提示
      console.error('无效的商品ID:', id);
      wx.showToast({
        title: this.t('product.detail.error.invalidId') || '无效的商品ID',
        icon: 'none',
        duration: 2000
      });
      
      // 返回上一页
      setTimeout(() => {
        wx.navigateBack();
      }, 2000);
      
      // 设置空评论状态
      this.setData({
        reviews: [],
        reviewTotal: 0
      });
    }
    
    // 获取购物车数量
    this.getCartCount();
    
    // 注册语言变化事件监听，确保语言切换时正确刷新评论界面
    const app = getApp();
    if (app && app.globalData && app.globalData.eventBus) {
      app.globalData.eventBus.on('languageChanged', this.onLanguageChanged.bind(this));
    }
  },

  onShow: function() {
    // 优先使用全局角标更新方法，确保数据一致性
    const app = getApp();
    if (app && typeof app.updateCartBadge === 'function') {
      app.updateCartBadge().then(count => {
        console.log('商品详情页全局角标更新完成，数量:', count);
        // 同步更新本页面的购物车数量显示
        this.setData({
          cartCount: count
        });
      }).catch(err => {
        console.log('商品详情页全局角标更新失败:', err);
        // 失败时使用本地方法获取
        this.getCartCount();
      });
    } else {
      console.warn('全局updateCartBadge方法不存在，使用本地方法');
      // 如果全局方法不存在，使用本地方法
      this.getCartCount();
    }
  },

  onUnload: function() {
    // 取消注册事件监听，避免内存泄漏
    const app = getApp();
    if (app && app.globalData && app.globalData.eventBus) {
      app.globalData.eventBus.off('languageChanged', this.onLanguageChanged.bind(this));
    }
  },

  switchTab: function(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentTab: index
    });
  },

  selectSpec: function(e) {
    const spec = e.currentTarget.dataset.spec;
    this.setData({
      selectedSpec: spec
    });
  },

  addToCart: function() {
    // 检查是否已登录
    if (!checkLogin({ 
      redirectOnFail: true, 
      showToast: true,
      redirectUrl: `/pages/product/detail?id=${this.data.product.id}`
    })) {
      return;
    }
    
    const product = this.data.product;
    if (!product || !product.id) {
      wx.showToast({
        title: this.t('common.error'),
        icon: 'none'
      });
      return;
    }
    
    wx.showLoading({
      title: '添加中...',
      mask: true
    });
    
    // 使用API添加到购物车
    api.addToCart({
      productId: product.id,
      quantity: 1,
      spec: this.data.selectedSpec || '默认规格'
    })
      .then(res => {
        wx.hideLoading();
        if (res.success) {
          wx.showToast({
            title: this.t('product.detail.msg.addToCartSuccess'),
            icon: 'success'
          });
          
          // 更新本页面购物车数量显示
          this.getCartCount();
          
          // 更新全局TabBar的角标显示
          if (getApp() && typeof getApp().updateCartBadge === 'function') {
            getApp().updateCartBadge();
          }
        } else {
          wx.showToast({
            title: res.message || this.t('common.error'),
            icon: 'none'
          });
        }
      })
      .catch(err => {
        wx.hideLoading();
        console.error('添加到购物车失败:', err);
        wx.showToast({
          title: this.t('common.error'),
          icon: 'none'
        });
      });
  },

  buyNow: function() {
    // 检查是否已登录
    if (!checkLogin({ 
      redirectOnFail: true, 
      showToast: true,
      redirectUrl: `/pages/product/detail?id=${this.data.product.id}`
    })) {
      return;
    }
    
    // 立即购买逻辑
    // 直接跳转到确认订单页面，而不将商品加入购物车
    const product = this.data.product;
    
    if (!product || !product.id) {
      wx.showToast({
        title: this.t('common.error'),
        icon: 'none'
      });
      return;
    }
    
    // 构建结算商品
    const checkoutItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.images[0],
      spec: this.data.selectedSpec,
      count: 1,
      selected: true
    };
    
    // 保存到checkoutItems缓存
    wx.setStorageSync('checkoutItems', {
      items: [checkoutItem],
      totalPrice: product.price.toFixed(2),
      fromDirect: true // 标记为直接购买
    });
    
    // 跳转到确认订单页面
    wx.navigateTo({
      url: '/pages/order/confirm?direct=true'
    });
  },

  navigateToCart: function() {
    wx.switchTab({
      url: '/pages/cart/index'
    });
  },

  // 从API加载商品详情数据
  loadProductData: function(productId) {
    console.log('开始加载商品详情，ID:', productId);
    
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    
    api.product.getDetail(productId)
      .then(res => {
        console.log('商品详情API响应:', res);
        
        if (res.success && res.data && res.data.product) {
          const product = res.data.product;
          
          // 处理商品图片数据
          let images = [];
          if (product.images && Array.isArray(product.images) && product.images.length > 0) {
            images = product.images;
          } else if (product.imageGallery && Array.isArray(product.imageGallery) && product.imageGallery.length > 0) {
            images = product.imageGallery;
          } else if (product.imageUrl) {
            images = [product.imageUrl];
          } else if (product.image) {
            images = [product.image];
          } else {
            images = ['/assets/images/products/default.png'];
          }
          
          // 处理商品规格数据
          let specifications = [];
          if (product.specifications && Array.isArray(product.specifications)) {
            specifications = product.specifications;
          } else if (product.specs && Array.isArray(product.specs)) {
            specifications = product.specs;
          } else {
            // 默认规格
            specifications = ['默认规格'];
          }
          
          // 构建产品数据对象
          const productData = {
            id: product._id || product.id,
            name: product.name || '商品名称',
            price: parseFloat(product.price) || 0,
            originalPrice: parseFloat(product.originalPrice) || null,
            description: product.description || '暂无描述',
            images: images,
            mainContentImage: product.mainContentImage,
            specifications: specifications,
            sales: product.sales || 0,
            stock: product.stock || 0,
            detailContent: product.detailContent || product.content || '<p>暂无详细描述</p>'
          };
          
          console.log('处理后的商品数据:', productData);
          
          this.setData({
            product: productData,
            selectedSpec: specifications[0] || '默认规格'
          });
          
          // 更新页面标题为商品名称
          wx.setNavigationBarTitle({
            title: productData.name
          });
          
        } else {
          console.error('获取商品详情失败:', res);
          wx.showToast({
            title: '获取商品详情失败: ' + (res.message || '数据格式错误'),
            icon: 'none',
            duration: 2000
          });
          
          setTimeout(() => {
            wx.navigateBack({
              fail: () => {
                wx.switchTab({
                  url: '/pages/index/index'
                });
              }
            });
          }, 2000);
        }
      })
      .catch(err => {
        console.error('加载商品详情出错:', err);
        wx.showToast({
          title: '网络错误，无法加载商品详情',
          icon: 'none',
          duration: 2000
        });
        
        setTimeout(() => {
          wx.navigateBack({
            fail: () => {
              wx.switchTab({
                url: '/pages/index/index'
              });
            }
          });
        }, 2000);
      })
      .finally(() => {
        wx.hideLoading();
      });
  },

  // 显示错误并返回上一页
  showErrorAndGoBack(message) {
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    });
    
    setTimeout(() => {
      wx.navigateBack({
        fail: () => {
          // 如果返回失败，跳转到首页
          wx.switchTab({
            url: '/pages/index/index'
          });
        }
      });
    }, 2000);
  },

  /**
   * 更新页面国际化文本
   */
  updateI18nText() {
    console.log('当前语言环境:', i18n.getCurrentLang());
    
    // 设置标签页文本
    const tabs = [
      this.t('product.detail.tab.info'),
      this.t('product.detail.tab.reviews'),
      this.t('product.detail.tab.detail')
    ];
    
    // 确保所有国际化文本都被正确加载
    const i18nData = {
      // 通用
      currencySymbol: this.t('common.unit.yuan'),
      
      // 商品信息相关
      sales: this.t('product.detail.info.sales'),
      stock: this.t('product.detail.info.stock'),
      spec: this.t('product.detail.info.spec'),
      
      // 评论相关 - 确保使用完全匹配的键路径
      reviewsTitle: this.t('product.detail.reviews.title'),
      writeReview: this.t('product.detail.reviews.write'),
      noReviews: this.t('product.detail.reviews.empty'),
      loadMore: this.t('product.detail.reviews.loadMore'),
      anonymousUser: this.t('product.detail.reviews.anonymous'),
      reviewDate: this.t('product.detail.reviews.date'),
      rating: this.t('product.detail.reviews.rating'),
      likeButton: this.t('product.detail.reviews.likeButton'),
      likeCount: this.t('product.detail.reviews.likeCount'),
      starSymbol: this.t('product.detail.reviews.starSymbol') || '★',
      
      // 错误提示
      invalidProductId: this.t('product.detail.error.invalidId'),
      invalidProductData: this.t('product.detail.error.invalidData'),
      fetchDetailFailed: this.t('product.detail.error.fetchFailed'),
      noMoreReviews: this.t('product.detail.error.noMoreReviews'),
      
      // 底部操作栏
      customerService: this.t('product.detail.action.customerService'),
      cart: this.t('product.detail.action.cart'),
      addToCart: this.t('product.detail.action.addToCart'),
      buyNow: this.t('product.detail.action.buyNow'),
      
      // 其他文本
      addToCartSuccess: this.t('product.detail.msg.addToCartSuccess'),
      selectSpec: this.t('product.detail.msg.selectSpec'),
      loginFirst: this.t('common.loginFirst'),
      likeSuccess: this.t('product.detail.msg.likeSuccess'),
      unlikeSuccess: this.t('product.detail.msg.unlikeSuccess'),
      favoriteAdded: this.t('product.detail.msg.favoriteAdded'),
      favoriteRemoved: this.t('product.detail.msg.favoriteRemoved')
    };
    
    // 确保所有文本都正确加载，避免显示国际化键
    for (const key in i18nData) {
      const value = i18nData[key];
      // 检查此键是否与原键相同（表示未找到翻译），或为undefined/null
      if (typeof value === 'undefined' || value === null || 
          (typeof value === 'string' && value.includes('.') && value.startsWith('product.'))) {
        console.warn(`国际化文本'${key}'未正确加载，替换为默认值`);
        
        // 根据当前语言环境提供默认值
        const currentLang = i18n.getCurrentLang();
        if (currentLang === 'en') {
          // 英文环境下的默认值
          switch (key) {
            case 'reviewsTitle': i18nData[key] = 'Product Reviews'; break;
            case 'writeReview': i18nData[key] = 'Write Review'; break;
            case 'noReviews': i18nData[key] = 'No reviews yet'; break;
            case 'loadMore': i18nData[key] = 'Load More'; break;
            case 'anonymousUser': i18nData[key] = 'Anonymous User'; break;
            case 'reviewDate': i18nData[key] = 'Review Date'; break;
            case 'rating': i18nData[key] = 'Rating'; break;
            case 'likeButton': i18nData[key] = 'Like'; break;
            case 'likeCount': i18nData[key] = 'likes'; break;
            case 'starSymbol': i18nData[key] = '★'; break;
            default: i18nData[key] = key; break;
          }
        } else {
          // 中文环境下的默认值
          switch (key) {
            case 'reviewsTitle': i18nData[key] = '商品评论'; break;
            case 'writeReview': i18nData[key] = '写评论'; break;
            case 'noReviews': i18nData[key] = '暂无评论'; break;
            case 'loadMore': i18nData[key] = '加载更多'; break;
            case 'anonymousUser': i18nData[key] = '匿名用户'; break;
            case 'reviewDate': i18nData[key] = '评论日期'; break;
            case 'rating': i18nData[key] = '评分'; break;
            case 'likeButton': i18nData[key] = '点赞'; break;
            case 'likeCount': i18nData[key] = '赞'; break;
            case 'starSymbol': i18nData[key] = '★'; break;
            default: i18nData[key] = key; break;
          }
        }
      }
    }
    
    console.log('更新国际化文本：', i18nData);
    
    this.setData({
      tabs,
      i18n: i18nData
    });
    
    // 如果已经有评论数据，刷新评论列表中的翻译文本
    if (this.data.reviews && this.data.reviews.length > 0) {
      // 不需要重新获取评论数据，只需要确保UI文本正确翻译
      this.setData({
        "i18n.reviewsTitle": i18nData.reviewsTitle,
        "i18n.writeReview": i18nData.writeReview,
        "i18n.rating": i18nData.rating,
        "i18n.reviewDate": i18nData.reviewDate,
        "i18n.likeButton": i18nData.likeButton,
        "i18n.likeCount": i18nData.likeCount
      });
    }
  },

  // 从API加载评论数据
  loadProductReviews(productId) {
    wx.showLoading({
      title: this.t('common.loading')
    });
    
    api.getProductReviews(productId)
      .then(res => {
        if (res.success && res.data && res.data.reviews) {
          console.log('获取到评论数据:', res.data);
          // 确保评论数据格式正确
          const formattedReviews = res.data.reviews.map(review => {
            // 处理日期显示格式
            let reviewDate = review.createdAt || review.created_at || new Date().toISOString();
            // 尝试转换为标准日期时间格式
            try {
              const dateObj = new Date(reviewDate);
              const year = dateObj.getFullYear();
              const month = String(dateObj.getMonth() + 1).padStart(2, '0');
              const day = String(dateObj.getDate()).padStart(2, '0');
              const hours = String(dateObj.getHours()).padStart(2, '0');
              const minutes = String(dateObj.getMinutes()).padStart(2, '0');
              const seconds = String(dateObj.getSeconds()).padStart(2, '0');
              reviewDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            } catch (e) {
              console.error('日期格式化失败:', e);
            }
            
            return {
              id: review._id || review.id,
              user: {
                nickName: review.user ? review.user.nickName : (review.userName || this.t('product.detail.reviews.anonymous')),
                avatar: review.user && review.user.avatar ? review.user.avatar : '/assets/images/avatar/default.png'
              },
              content: review.comment || review.content || '',
              rating: review.rating || 5,
              createdAt: reviewDate,
              likeCount: review.likes || review.likeCount || review.like_count || 0,
              liked: review.liked || false,
              images: review.images || []
            };
          });

          // 一次性更新所有数据，避免多次setData
          this.setData({
            reviews: formattedReviews,
            reviewTotal: res.data.total || formattedReviews.length
          }, () => {
            // 在设置评论数据后重新确保国际化文本正确显示
            this.updateI18nText();
          });
        } else {
          // 如果API调用成功但没有数据，显示空状态
          this.setData({
            reviews: [],
            reviewTotal: 0
          });
        }
      })
      .catch(err => {
        console.error('获取评论失败:', err);
        // API调用失败，显示空状态
        this.setData({
          reviews: [],
          reviewTotal: 0
        });
        
        wx.showToast({
          title: this.t('product.detail.error.fetchFailed'),
          icon: 'none'
        });
      })
      .finally(() => {
        wx.hideLoading();
      });
  },
  
  // 获取购物车数量
  getCartCount() {
    // 检查是否已登录
    if (!checkLogin({ redirectOnFail: false, showToast: false })) {
      // 未登录，设置购物车数量为0
      this.setData({
        cartCount: 0
      });
      return;
    }
    
    // 已登录，从API获取购物车数量
    api.getCartCount()
      .then(res => {
        console.log('获取购物车数量返回:', res);
        if (res.success && typeof res.data.count === 'number') {
          this.setData({
            cartCount: res.data.count
          });
        } else {
          this.setData({
            cartCount: 0
          });
        }
      })
      .catch(err => {
        console.error('获取购物车数量失败:', err);
        this.setData({
          cartCount: 0
        });
      });
  },
  
  // 点赞评论
  likeReview(e) {
    const reviewId = e.currentTarget.dataset.reviewId;
    const reviews = this.data.reviews.map(review => {
      if (review.id === reviewId) {
        const newLiked = !review.liked;
        return {
          ...review,
          liked: newLiked,
          likeCount: newLiked ? review.likeCount + 1 : review.likeCount - 1
        };
      }
      return review;
    });
    
    this.setData({
      reviews
    });
    
    wx.showToast({
      title: reviews.find(r => r.id === reviewId).liked ? 
        this.t('product.detail.msg.likeSuccess') : 
        this.t('product.detail.msg.unlikeSuccess'),
      icon: 'success'
    });
  },
  
  // 添加检查是否已收藏的方法
  checkIsFavorite(productId) {
    // 判断商品ID是否有效
    if (!productId) {
      console.error('检查收藏状态：无效的商品ID');
      return;
    }
    
    // 如果ID是对象，转换为字符串
    if (typeof productId === 'object' && productId.toString) {
      productId = productId.toString();
    }
    
    // 判断用户是否登录
    const token = wx.getStorageSync('token');
    if (!token) {
      console.log('用户未登录，无法检查收藏状态');
      return;
    }
    
    console.log('检查商品收藏状态，ID:', productId);

    api.checkFavorite(productId)
      .then(res => {
        console.log('检查收藏状态响应:', res);
        if (res.success) {
          this.setData({
            isFavorite: res.data.isFavorite
          });
          console.log('设置收藏状态为:', res.data.isFavorite);
        }
      })
      .catch(err => {
        console.error('检查收藏状态失败:', err);
      });
  },
  
  // 修改收藏商品的方法
  toggleFavorite() {
    // 判断用户是否登录
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.showToast({
        title: this.t('common.loginFirst'),
        icon: 'none'
      });
      return;
    }

    const product = this.data.product;
    
    // 获取商品ID，可能是MongoDB ObjectId或普通ID
    let productId = product._id || product.id;
    
    // 如果ID是对象，转换为字符串
    if (productId && typeof productId === 'object' && productId.toString) {
      productId = productId.toString();
    }
    
    if (!productId) {
      console.error('无法获取有效的商品ID:', product);
      wx.showToast({
        title: '商品ID无效',
        icon: 'none'
      });
      return;
    }
    
    console.log('收藏/取消收藏商品，ID:', productId);
    
    const isFavorite = this.data.isFavorite;

    // 根据当前收藏状态调用相应的API
    const apiCall = isFavorite ? 
      api.removeFavorite(productId) : 
      api.addFavorite(productId);
    
    wx.showLoading({
      title: isFavorite ? '取消收藏中...' : '收藏中...',
      mask: true
    });
    
    apiCall
      .then(res => {
        wx.hideLoading();
        if (res.success) {
          // 更新收藏状态
          this.setData({
            isFavorite: !isFavorite
          });
          
          // 显示提示
          wx.showToast({
            title: !isFavorite ? 
              this.t('product.detail.msg.favoriteAdded') : 
              this.t('product.detail.msg.favoriteRemoved'),
            icon: 'success'
          });
        } else {
          wx.showToast({
            title: res.message || this.t('common.error'),
            icon: 'none'
          });
        }
      })
      .catch(err => {
        wx.hideLoading();
        console.error('收藏操作失败:', err);
        wx.showToast({
          title: this.t('common.error'),
          icon: 'none'
        });
      });
  },
  
  // 加载更多评论
  loadMoreReviews() {
    wx.showToast({
      title: this.t('product.detail.error.noMoreReviews'),
      icon: 'none'
    });
  },
  
  // 写评论
  writeReview() {
    wx.showToast({
      title: this.t('common.loginFirst'),
      icon: 'none'
    });
  },
  
  // 预览图片
  previewImage(e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.product.images || [this.data.product.image];
    
    wx.previewImage({
      current: images[index],
      urls: images
    });
  },

  /**
   * 强制刷新当前界面的国际化显示
   * 在语言切换后调用
   */
  refreshI18n() {
    this.updateI18nText();
  },
  
  /**
   * 监听语言变化
   */
  onLanguageChanged(lang) {
    console.log('商品详情页收到语言变化事件:', lang);
    this.refreshI18n();
  }
};

// 使用createPage包装页面配置
Page(createPage(pageConfig)); 
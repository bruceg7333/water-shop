const i18n = require('../../utils/i18n/index');
const { api } = require('../../utils/request');

Page({
  data: {
    favoriteList: [],
    loading: true,
    error: false
  },
  
  onLoad: function() {
    // 注册国际化页面
    const app = getApp();
    if (app && app.globalData) {
      app.globalData.i18nPages = app.globalData.i18nPages || [];
      app.globalData.i18nPages.push(this);
    }
    
    // 更新国际化文本
    this.updateI18nText();
    
    // 加载收藏数据
    this.loadFavoriteData();
  },
  
  onShow: function() {
    // 返回页面时刷新数据
    this.loadFavoriteData();
  },
  
  // 加载收藏数据
  loadFavoriteData: function() {
    console.log('开始加载收藏数据...');
    
    this.setData({
      loading: true,
      error: false
    });
    
    api.getFavorites().then(res => {
      console.log('收藏数据原始响应:', res);
      
      // 处理每个收藏项，标记已下架的商品
      let favoriteList = [];
      
      // 修正：后端API返回的数据结构是 { success, data: { favorites: [...] } }
      if (res.success && res.data) {
        // 检查是否有favorites字段（嵌套在data中）
        const favorites = res.data.favorites || res.data || [];
        
        // 确保我们操作的是数组
        if (Array.isArray(favorites)) {
          favoriteList = favorites.map(item => {
            if (!item) {
              console.warn('收藏项为空');
              return null;
            }
            
            console.log('处理收藏项:', item);
            
            // 提取产品信息
            const product = item.product || {};
            
            // 使用后端提供的productStatus来判断商品状态
            let isUnavailable = false;
            let statusText = '';
            
            // 根据后端返回的状态设置显示文本
            switch (item.productStatus) {
              case 'normal':
                isUnavailable = false;
                break;
              case 'out_of_stock':
                isUnavailable = true;
                statusText = this.data.i18n ? this.data.i18n.outOfStock : '缺货';
                break;
              case 'discontinued':
                isUnavailable = true;
                statusText = this.data.i18n ? this.data.i18n.unavailable : '已下架';
                break;
              case 'presale':
                isUnavailable = false;
                statusText = this.data.i18n ? this.data.i18n.presale : '预售';
                break;
              case 'unavailable':
              default:
                isUnavailable = true;
                statusText = this.data.i18n ? this.data.i18n.unavailable : '已下架';
                break;
            }
            
            // 如果后端没有返回productStatus，则使用旧的判断逻辑
            if (!item.productStatus) {
              isUnavailable = !product || 
                            product.isDeleted || 
                            product.stock === 0 || 
                            !product.isActive ||
                            (product.status && product.status === '下架');
              statusText = '已下架';
            }
            
            // 尝试获取有效的商品ID
            let productId = null;
            
            // 从各种可能的位置提取ID
            if (product && product._id) {
              productId = product._id;
            } else if (product && product.id) {
              productId = product.id;
            } else if (item.productId) {
              productId = item.productId;
            } else if (item.product) {
              productId = item.product;  // 有时product可能直接是ID
            } else if (item._id) {
              productId = item._id;
            } else if (item.id) {
              productId = item.id;
            }
            
            // 确保productId是字符串类型
            if (productId && typeof productId === 'object' && productId.toString) {
              productId = productId.toString();
            }
            
            // 日志记录商品ID
            console.log('提取到的商品ID:', productId);
            
            if (!productId) {
              console.warn('无法获取有效的商品ID:', item);
              return null;
            }
            
            // 获取销量
            const sales = product.sales || item.sales || 0;
            
            // 根据销量和国际化信息生成显示文本
            let salesDisplayText = '销量 0';
            if (this.data.i18n && this.data.i18n.sales) {
              // 替换 {count} 为实际销量
              salesDisplayText = this.data.i18n.sales.replace('{count}', sales.toString());
            }
            
            return {
              ...item,
              productId: productId,
              isUnavailable: isUnavailable,
              statusText: statusText,
              salesDisplayText: salesDisplayText
            };
          }).filter(item => item !== null);
        } else {
          console.error('后端返回的favorites不是数组:', favorites);
        }
      } else {
        console.error('API响应格式不正确:', res);
      }
      
      console.log('处理后的收藏列表:', favoriteList);
      
      this.setData({
        favoriteList: favoriteList,
        loading: false
      });
    }).catch(err => {
      console.error('获取收藏列表失败:', err);
      this.setData({
        error: true,
        loading: false
      });
    });
  },
  
  // 更新页面的国际化文本
  updateI18nText: function() {
    // 更新标题
    wx.setNavigationBarTitle({
      title: i18n.t('page.favorite')
    });
    
    // 更新页面文本
    this.setData({
      i18n: {
        empty: i18n.t('favorite.empty'),
        goShopping: i18n.t('favorite.goShopping'),
        addToCart: i18n.t('favorite.addToCart'),
        remove: i18n.t('favorite.remove'),
        sales: i18n.t('favorite.sales'),
        yuan: i18n.t('common.unit.yuan'),
        unavailable: i18n.t('favorite.status.unavailable') || '已下架',
        outOfStock: i18n.t('favorite.status.outOfStock') || '缺货',
        presale: i18n.t('favorite.status.presale') || '预售',
        normal: i18n.t('favorite.status.normal') || '正常',
        loading: i18n.t('common.loading'),
        error: i18n.t('common.error'),
        retry: i18n.t('common.retry')
      }
    });
    
    // 更新每个收藏项中的销量显示格式
    if (this.data.favoriteList && this.data.favoriteList.length > 0) {
      const updatedList = this.data.favoriteList.map(item => {
        const sales = item.product?.sales || item.sales || 0;
        item.salesWithCount = i18n.t('favorite.sales').replace('{count}', sales);
        return item;
      });
      
      this.setData({
        favoriteList: updatedList,
        'i18n.salesWithCount': i18n.t('favorite.sales').replace('{count}', '{salesCount}')
      });
    }
  },
  
  goToHome: function() {
    // 跳转到全部商品页面，指定分类为全部
    wx.navigateTo({
      url: '/pages/product/list?category=all',
      success: () => {
        console.log('跳转到全部商品页面成功');
      },
      fail: (err) => {
        console.error('跳转到全部商品页面失败:', err);
        // 如果导航失败，尝试跳转到首页
        wx.switchTab({
          url: '/pages/index/index'
        });
      }
    });
  },
  
  viewDetail: function(e) {
    const id = e.currentTarget.dataset.id;
    
    console.log('viewDetail被调用，接收到的ID:', id);
    
    // 检查ID是否有效
    if (!id) {
      console.error('无效的商品ID:', id);
      wx.showToast({
        title: '无效的商品ID',
        icon: 'none'
      });
      return;
    }
    
    // 将ID转换为字符串（如果不是字符串类型）
    const productId = id.toString();
    console.log('处理后的ID:', productId);
    
    // 检查商品是否已下架
    const item = this.data.favoriteList.find(item => 
      item.productId === productId || 
      (item.product && item.product._id === productId) ||
      (item.product && item.product.id === productId)
    );
    
    if (item && item.isUnavailable) {
      console.log('商品已下架，不跳转:', item);
      wx.showToast({
        title: this.data.i18n.unavailable,
        icon: 'none'
      });
      return;
    }
    
    console.log('准备跳转到商品详情页，ID:', productId);
    
    // 跳转到商品详情页
    wx.navigateTo({
      url: '/pages/product/detail?id=' + productId,
      fail: function(err) {
        console.error('页面跳转失败:', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },
  
  addToCart: function(e) {
    const item = e.currentTarget.dataset.item;
    
    // 如果商品已下架，则不能添加到购物车
    if (item && item.isUnavailable) {
      wx.showToast({
        title: this.data.i18n.unavailable,
        icon: 'none'
      });
      return;
    }
    
    // 获取商品ID，适配不同数据结构
    let productId = null;
    if (item.product && item.product._id) {
      productId = item.product._id;
    } else if (item.product && item.product.id) {
      productId = item.product.id;
    } else if (item.productId) {
      productId = item.productId;
    } else if (item.id) {
      productId = item.id;
    }
    
    if (!productId) {
      wx.showToast({
        title: '无效的商品ID',
        icon: 'none'
      });
      return;
    }
    
    // 调用添加购物车API
    api.addToCart({
      productId: productId,
      quantity: 1
    }).then(res => {
      wx.showToast({
        title: i18n.t('product.detail.msg.addToCartSuccess'),
        icon: 'success'
      });
      
      // 更新购物车图标
      const app = getApp();
      if (app && typeof app.updateTabBarBadge === 'function') {
        api.getCartCount().then(res => {
          if (res.data && res.data.count) {
            app.updateTabBarBadge(res.data.count);
          }
        }).catch(err => {
          console.error('获取购物车数量失败', err);
        });
      }
    }).catch(err => {
      console.error('添加购物车失败:', err);
      wx.showToast({
        title: i18n.t('common.error'),
        icon: 'none'
      });
    });
  },
  
  // 取消收藏
  removeFavorite: function(e) {
    const id = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: i18n.t('common.tip'),
      content: i18n.t('favorite.confirm.remove'),
      success: (res) => {
        if (res.confirm) {
          api.removeFavorite(id).then(res => {
            if (res.success) {
              // 更新列表
              const list = this.data.favoriteList.filter(item => 
                item.productId !== id && 
                (item.product && item.product._id !== id) && 
                (item.product && item.product.id !== id)
              );
              
              this.setData({
                favoriteList: list
              });
              
              wx.showToast({
                title: i18n.t('favorite.success.remove'),
                icon: 'success'
              });
            } else {
              wx.showToast({
                title: res.message || i18n.t('common.error'),
                icon: 'none'
              });
            }
          }).catch(err => {
            console.error('取消收藏失败:', err);
            wx.showToast({
              title: i18n.t('common.error'),
              icon: 'none'
            });
          });
        }
      }
    });
  }
})
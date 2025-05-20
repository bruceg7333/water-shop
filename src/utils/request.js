/**
 * 网络请求工具类
 */
const i18n = require('./i18n/index');

// API基础URL - 确认这是正确的基础URL
const BASE_URL = 'http://localhost:5001/api';
// 如果后端API需要使用其他前缀或格式，请修改上面的值

/**
 * 封装微信请求
 * @param {Object} options - 请求选项
 * @param {string} options.url - 请求路径
 * @param {string} options.method - 请求方法
 * @param {Object} options.data - 请求数据
 * @param {boolean} options.showLoading - 是否显示加载提示
 * @returns {Promise} 请求结果Promise
 */
const request = (options) => {
  const { url, method = 'GET', data = {}, showLoading = true } = options;
  
  // 显示加载提示
  if (showLoading) {
    wx.showLoading({
      title: i18n.t('common.loading') || '加载中...',
      mask: true
    });
  }
  
  // 获取token
  const token = wx.getStorageSync('token');
  const header = {
    'content-type': 'application/json'
  };
  
  // 如果有token，添加到请求头
  if (token) {
    header['Authorization'] = `Bearer ${token}`;
  } else {
    console.warn('请求未包含认证Token，API可能需要登录');
  }
  
  console.log(`发送 ${method} 请求到:`, `${BASE_URL}${url}`, data, '头部:', header);
  
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}${url}`, // 完整URL
      method, // 请求方法
      data, // 请求数据
      header,
      success: (res) => {
        console.log(`API响应 (${url}):`, res.statusCode, res.data);
        
        // 处理未认证错误 (401)
        if (res.statusCode === 401) {
          wx.hideLoading();
          
          // 如果是登录相关请求，直接返回结果
          if (url.includes('/login') || url.includes('/register')) {
            reject(res.data);
            return;
          }
          
          // 清除过期的登录信息
          if (wx.getStorageSync('isLoggedIn')) {
            wx.removeStorageSync('token');
            wx.removeStorageSync('userInfo');
            wx.removeStorageSync('isLoggedIn');
          }
          
          // 提示用户登录
          wx.showModal({
            title: i18n.t('common.tip') || '提示',
            content: res.data?.message || i18n.t('common.loginRequired') || '您需要登录后才能使用此功能',
            confirmText: i18n.t('common.toLogin') || '去登录',
            cancelText: i18n.t('common.cancel') || '取消',
            success: (result) => {
              if (result.confirm) {
                // 记录当前页面，以便登录后返回
                const pages = getCurrentPages();
                if (pages.length > 0) {
                  const currentPage = pages[pages.length - 1];
                  const currentUrl = '/' + currentPage.route;
                  let queryStr = '';
                  
                  // 获取当前页面的查询参数
                  const options = currentPage.options || {};
                  const queryParams = [];
                  for (const key in options) {
                    queryParams.push(`${key}=${options[key]}`);
                  }
                  
                  if (queryParams.length > 0) {
                    queryStr = '?' + queryParams.join('&');
                  }
                  
                  // 保存原始页面路径
                  const fullRedirectUrl = currentUrl + queryStr;
                  console.log('保存认证失败前的页面路径:', fullRedirectUrl);
                  
                  // 检查是否是登录页面或tabBar页面
                  if (currentUrl === '/pages/member/login') {
                    console.log('当前已在登录页面，不保存重定向URL');
                  } else {
                    wx.setStorageSync('redirectUrl', fullRedirectUrl);
                    console.log('已保存redirectUrl:', fullRedirectUrl);
                  }
                } else {
                  console.log('无法获取当前页面信息');
                }
                
                // 跳转到登录页
                console.log('跳转到登录页');
                wx.navigateTo({
                  url: '/pages/member/login',
                  fail: (err) => {
                    console.error('跳转到登录页失败:', err);
                    // 可能是因为已经在登录页面
                    wx.reLaunch({
                      url: '/pages/member/login'
                    });
                  }
                });
              }
            }
          });
          
          reject(res.data);
          return;
        }
        
        // 请求成功
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          // 处理业务错误
          const errorMsg = (res.data && res.data.message) || i18n.t('common.requestFailed') || '请求失败';
          wx.showToast({
            title: errorMsg,
            icon: 'none',
            duration: 2000
          });
          reject(res.data);
        }
      },
      fail: (err) => {
        // 请求失败
        console.error(`请求失败 (${url}):`, err);
        wx.showToast({
          title: i18n.t('common.networkError') || '网络异常，请稍后重试',
          icon: 'none',
          duration: 2000
        });
        reject(err);
      },
      complete: () => {
        // 隐藏加载提示
        if (showLoading) {
          wx.hideLoading();
        }
      }
    });
  });
};

// API方法
const api = {
  // 用户相关
  user: {
    // 用户注册
    register: (data) => request({
      url: '/users/register',
      method: 'POST',
      data
    }),
    // 用户登录
    login: (data) => request({
      url: '/users/login',
      method: 'POST',
      data
    }),
    // 微信登录
    wechatLogin: (data) => request({
      url: '/users/wechat-login',
      method: 'POST',
      data
    }),
    // 微信注册
    wechatRegister: (data) => request({
      url: '/users/wechat-register',
      method: 'POST',
      data
    }),
    // 获取当前用户信息
    getCurrentUser: () => request({
      url: '/users/me'
    }),
    // 更新用户资料
    updateProfile: (data) => request({
      url: '/users/me',
      method: 'PUT',
      data
    }),
    // 修改密码
    updatePassword: (data) => request({
      url: '/users/password',
      method: 'PUT',
      data
    })
  },
  
  // 获取用户资料（包含积分等信息）
  getUserProfile: () => request({
    url: '/users/me'
  }),
  
  // 获取积分记录
  getPointsRecords: () => request({
    url: '/points/records'
  }),
  
  // 获取用户总积分
  getUserTotalPoints: () => request({
    url: '/points/total'
  }),
  
  // 更新用户积分数据 - 仅用于同步本地存储与API数据
  updateUserPoints: (points) => {
    console.log('更新用户积分数据:', points);
    // 从本地存储获取用户数据
    const userInfo = wx.getStorageSync('userInfo') || {};
    
    // 更新积分
    userInfo.points = points;
    
    // 保存回本地存储
    wx.setStorageSync('userInfo', userInfo);
    
    // 返回成功响应
    return Promise.resolve({
      success: true,
      data: {
        message: '积分更新成功',
        points: points
      }
    });
  },
  
  // 积分兑换
  exchangePoints: (data) => request({
    url: '/points/exchange',
    method: 'POST',
    data
  }),
  
  // 地址相关API - 确保URLs匹配后端实际路径
  getAddresses: () => request({
    url: '/addresses', // 正确的路径是 /addresses
  }),
  
  getAddressById: (id) => {
    if (!id) {
      console.error('获取地址详情失败：缺少 ID');
      return Promise.reject({ success: false, message: '获取地址详情失败：缺少ID' });
    }
    console.log('获取地址详情 ID:', id);
    return request({
      url: `/addresses/${id}`, // 正确的路径是 /addresses/:id
    });
  },
  
  createAddress: (data) => request({
    url: '/addresses', // 正确的路径是 /addresses
    method: 'POST',
    data
  }),
  
  updateAddress: (data) => {
    const addressId = data._id;
    if (!addressId) {
      console.error('更新地址失败：缺少 _id');
      return Promise.reject({ success: false, message: '更新地址失败：缺少ID' });
    }
    console.log('更新地址 ID:', addressId);
    return request({
      url: `/addresses/${addressId}`, // 正确的路径是 /addresses/:id
      method: 'PUT',
      data: data
    });
  },
  
  deleteAddress: (id) => {
    if (!id) {
      console.error('删除地址失败：缺少 ID');
      return Promise.reject({ success: false, message: '删除地址失败：缺少ID' });
    }
    console.log('删除地址 ID:', id);
    
    // 查看API实现，正确的路径是 DELETE /addresses/:id
    return request({
      url: `/addresses/${id}`,
      method: 'DELETE'
    });
  },
  
  setDefaultAddress: (id) => request({
    url: `/addresses/${id}/default`, // 正确的路径是 PATCH /addresses/:id/default
    method: 'PATCH' // 修正为PATCH方法
  }),
  
  // 收藏相关API
  getFavorites: () => request({
    url: '/favorites'
  }),
  
  addFavorite: (productId) => request({
    url: '/favorites',
    method: 'POST',
    data: { productId }
  }),
  
  removeFavorite: (productId) => request({
    url: `/favorites/${productId}`,
    method: 'DELETE'
  }),
  
  // 购物车相关API
  getCart: () => request({
    url: '/cart'
  }),
  
  addToCart: (data) => request({
    url: '/cart',
    method: 'POST',
    data
  }),
  
  updateCartItem: (data) => request({
    url: `/cart/${data.productId}`,
    method: 'PUT',
    data
  }),
  
  removeCartItem: (productId) => request({
    url: `/cart/${productId}`,
    method: 'DELETE'
  }),
  
  getCartCount: () => request({
    url: '/cart/count'
  }),
  
  // 商品相关
  product: {
    // 获取商品列表
    getList: (params) => request({
      url: '/products',
      data: params
    }),
    // 获取商品详情
    getDetail: (id) => request({
      url: `/products/${id}`
    }),
    // 获取热销商品（销量前3）
    getHotProducts: () => request({
      url: '/products/hot'
    })
  },
  
  // 订单相关
  order: {
    // 获取订单列表
    getList: (params) => request({
      url: '/orders/me',
      data: params
    }),
    // 获取订单详情
    getDetail: (id) => request({
      url: `/orders/${id}`
    }),
    // 创建订单
    create: (data) => request({
      url: '/orders',
      method: 'POST',
      data
    }),
    // 取消订单
    cancel: (id) => request({
      url: `/orders/${id}/cancel`,
      method: 'POST'
    }),
    // 确认收货
    confirm: (id) => request({
      url: `/orders/${id}/confirm`,
      method: 'POST'
    }),
    // 删除订单
    delete: (id) => request({
      url: `/orders/${id}`,
      method: 'DELETE'
    }),
    // 再次购买
    buyAgain: (id) => request({
      url: `/orders/${id}/buy-again`,
      method: 'POST'
    }),
    // 获取订单统计
    getStatistics: () => request({
      url: '/orders/statistics'
    })
  },
  
  // 优惠券相关
  coupon: {
    // 获取优惠券列表
    getList: () => request({
      url: '/coupons/me'
    }),
    // 领取优惠券
    claim: (id) => request({
      url: `/coupons/claim`,
      method: 'POST',
      data: { couponId: id }
    })
  },
  
  // 支付相关
  payment: {
    // 获取支付参数
    getPaymentParams: (data) => request({
      url: '/payments/create',
      method: 'POST',
      data
    }),
    // 确认支付
    confirmPayment: (data) => request({
      url: '/payments/callback',
      method: 'POST',
      data
    }),
    // 查询支付状态
    queryPaymentStatus: (orderId) => request({
      url: `/payments/status/${orderId}`
    })
  },
  
  // 文章相关
  article: {
    // 获取文章列表
    getList: (params) => request({
      url: '/articles',
      data: params
    }),
    // 获取热门文章
    getHotArticles: (limit = 3) => request({
      url: `/articles/hot?limit=${limit}`
    }),
    // 获取文章详情
    getDetail: (id) => request({
      url: `/articles/${id}`
    }),
    // 增加文章分享次数
    increaseShareCount: (id) => request({
      url: `/articles/${id}/share`,
      method: 'POST'
    })
  }
};

module.exports = {
  request,
  api
}; 
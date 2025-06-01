/**
 * 繁體中文文本資源
 */
module.exports = {
  // 應用標題
  app: {
    title: 'SPRINKLE水商城'
  },
  
  // 頁面標題
  page: {
    home: '首頁',
    cart: '購物車',
    order: '訂單管理',
    orderDetail: '訂單詳情',
    orderConfirm: '確認訂單',
    profile: '個人中心',
    products: '商品列表',
    productDetail: '商品詳情',
    address: '收貨地址',
    addressAdd: '新增收貨地址',
    addressEdit: '編輯地址',
    coupon: '優惠券',
    favorite: '我的收藏',
    points: '我的積分',
    service: '客戶服務',
    about: '關於我們',
    agreement: '用戶協議',
    article: '飲水知識',
    articleDetail: '文章詳情',
    member: '會員中心',
    memberLogin: '會員登錄',
    memberRegister: '會員註冊',
    promotion: '促銷活動',
    login: '登錄',
    profileEdit: '編輯資料'
  },
  
  // 通用文本
  common: {
    loading: '加載中...',
    error: '網絡異常，請稍後重試',
    empty: '暫無數據',
    retry: '點擊重試',
    viewAll: '查看全部',
    unit: {
      piece: '件',
      yuan: '¥'
    },
    tip: '提示',
    success: '成功',
    confirm: '確認',
    cancel: '取消',
    delete: '刪除',
    edit: '編輯',
    save: '保存',
    loginFirst: '請先登錄',
    loginRequired: '您需要登錄後才能使用此功能',
    loginExpired: '登錄已過期',
    toLogin: '去登錄'
  },
  
  // 底部導航欄
  tabbar: {
    home: '首頁',
    cart: '購物車',
    order: '訂單',
    profile: '我的'
  },
  
  // 首頁文本
  home: {
    search: {
      placeholder: '搜索飲用水產品'
    },
    nav: {
      allProducts: '全部商品',
      waterKnowledge: '飲水知識',
      promotions: '優惠活動',
      newUserGift: '新人禮包'
    },
    section: {
      hotProducts: '熱門產品',
      waterScience: '飲水科普',
      brandStory: '品牌故事'
    },
    product: {
      buy: '購買',
      sold: '已售{count}件',
      tag: {
        hot: '熱銷',
        new: '新品',
        discount: '優惠'
      }
    },
    article: {
      reads: '{count}閱讀',
      shares: '{count}轉發',
      tag: {
        health: '飲水健康',
        knowledge: '水質知識',
        tips: '健康提示',
        science: '科普',
        research: '研究',
        lifestyle: '生活方式'
      }
    },
    brand: {
      title: '品牌故事',
      content: 'SPRINKLE 的水源來自海拔3800米的高山冰川，經過18層過濾和嚴格的質量控制，為您提供最純淨、健康的飲用水。20年專注飲用水研發，只為您的健康飲水體驗。',
      tags: ['0添加', '18層過濾', '天然礦物質', '低鈉', '適合嬰幼兒'],
      tag1: '0添加',
      tag2: '18層過濾',
      tag3: '天然礦物質',
      tag4: '低鈉',
      tag5: '適合嬰幼兒'
    },
    takeWay: {
      delivery: '外賣',
      selfPickup: '自取'
    },
    toast: {
      langSwitched: '語言已切換'
    },
    language: {
      switch: '切換語言',
      current: '當前語言'
    }
  },
  
  // 產品相關文本
  product: {
    detail: {
      tab: {
        info: '商品',
        reviews: '評論',
        detail: '詳情'
      },
      info: {
        sales: '銷量',
        stock: '庫存',
        spec: '規格'
      },
      reviews: {
        title: '商品評論',
        write: '寫評論',
        empty: '暫無評論，快來搶沙發吧~',
        loadMore: '加載更多評論',
        anonymous: '匿名用戶',
        date: '評論日期',
        rating: '評分',
        likeButton: '點贊',
        likeCount: '贊',
        starSymbol: '★'
      },
      action: {
        customerService: '客服',
        cart: '購物車',
        addToCart: '加入購物車',
        buyNow: '立即購買'
      }
    },
    list: {
      category: {
        all: '全部',
        pure: '純淨水',
        mineral: '礦泉水',
        soda: '蘇打水'
      },
      sort: {
        default: '默認',
        sales: '銷量',
        priceAsc: '價格↑',
        priceDesc: '價格↓'
      },
      tag: {
        hot: '熱銷',
        new: '新品',
        discount: '優惠',
        special: '特惠'
      },
      soldCount: '已售{count}件',
      empty: '暫無相關商品',
      addedToCart: '已加入購物車'
    }
  },
  
  // 購物車文本
  cart: {
    title: '購物車',
    empty: '購物車空空如也，去挑選心儀商品吧',
    checkout: '結算',
    selectAll: '全選',
    total: '合計',
    pieces: '共{count}件',
    goShopping: '去逛逛'
  },
  
  // 訂單文本
  order: {
    status: {
      unknown: '未知狀態',
      pending: '待付款',
      shipped: '待發貨',
      receipt: '待收貨',
      completed: '已完成',
      cancelled: '已取消',
      canceled: '已取消'
    },
    tab: {
      all: '全部',
      pending: '待付款',
      shipped: '待發貨',
      receipt: '待收貨',
      completed: '已完成'
    }
  },
  
  // 個人中心
  profile: {
    notLogged: '未登錄',
    login: '點擊登錄',
    loginHint: '點擊登錄賬號',
    logout: '退出登錄',
    logoutConfirm: '確定要退出登錄嗎？',
    logoutSuccess: '已退出登錄',
    pleaseLogin: '請先登錄',
    settings: '設置',
    order: {
      title: '我的訂單',
      all: '全部訂單',
      pending: '待付款',
      shipped: '待發貨',
      receipt: '待收貨',
      review: '待評價'
    },
    menu: {
      address: '收貨地址',
      favorite: '我的收藏',
      coupon: '優惠券',
      points: '我的積分',
      service: '聯繫客服',
      about: '關於我們'
    },
    member: {
      normal: '普通會員',
      bronze: '青銅會員',
      silver: '白銀會員',
      gold: '黃金會員',
      platinum: '鉑金會員',
      diamond: '鑽石會員',
      admin: '管理員'
    },
    points: {
      title: '我的積分',
      balance: '積分餘額',
      label: '水滴積分'
    },
    coupon: {
      title: '優惠券',
      count: '張優惠券',
      label: '優惠券'
    },
    edit: {
      avatar: '頭像',
      nickname: '昵稱',
      nicknamePlaceholder: '請輸入昵稱',
      phone: '手機號',
      notBound: '未綁定',
      bindPhone: '綁定',
      changePhone: '更換',
      gender: '性別',
      selectGender: '請選擇',
      birthday: '生日',
      selectBirthday: '請選擇',
      email: '郵箱',
      emailPlaceholder: '請輸入郵箱',
      signature: '個性簽名',
      signaturePlaceholder: '請輸入個性簽名',
      male: '男',
      female: '女',
      unknown: '未知',
      nicknameRequired: '請輸入昵稱',
      invalidEmail: '郵箱格式不正確'
    }   },
  
  // 文章列表頁
  articleList: {
    title: '飲水科普',
    categories: {
      all: '全部',
      health: '健康知識',
      science: '科普',
      tips: '飲水小貼士'
    },
    loading: '正在加載更多...',
    noMore: '已經到底啦',
    loadMore: '點擊加載更多',
    noArticles: '沒有找到文章',
    loadFailed: '加載失敗，請重試',
    empty: '暫無相關文章',
    viewsLabel: '閱讀',
    dateLabel: '發佈日期'
  }
}; 
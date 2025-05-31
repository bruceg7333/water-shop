/**
 * 简体中文文本资源
 */
module.exports = {
  // 应用标题
  app: {
    title: 'SPRINKLE水商城'
  },
  
  // 页面标题
  page: {
    home: '首页',
    cart: '购物车',
    order: '订单管理',
    orderDetail: '订单详情',
    orderConfirm: '确认订单',
    profile: '个人中心',
    products: '商品列表',
    productDetail: '商品详情',
    address: '收货地址',
    addressEdit: '编辑收货地址',
    addressAdd: '新增收货地址',
    coupon: '优惠券',
    favorite: '我的收藏',
    points: '我的积分',
    service: '客户服务',
    about: '关于我们',
    agreement: '用户协议',
    article: '饮水知识',
    articleDetail: '文章详情',
    member: '会员中心',
    login: '会员登录',
    memberRegister: '会员注册',
    promotion: '促销活动',
    profileEdit: '编辑资料'
  },
  
  // 登录页面文本
  login: {
    title: 'SPRINKLE水商城',
    subtitle: '登录账号',
    username: '请输入用户名',
    password: '请输入密码',
    loginButton: '登录',
    wechatLogin: '微信一键登录',
    forgotPassword: '忘记密码',
    forgotPasswordTip: '请联系客服重置密码',
    register: '注册账号',
    agreement: '登录即表示您同意',
    userAgreement: '《用户协议》',
    userAgreementContent: '欢迎使用SPRINKLE水商城！本协议是您与SPRINKLE水商城之间关于用户使用服务所订立的协议。使用我们的服务即表示您已阅读并同意本协议的所有条款。',
    privacyPolicy: '《隐私政策》',
    privacyPolicyContent: '我们非常重视您的个人信息和隐私保护。我们会收集您的登录信息、购物信息等用于提供更好的服务。我们承诺对您的个人信息进行严格保密，不会向第三方泄露。',
    and: '和',
    iHaveRead: '我已阅读',
    authTitle: '授权提示',
    authConfirm: '同意',
    authCancel: '取消',
    errorMessages: {
      usernameRequired: '请输入用户名',
      passwordRequired: '请输入密码',
      loginFailed: '登录失败，请重试',
      networkError: '网络异常，请稍后重试',
      privacyPolicyRequired: '您需要同意隐私政策才能完成登录'
    },
    successMessage: '登录成功'
  },
  
  // 通用文本
  common: {
    loading: '加载中...',
    error: '网络异常，请稍后重试',
    empty: '暂无数据',
    retry: '点击重试',
    viewAll: '查看全部',
    unit: {
      piece: '件',
      yuan: '¥'
    },
    tip: '提示',
    success: '成功',
    confirm: '确认',
    cancel: '取消',
    delete: '删除',
    edit: '编辑',
    save: '保存',
    loginFirst: '请先登录',
    loginRequired: '您需要登录后才能使用此功能',
    toLogin: '去登录',
    requestFailed: '请求失败',
    networkError: '网络异常，请稍后重试',
    operationFailed: '操作失败，请稍后再试',
    openParenthesis: '（',
    closeParenthesis: '）',
    loadMore: '加载更多...',
    noMoreData: '已经到底啦',
    loadFailed: '加载失败',
    uploading: '上传中...',
    uploadFailed: '上传失败',
    saveSuccess: '保存成功',
    saveFailed: '保存失败'
  },
  
  // 底部导航栏
  tabbar: {
    home: '首页',
    cart: '购物车',
    order: '订单',
    profile: '我的'
  },
  
  // 首页文本
  home: {
    search: {
      placeholder: '搜索饮用水产品'
    },
    nav: {
      allProducts: '全部商品',
      waterKnowledge: '饮水知识',
      promotions: '优惠活动',
      newUserGift: '新人礼包'
    },
    section: {
      hotProducts: '热门产品',
      waterScience: '饮水科普',
      brandStory: '品牌故事'
    },
    product: {
      buy: '购买',
      sold: '已售{count}件',
      tag: {
        hot: '热销',
        new: '新品',
        discount: '优惠'
      }
    },
    article: {
      reads: '{count}阅读',
      shares: '{count}转发',
      tag: {
        health: '饮水健康',
        knowledge: '水质知识',
        tips: '健康提示',
        science: '科普',
        research: '研究',
        lifestyle: '生活方式'
      }
    },
    banner: {
      title1: 'SPRINKLE 纯净水',
      subtitle1: '来自大自然的纯净馈赠',
      title2: 'SPRINKLE 纯净水',
      subtitle2: '富含天然矿物质',
      title3: '健康饮水',
      subtitle3: '每日8杯水，健康每一天'
    },
    promotion: {
      title: '限时优惠',
      description: '新客首单立减5元',
      action: '立即查看'
    },
    brand: {
      title: '品牌故事',
      content: 'SPRINKLE 的水源来自海拔3800米的高山冰川，经过18层过滤和严格的质量控制，为您提供最纯净、健康的饮用水。20年专注饮用水研发，只为您的健康饮水体验。',
      tags: ['0添加', '18层过滤', '天然矿物质', '低钠', '适合婴幼儿'],
      tag1: '0添加',
      tag2: '18层过滤',
      tag3: '天然矿物质',
      tag4: '低钠',
      tag5: '适合婴幼儿'
    },
    takeWay: {
      delivery: '外卖',
      selfPickup: '自取'
    },
    toast: {
      langSwitched: '语言已切换'
    },
    language: {
      switch: '切换语言',
      current: '当前语言'
    }
  },
  
  // 产品相关文本
  product: {
    detail: {
      tab: {
        info: '商品',
        reviews: '评论',
        detail: '详情'
      },
      info: {
        sales: '销量',
        stock: '库存',
        spec: '规格'
      },
      reviews: {
        title: '商品评论',
        write: '写评论',
        empty: '暂无评论，快来抢沙发吧~',
        loadMore: '加载更多评论',
        anonymous: '匿名用户',
        date: '评论日期',
        rating: '评分',
        likeButton: '点赞',
        likeCount: '赞',
        starSymbol: '★'
      },
      error: {
        invalidId: '商品ID无效',
        invalidData: '商品数据无效',
        fetchFailed: '获取商品详情失败，请稍后重试',
        noMoreReviews: '没有更多评论了'
      },
      action: {
        customerService: '客服',
        cart: '购物车',
        addToCart: '加入购物车',
        buyNow: '立即购买'
      },
      msg: {
        addToCartSuccess: '已加入购物车',
        selectSpec: '请选择商品规格',
        likeSuccess: '点赞成功',
        unlikeSuccess: '已取消点赞',
        favoriteAdded: '已加入收藏',
        favoriteRemoved: '已取消收藏'
      },
      addToCart: '加入购物车',
      buyNow: '立即购买',
      stock: '库存',
      sales: '销量',
      price: '价格',
      description: '商品描述',
      specification: '规格参数',
      reviews: '商品评价'
    },
    list: {
      category: {
        all: '全部',
        pure: '纯净水',
        mineral: '矿泉水',
        soda: '苏打水'
      },
      sort: {
        default: '默认',
        sales: '销量',
        priceAsc: '价格↑',
        priceDesc: '价格↓'
      },
      tag: {
        hot: '热销',
        new: '新品',
        discount: '优惠',
        special: '特惠'
      },
      soldCount: '已售{count}件',
      empty: '暂无相关商品',
      addedToCart: '已加入购物车'
    }
  },
  
  // 购物车文本
  cart: {
    title: '购物车',
    empty: '购物车空空如也，去挑选心仪商品吧',
    checkout: '结算',
    selectAll: '全选',
    total: '合计',
    pieces: '共{count}件',
    goShopping: '去逛逛',
    confirmRemove: '确定要移除此商品吗？',
    removeSuccess: '移除成功',
    removeFailed: '移除失败',
    updateFailed: '更新失败',
    addSuccess: '添加成功',
    addFailed: '添加失败，请重试',
    fetchFailed: '获取购物车失败',
    selectFailed: '选择失败',
    selectAllFailed: '全选操作失败',
    selectItemsFirst: '请选择商品',
    navigationFailed: '跳转失败，请重试'
  },
  
  // 订单文本
  order: {
    tab: {
      all: '全部',
      pending: '待付款',
      shipped: '待发货',
      receipt: '待收货',
      completed: '已完成'
    },
    status: {
      pending: '待付款',
      shipped: '待发货',
      receipt: '待收货',
      completed: '已完成',
      canceled: '已取消',
      unknown: '未知状态'
    },
    statusDesc: {
      pending: '请在下单后30分钟内完成支付',
      shipped: '商家正在努力备货中，请耐心等待',
      receipt: '您的订单已发货，请注意查收',
      completed: '感谢您的购买，欢迎再次光临',
      canceled: '订单已取消'
    },
    action: {
      cancel: '取消订单',
      pay: '立即付款',
      viewDetail: '查看详情',
      contactService: '联系客服',
      viewLogistics: '查看物流',
      confirmReceipt: '确认收货',
      delete: '删除订单',
      review: '评价订单',
      buyAgain: '再次购买'
    },
    number: '订单编号',
    createTime: '下单时间',
    totalCount: '共',
    pieces: '件商品',
    totalAmount: '合计',
    shippingFee: '含运费',
    goodsSpec: '规格',
    quantityPrefix: 'x',
    empty: '暂无相关订单',
    goShopping: '去购物',
    addressTitle: '收货地址',
    orderInfoTitle: '订单信息',
    infoTitle: '订单信息',
    goodsInfoTitle: '商品信息',
    goodsAmount: '商品金额',
    discountAmount: '优惠金额',
    deliveryTime: '发货时间',
    completedTime: '完成时间',
    remark: '备注',
    noRemark: '无',
    logistics: {
      title: '物流信息',
      developing: '该功能正在开发中，敬请期待！'
    },
    confirm: {
      cancel: '确定要取消该订单吗？',
      receipt: '确认收到商品吗？',
      delete: '确定要删除该订单吗？删除后不可恢复'
    },
    success: {
      cancel: '订单已取消',
      receipt: '确认收货成功',
      delete: '订单已删除',
      buyAgain: '已添加到购物车'
    },
    payment: {
      amount: '支付金额',
      method: '支付方式',
      wechat: '微信支付',
      alipay: '支付宝',
      unionpay: '银联支付',
      time: '支付时间',
      orderInfo: '订单信息',
      productAmount: '商品金额',
      discountAmount: '优惠金额',
      payAmount: '实付金额',
      confirm: '立即支付',
      processing: '处理支付中',
      success: '支付成功',
      title: '订单支付'
    },
    result: {
      createSuccess: '订单提交成功',
      createDesc: '感谢您的购买，我们将尽快为您安排发货。',
      paySuccess: '支付成功',
      payDesc: '您的支付已成功处理，我们将尽快为您安排发货。',
      cancelTitle: '订单已取消',
      cancelDesc: '您的订单已取消，期待您的下次购买。',
      orderTime: '下单时间',
      orderAmount: '订单金额',
      viewOrder: '查看订单',
      backToHome: '返回首页',
      title: '订单结果'
    },
    confirmPage: {
      productInfo: '商品信息',
      delivery_title: '配送方式',
      delivery_express: '快递配送',
      delivery_selfPickup: '自提',
      payment_title: '支付方式',
      payment_wechat: '微信支付',
      payment_alipay: '支付宝',
      remark: '备注',
      remarkPlaceholder: '在此输入备注信息',
      submit: '提交订单',
      selectAddress: '选择地址',
      changeAddress: '更换地址',
      submitting: '提交中...',
      submitSuccess: '提交成功',
      addressRequired: '请选择收货地址',
      productLoadFailed: '商品加载失败'
    }
  },
  
  // 个人中心
  profile: {
    notLogged: '未登录',
    login: '点击登录',
    loginHint: '点击登录账号',
    logout: '退出登录',
    logoutConfirm: '确定要退出登录吗？',
    logoutSuccess: '已退出登录',
    pleaseLogin: '请先登录',
    settings: '设置',
    order: {
      title: '我的订单',
      all: '全部订单',
      pending: '待付款',
      shipped: '待发货',
      receipt: '待收货',
      review: '待评价'
    },
    menu: {
      address: '收货地址',
      favorite: '我的收藏',
      coupon: '优惠券',
      points: '我的积分',
      service: '联系客服',
      about: '关于我们'
    },
    member: {
      normal: '普通会员',
      bronze: '青铜会员',
      silver: '白银会员',
      gold: '黄金会员',
      platinum: '铂金会员',
      diamond: '钻石会员',
      admin: '管理员'
    },
    points: {
      title: '我的积分',
      balance: '积分余额',
      label: '水滴积分'
    },
    coupon: {
      title: '优惠券',
      count: '张优惠券',
      label: '优惠券'
    },
    edit: {
      avatar: '头像',
      nickname: '昵称',
      nicknamePlaceholder: '请输入昵称',
      phone: '手机号',
      notBound: '未绑定',
      bindPhone: '绑定',
      changePhone: '更换',
      gender: '性别',
      selectGender: '请选择',
      birthday: '生日',
      selectBirthday: '请选择',
      email: '邮箱',
      emailPlaceholder: '请输入邮箱',
      signature: '个性签名',
      signaturePlaceholder: '请输入个性签名',
      male: '男',
      female: '女',
      unknown: '未知',
      nicknameRequired: '请输入昵称',
      invalidEmail: '邮箱格式不正确'
    }
  },
  
  // 会员等级介绍
  memberLevel: {
    title: '会员等级',
    subtitle: '会员特权介绍',
    currentLevel: '当前等级',
    nextLevel: '下一等级',
    pointsToNextLevel: '再获得{points}积分即可升级为{level}',
    maxLevel: '已达最高等级',
    progressTitle: '当前等级进度',
    pointsRequirement: '累计积分达到',
    rules: {
      title: '会员规则说明',
      items: [
        '会员等级根据累计积分自动升级，升级后不会降级',
        '积分获取方式：购物消费(1元=1积分)、活动奖励、邀请好友等',
        '积分可用于商品抵扣、兑换优惠券等',
        '会员特权包括但不限于：专属优惠、免运费、生日礼包等',
        '最终解释权归本平台所有'
      ]
    },
    levels: {
      bronze: {
        name: '青铜会员',
        icon: '🥉',
        points: 0,
        benefits: [
          '商品折扣9.8折',
          '生日礼包',
          '积分兑换商品'
        ]
      },
      silver: {
        name: '白银会员',
        icon: '🥈',
        points: 500,
        benefits: [
          '商品折扣9.5折',
          '生日礼包',
          '积分兑换商品',
          '专属优惠券每月1张'
        ]
      },
      gold: {
        name: '黄金会员',
        icon: '👑',
        points: 1000,
        benefits: [
          '商品折扣9折',
          '生日礼包',
          '积分兑换商品',
          '专属优惠券每月2张',
          '订单满88元免运费'
        ]
      },
      platinum: {
        name: '铂金会员',
        icon: '💎',
        points: 2000,
        benefits: [
          '商品折扣8.5折',
          '豪华生日礼包',
          '积分兑换商品',
          '专属优惠券每月3张',
          '订单满68元免运费',
          '专属客服通道'
        ]
      },
      diamond: {
        name: '钻石会员',
        icon: '💎💎',
        points: 5000,
        benefits: [
          '商品折扣8折',
          '豪华生日礼包',
          '积分兑换商品',
          '专属优惠券每月5张',
          '全场免运费',
          '专属客服通道',
          '限量新品优先购买权',
          '专属会员活动'
        ]
      }
    }
  },
  
  // 积分页面
  points: {
    tab: {
      detail: '积分明细',
      ways: '获取途径',
      exchange: '积分兑换'
    },
    balance: '当前积分',
    label: '可用积分',
    ways: {
      shopping: {
        title: '购物消费',
        desc: '每消费1元获得1积分',
        points: '1积分/元'
      },
      review: {
        title: '评价订单',
        desc: '订单完成后评价可获得积分',
        points: '10积分/次'
      },
      share: {
        title: '分享商品',
        desc: '分享商品给好友',
        points: '5积分/次'
      },
      sign: {
        title: '每日签到',
        desc: '每日签到可获得积分',
        points: '3积分/天'
      }
    },
    records: {
      purchase: {
        mineral: '购买矿泉水',
        pure: '购买纯净水'
      },
      exchange: {
        coupon: '兑换优惠券'
      },
      review: '评价订单'
    },
    empty: '暂无积分记录',
    noExchangeItems: '暂无可兑换商品'
  },
  
  // 收藏页面
  favorite: {
    empty: '收藏列表为空',
    goShopping: '去购物',
    addToCart: '加入购物车',
    remove: '取消收藏',
    sales: '销量：{count}',
    status: {
      unavailable: '已下架',
      outOfStock: '缺货',
      presale: '预售',
      normal: '正常'
    },
    confirm: {
      remove: '确定要取消收藏此商品吗？'
    },
    success: {
      remove: '已取消收藏'
    }
  },
  
  // 优惠券页面
  coupon: {
    tabs: {
      available: '可用',
      used: '已使用',
      expired: '已过期'
    },
    empty: '暂无优惠券',
    use: '立即使用',
    used: '已使用',
    expired: '已过期',
    validPeriod: '有效期至',
    condition: {
      noLimit: '无门槛',
      minConsumption: '满{amount}元可用'
    },
    scope: {
      all: '全场商品可用',
      specified: '指定商品可用'
    },
    toast: {
      selected: '优惠券已选择，请选购商品'
    }
  },
  
  // 地址页面
  address: {
    empty: '暂无收货地址',
    defaultTag: '默认',
    setDefault: '设为默认',
    edit: '编辑',
    delete: '删除',
    add: '新增收货地址',
    confirm: '确认',
    confirmDelete: '确定要删除该地址吗？',
    deleteSuccess: '删除成功',
    deleteFailed: '删除失败',
    setDefaultSuccess: '设置默认地址成功',
    setDefaultFailed: '设置默认地址失败',
    fetchError: '获取地址失败'
  },
  
  // 地址编辑页面
  addressEdit: {
    name: '收货人',
    nameHolder: '请输入收货人姓名',
    phone: '手机号码',
    phoneHolder: '请输入手机号码',
    region: '所在地区',
    regionHolder: '请选择所在地区',
    detail: '详细地址',
    detailHolder: '请输入详细地址信息',
    setDefault: '设为默认地址',
    save: '保存',
    saving: '正在保存...',
    saveSuccess: '保存成功',
    nameRequired: '请输入收货人姓名',
    phoneRequired: '请输入手机号码',
    phoneInvalid: '手机号码格式不正确',
    regionRequired: '请选择所在地区',
    detailRequired: '请输入详细地址'
  },
  
  // 客服中心页面
  service: {
    title: 'SPRINKLE客服中心',
    subtitle: '9:00-18:00 | 周一至周日',
    contactTitle: '联系方式',
    phone: {
      title: '客服电话',
      number: '400-888-8888'
    },
    chat: {
      title: '在线客服',
      desc: '点击开始对话'
    },
    wechat: {
      title: '微信客服',
      desc: '点击进入微信客服会话'
    },
    faqTitle: '常见问题',
    faq: {
      address: {
        question: '如何修改收货地址？',
        answer: '您可以在"我的-收货地址"中添加、编辑或删除收货地址。下单时也可以选择或新增收货地址。'
      },
      shipping: {
        question: '订单支付后多久发货？',
        answer: '正常情况下，我们会在支付成功后24小时内安排发货。如遇特殊情况可能会有所延迟，请以实际物流信息为准。'
      },
      refund: {
        question: '如何申请退款？',
        answer: '您可以在"我的-订单"中找到需要退款的订单，点击"申请退款"操作。根据订单状态不同，可分为"未发货退款"和"已发货退货退款"。'
      },
      coupon: {
        question: '优惠券使用规则是什么？',
        answer: '优惠券有使用门槛（满减金额）和使用有效期，部分优惠券可能限定特定商品使用。使用时请注意查看优惠券详细说明。'
      },
      points: {
        question: '水滴积分如何获取和使用？',
        answer: '您可以通过购物、评价、签到等方式获取积分。积分可在"积分商城"中兑换商品或优惠券，详细规则可查看"我的-水滴积分"页面。'
      }
    }
  },
  
  // 文章列表页
  articleList: {
    title: '饮水科普',
    categories: {
      all: '全部',
      health: '健康知识',
      science: '科普',
      tips: '饮水小贴士'
    },
    loading: '正在加载更多...',
    noMore: '已经到底啦',
    loadMore: '点击加载更多',
    noArticles: '没有找到文章',
    loadFailed: '加载失败，请重试',
    empty: '暂无相关文章',
    viewsLabel: '阅读',
    dateLabel: '发布日期'
  },
  
  // 文章详情相关
  articleDetail: {
    viewsLabel: '阅读',
    sharesLabel: '分享',
    shareButton: '分享',
    relatedArticles: '相关文章',
    homeButton: '首页',
    authorLabel: '作者',
    dateLabel: '发布日期',
    loadingText: '内容加载中...',
    invalidParam: '参数错误',
    notFound: '文章不存在',
    loadFailed: '加载失败，请重试'
  },
  
  // 关于我们页面
  about: {
    slogan: '纯净好水，品质生活',
    version: '版本',
    brandIntro: '品牌介绍',
    brandIntroContent: 'SPRINKLE（喷泉水）是一家专注于高品质饮用水的品牌，致力于为消费者提供健康、安全、纯净的饮用水产品。我们的水源来自海拔3800米的高山冰川，经过18层精密过滤工艺处理，确保每一滴水都达到最高纯净标准。',
    brandPhilosophy: '品牌理念',
    brandPhilosophyContent: '我们相信，好水是健康生活的基础。SPRINKLE不仅仅是一款饮用水产品，更是一种生活态度，传递着对品质生活的追求与对自然环境的尊重。',
    productSeries: '产品系列',
    productSeriesContent: '· SPRINKLE 纯净水：0添加，口感清爽\n· SPRINKLE 矿泉水：富含天然矿物质，营养均衡\n· SPRINKLE 山泉水：源自高山冰川，原生态品质',
    contactUs: '联系我们',
    phone: '客服电话',
    email: '电子邮箱',
    officialStore: '官方商城',
    officialStoreName: 'SPRINKLE官方旗舰店',
    userAgreement: '用户协议',
    privacyPolicy: '隐私政策',
    copySuccess: '已复制到剪贴板'
  },
  
  // 客服聊天页面
  chat: {
    welcomeMessage: '您好，我是SPRINKLE水站客服，很高兴为您服务，请问有什么可以帮助您的？',
    inputPlaceholder: '请输入您的问题',
    send: '发送',
    keywords: {
      delivery: '配送',
      price: '价格',
      refund: '退款',
      address: '地址'
    },
    replies: {
      delivery: '我们的配送时间为上午9点至晚上9点，正常情况下30分钟内送达。如遇特殊情况，可能会有所延迟，请您谅解。',
      price: '我们的纯净水价格为每瓶2元起，具体价格请参考商品详情页。',
      refund: '如需申请退款，请在"我的订单"中找到对应订单，点击"申请退款"按钮进行操作。',
      address: '您可以在个人中心 -> 收货地址中管理您的收货地址。',
      default: '感谢您的咨询，为了更好地解决您的问题，请您提供更多详细信息，或者拨打我们的客服热线400-888-8888获取即时帮助。'
    }
  }
}; 
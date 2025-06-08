/**
 * English text resources
 */
module.exports = {
  // App title
  app: {
    title: 'SPRINKLE Water Shop'
  },
  
  // Page titles
  page: {
    home: 'Home',
    cart: 'Shopping Cart',
    order: 'Orders',
    orderDetail: 'Order Details',
    orderConfirm: 'Confirm Order',
    profile: 'My Profile',
    products: 'Products',
    productDetail: 'Product Details',
    address: 'Shipping Address',
    addressAdd: 'Add Shipping Address',
    addressEdit: 'Edit Shipping Address',
    coupon: 'Coupons',
    favorite: 'My Favorites',
    points: 'My Points',
    service: 'Customer Service',
    about: 'About Us',
    agreement: 'User Agreement',
    article: 'Water Knowledge',
    articleDetail: 'Article Details',
    member: 'Member Center',
    memberLogin: 'Login',
    memberRegister: 'Register',
    promotion: 'Promotions',
    login: 'Login',
    profileEdit: 'Edit Profile'
  },
  
  // Login page text
  login: {
    title: 'SPRINKLE Water Shop',
    subtitle: 'Account Login',
    username: 'Please enter username',
    password: 'Please enter password',
    loginButton: 'Login',
    wechatLogin: 'WeChat Login',
    forgotPassword: 'Forgot Password',
    forgotPasswordTip: 'Please contact customer service to reset password',
    register: 'Register Account',
    agreement: 'By logging in, you agree to',
    userAgreement: 'User Agreement',
    userAgreementContent: 'Welcome to SPRINKLE Water Shop! This agreement is established between you and SPRINKLE Water Shop regarding your use of our services. By using our services, you agree to all terms of this agreement.',
    privacyPolicy: 'Privacy Policy',
    privacyPolicyContent: 'We take your personal information and privacy protection very seriously. We collect your login information, shopping information, etc. to provide better services. We promise to strictly protect your personal information and will not disclose it to third parties.',
    and: 'and',
    iHaveRead: 'I have read',
    authTitle: 'Authorization Notice',
    authConfirm: 'Agree',
    authCancel: 'Cancel',
    wechatDesc: 'To improve member profile',
    errorMessages: {
      inputRequired: 'Please enter username and password',
      usernameRequired: 'Please enter username',
      passwordRequired: 'Please enter password',
      loginFailed: 'Login failed, please try again',
      networkError: 'Network error, please try again later',
      privacyPolicyRequired: 'You need to agree to the privacy policy to complete login'
    },
    successMessage: 'Login successful'
  },

  // Register page text
  register: {
    title: 'Create Account',
    subtitle: 'Join SPRINKLE Water Shop',
    username: 'Set username (at least 4 characters)',
    password: 'Set password (at least 6 digits)',
    confirmPassword: 'Confirm password',
    phone: 'Enter phone number (optional)',
    wechatRegister: 'WeChat Register',
    registerButton: 'Register',
    agreePolicy: 'I have read and agree to',
    userAgreement: 'User Agreement',
    privacyPolicy: 'Privacy Policy',
    and: 'and',
    or: 'or',
    hasAccount: 'Already have an account?',
    toLogin: 'Login',
    authTitle: 'Authorization Notice',
    authContent: 'Registration means you agree to User Agreement and Privacy Policy.',
    authConfirm: 'Agree',
    authCancel: 'Cancel',
    wechatDesc: 'To improve member profile',
    errorMessages: {
      usernameRequired: 'Please enter username',
      usernameTooShort: 'Username must be at least 4 characters',
      passwordRequired: 'Please enter password',
      passwordTooShort: 'Password must be at least 6 digits',
      confirmPasswordRequired: 'Please confirm password',
      passwordMismatch: 'Password confirmation does not match',
      phoneInvalid: 'Please enter a valid phone number',
      policyRequired: 'Please read and agree to User Agreement and Privacy Policy',
      networkError: 'Network error, please try again later',
      registrationFailed: 'Registration failed, please try again',
      usernameExists: 'Username already exists, please choose another',
      wechatLoginFailed: 'Failed to get WeChat login credentials',
      getUserInfoFailed: 'Failed to get user info, please try again',
      privacyPolicyRequired: 'You need to agree to the privacy policy to complete registration'
    },
    successMessage: 'Registration successful',
    loginSuccessMessage: 'Login successful'
  },
  
  // Common texts
  common: {
    loading: 'Loading...',
    error: 'Network error, please try again later',
    empty: 'No data available',
    retry: 'Tap to retry',
    viewAll: 'View All',
    unit: {
      piece: 'pcs',
      yuan: '$'
    },
    tip: 'Tip',
    success: 'Success',
    confirm: 'Confirm',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    save: 'Save',
    loginFirst: 'Please login first',
    loginRequired: 'You need to login first to use this feature',
    toLogin: 'Login',
    requestFailed: 'Request failed',
    networkError: 'Network error, please try again later',
    operationFailed: 'Operation failed, please try again later',
    openParenthesis: '(',
    closeParenthesis: ')',
    loadMore: 'Loading more...',
    noMoreData: 'No more products',
    loadFailed: 'Load failed',
    uploading: 'Uploading...',
    uploadFailed: 'Upload failed',
    saveSuccess: 'Save successful',
    saveFailed: 'Save failed',
    loginExpired: 'Login expired',
    year: 'A.D.',
    month: 'M',
    day: 'DT'
  },
  
  // Bottom navigation bar
  tabbar: {
    home: 'Home',
    shop: 'Shop',
    cart: 'Cart',
    order: 'Orders',
    profile: 'Me'
  },
  
  // Home page texts
  home: {
    search: {
      placeholder: 'Search water products'
    },
    nav: {
      allProducts: 'Products',
      waterKnowledge: 'Knowledge',
      promotions: 'Promotions',
      newUserGift: 'Gift'
    },
    section: {
      hotProducts: 'Hot Products',
      waterScience: 'Water Science',
      brandStory: 'Brand Story'
    },
    product: {
      buy: 'Buy',
      sold: '{count} sold',
      tag: {
        hot: 'Hot',
        new: 'New',
        discount: 'Sale'
      }
    },
    article: {
      reads: '{count} reads',
      shares: '{count} shares',
      tag: {
        health: 'Water Health',
        knowledge: 'Water Quality',
        tips: 'Health Tips',
        science: 'Science',
        research: 'Research',
        lifestyle: 'Lifestyle'
      }
    },
    banner: {
      title1: 'SPRINKLE Pure Water',
      subtitle1: 'Pure gift from nature',
      title2: 'SPRINKLE Pure Water',
      subtitle2: 'Rich in natural minerals',
      title3: 'Healthy Hydration',
      subtitle3: '8 glasses a day keeps the doctor away'
    },
    promotion: {
      title: 'Limited Time Offer',
      description: 'New user first order $5 off',
      action: 'View Now'
    },
    brand: {
      title: 'Brand Story',
      content: 'SPRINKLE water comes from glaciers at 3800 meters altitude, processed through 18 layers of filtration and strict quality control to provide you the purest and healthiest drinking water. 20 years focused on drinking water research, just for your healthy drinking experience.',
      tags: ['0 Additives', '18 Filtration Layers', 'Natural Minerals', 'Low Sodium', 'Infant Friendly'],
      tag1: '0 Additives',
      tag2: '18 Filtration Layers',
      tag3: 'Natural Minerals',
      tag4: 'Low Sodium',
      tag5: 'Infant Friendly'
    },
    takeWay: {
      delivery: 'Delivery',
      selfPickup: 'Self Pickup'
    },
    toast: {
      langSwitched: 'Language switched'
    },
    language: {
      switch: 'Switch Language',
      current: 'Current Language'
    }
  },
  
  // Product related texts
  product: {
    detail: {
      tab: {
        info: 'Product',
        reviews: 'Reviews',
        detail: 'Details'
      },
      info: {
        sales: 'Sales',
        stock: 'Stock',
        spec: 'Specification'
      },
      reviews: {
        title: 'Product Reviews',
        write: 'Write Review',
        empty: 'No reviews yet, be the first to review!',
        loadMore: 'Load More Reviews',
        anonymous: 'Anonymous User',
        date: 'Review Date',
        rating: 'Rating',
        likeButton: 'Like',
        likeCount: 'likes',
        starSymbol: '★'
      },
      error: {
        invalidId: 'Invalid product ID',
        invalidData: 'Invalid product data',
        fetchFailed: 'Failed to get product details, please try again later',
        noMoreReviews: 'No more reviews'
      },
      action: {
        customerService: 'Support',
        cart: 'Cart',
        addToCart: 'Add to Cart',
        buyNow: 'Buy Now'
      },
      msg: {
        addToCartSuccess: 'Added to Cart',
        selectSpec: 'Please select a specification',
        likeSuccess: 'Liked successfully',
        unlikeSuccess: 'Unliked successfully',
        favoriteAdded: 'Added to favorites',
        favoriteRemoved: 'Removed from favorites'
      },
      addToCart: 'Add to Cart',
      buyNow: 'Buy Now',
      stock: 'Stock',
      sales: 'Sales',
      price: 'Price',
      description: 'Description',
      specification: 'Specifications',
      reviews: 'Reviews'
    },
    list: {
      category: {
        all: 'All',
        pure: 'Pure Water',
        mineral: 'Mineral Water',
        soda: 'Soda Water'
      },
      sort: {
        default: 'Default',
        sales: 'Sales',
        priceAsc: 'Price ↑',
        priceDesc: 'Price ↓'
      },
      tag: {
        hot: 'Hot',
        new: 'New',
        discount: 'Sale',
        special: 'Special'
      },
      soldCount: '{count} sold',
      soldPrefix: '',
      soldSuffix: 'sold',
      empty: 'No products found',
      addedToCart: 'Added to cart',
      buyNow: 'Buy Now'
    }
  },
  
  // Cart texts
  cart: {
    title: 'Shopping Cart',
    empty: 'Your cart is empty, go find something you like',
    checkout: 'Checkout',
    selectAll: 'Select All',
    total: 'Total',
    pieces: '{count} items',
    goShopping: 'Go Shopping',
    confirmRemove: 'Are you sure you want to remove this item?',
    removeSuccess: 'Removed successfully',
    removeFailed: 'Failed to remove',
    updateFailed: 'Failed to update',
    addSuccess: 'Added successfully',
    addFailed: 'Failed to add, please try again',
    fetchFailed: 'Failed to fetch cart',
    selectFailed: 'Selection failed',
    selectAllFailed: 'Select all operation failed',
    selectItemsFirst: 'Please select items first',
    navigationFailed: 'Navigation failed, please try again'
  },
  
  // Order texts
  order: {
    status: {
      unknown: 'Unknown Status',
      pending: 'Pending Payment',
      shipped: 'Pending Shipment',
      receipt: 'Pending Receipt',
      completed: 'Completed',
      cancelled: 'Cancelled',
      canceled: 'Cancelled'
    },
    statusDesc: {
      pending: 'Please complete payment within 30 minutes of placing your order',
      shipped: 'The merchant is preparing your order, please wait patiently',
      receipt: 'Your order has been shipped, please check for delivery',
      completed: 'Thank you for your purchase, welcome back',
      canceled: 'Order has been cancelled'
    },
    tab: {
      all: 'All',
      pending: 'To Pay',
      shipped: 'To Ship',
      receipt: 'To Receive',
      completed: 'Completed'
    },
    action: {
      cancel: 'Cancel',
      pay: 'Pay Now',
      viewDetail: 'View Details',
      contactService: 'Contact Service',
      viewLogistics: 'View Logistics',
      confirmReceipt: 'Confirm Receipt',
      delete: 'Delete Order',
      review: 'Review Order',
      buyAgain: 'Buy Again'
    },
    number: 'Order No.',
    createTime: 'Order Time',
    totalCount: '',
    pieces: ' items',
    totalAmount: 'Total',
    shippingFee: 'Incl. Shipping',
    goodsSpec: 'Spec.',
    quantityPrefix: 'x',
    empty: 'No Orders',
    goShopping: 'Go Shopping',
    addressTitle: 'Shipping Address',
    orderInfoTitle: 'Order Information',
    infoTitle: 'Order Information',
    goodsInfoTitle: 'Product Information',
    goodsAmount: 'Product Amount',
    couponLabel: 'Coupon Used',
    discountAmount: 'Discount Amount',
    deliveryTime: 'Shipping Time',
    completedTime: 'Completion Time',
    remark: 'Remarks',
    noRemark: 'None',
    logisticsInDev: 'This feature is under development, please stay tuned!',
    itemCount: '{count} items',
    cancelConfirm: 'Are you sure you want to cancel this order?',
    cancelSuccess: 'Order cancelled',
    cancelFailed: 'Failed to cancel order',
    fetchFailed: 'Failed to get order list',
    confirmReceiptTip: 'Confirm that you have received the goods?',
    confirmSuccess: 'Receipt confirmed',
    confirmFailed: 'Failed to confirm receipt',
    orderNumber: 'Order No.',
    deleteConfirm: 'Are you sure you want to delete this order? This cannot be undone.',
    deleteSuccess: 'Deleted successfully',
    deleteFailed: 'Failed to delete',
    addToCartSuccess: 'Items added to cart',
    addToCartFailed: 'Failed to add to cart',
    noOrderItems: 'No items in this order',
    fetchDetailFailed: 'Failed to get order details',
    goToCart: 'Go to Cart',
    payment: {
      amount: 'Payment Amount',
      method: 'Payment Method',
      wechat: 'WeChat Pay',
      alipay: 'Alipay',
      unionpay: 'UnionPay',
      time: 'Payment Time',
      orderInfo: 'Order Information',
      productAmount: 'Product Amount',
      discountAmount: 'Discount Amount',
      shippingFee: 'Shipping Fee',
      payAmount: 'Payment Amount',
      confirm: 'Pay Now',
      processing: 'Processing Payment',
      success: 'Payment Successful',
      title: 'Payment'
    },
    result: {
      createSuccess: 'Order Submitted Successfully',
      createDesc: 'Thank you for your purchase. We will arrange delivery as soon as possible.',
      paySuccess: 'Payment Successful',
      payDesc: 'Your payment has been processed successfully. We will arrange delivery as soon as possible.',
      cancelTitle: 'Order Cancelled',
      cancelDesc: 'Your order has been cancelled. We look forward to your next purchase.',
      orderTime: 'Order Time',
      orderAmount: 'Order Amount',
      viewOrder: 'View Order',
      backToHome: 'Back to Home',
      title: 'Order Result'
    },
    confirmPage: {
      productInfo: 'Product Information',
      delivery_title: 'Delivery Method',
      delivery_express: 'Express Delivery',
      delivery_selfPickup: 'Self Pickup',
      payment_title: 'Payment Method',
      payment_wechat: 'WeChat Pay',
      payment_alipay: 'Alipay',
      remark: 'Remarks',
      remarkPlaceholder: 'Enter remarks here',
      submit: 'Submit Order',
      selectAddress: 'Select Address',
      changeAddress: 'Change Address',
      submitting: 'Submitting...',
      submitSuccess: 'Submission Successful',
      addressRequired: 'Please select a shipping address',
      productLoadFailed: 'Failed to load product',
      creatingOrder: 'Creating order...',
      createOrderFailed: 'Failed to create order',
      orderPlacedAwaitingPayment: 'Order placed, awaiting payment',
      couponTitle: 'Coupons',
      selectCoupon: 'Select Coupon',
      couponAvailable: ' available',
      originalPrice: 'Original Price',
      discount: 'Discount',
      couponCondition: 'Min. $',
      couponConditionSuffix: ' required',
      couponDefaultDesc: 'Valid for all products',
      couponExpire: 'Valid until',
      noCoupon: 'No coupons available',
      notUseCoupon: 'Don\'t use coupon'
    },
    confirm: {
      cancel: 'Are you sure you want to cancel this order?',
      receipt: 'Confirm that you have received the goods?',
      delete: 'Are you sure you want to delete this order? This cannot be undone.'
    },
    success: {
      cancel: 'Order cancelled',
      receipt: 'Receipt confirmed successfully',
      delete: 'Order deleted',
      buyAgain: 'Added to cart'
    }
  },
  
  // Profile center
  profile: {
    notLogged: 'Not Logged In',
    login: 'Tap to Login',
    loginHint: 'Tap to login',
    logout: 'Logout',
    logoutConfirm: 'Are you sure you want to logout?',
    logoutSuccess: 'Logged out successfully',
    pleaseLogin: 'Please login first',
    settings: 'Settings',
    order: {
      title: 'My Orders',
      all: 'All Orders',
      pending: 'To Pay',
      shipped: 'To Ship',
      receipt: 'To Receive',
      review: 'To Review'
    },
    menu: {
      address: 'Shipping Address',
      favorite: 'My Favorites',
      coupon: 'Coupons',
      points: 'My Points',
      service: 'Customer Service',
      about: 'About Us'
    },
    member: {
      normal: 'Regular',
      bronze: 'Bronze',
      silver: 'Silver',
      gold: 'Gold',
      platinum: 'Platinum',
      diamond: 'Diamond',
      admin: 'Administrator'
    },
    points: {
      title: 'My Points',
      balance: 'Current Points',
      label: 'Available Points'
    },
    coupon: {
      title: 'Coupons',
      count: 'coupons',
      label: 'Coupons'
    },
    edit: {
      avatar: 'Avatar',
      nickname: 'Nickname',
      nicknamePlaceholder: 'Enter nickname',
      phone: 'Phone Number',
      notBound: 'Not bound',
      bindPhone: 'Bind',
      changePhone: 'Change',
      gender: 'Gender',
      selectGender: 'Please select',
      birthday: 'Birthday',
      selectBirthday: 'Please select',
      email: 'Email',
      emailPlaceholder: 'Enter email address',
      signature: 'Signature',
      signaturePlaceholder: 'Enter personal signature',
      male: 'Male',
      female: 'Female',
      unknown: 'Unknown',
      nicknameRequired: 'Please enter nickname',
      invalidEmail: 'Invalid email format',
      birthdaySelected: 'Birthday selected'
    }
  },
  
  // Member level introduction
  memberLevel: {
    title: 'Member Levels',
    subtitle: 'Member Benefits',
    currentLevel: 'Current Level',
    nextLevel: 'Next Level',
    pointsToNextLevel: 'Get {points} more points to upgrade to {level}',
    maxLevel: 'Highest level reached',
    progressTitle: 'Current level progress',
    pointsRequirement: 'Points required:',
    rules: {
      title: 'Membership Rules',
      items: [
        'Membership levels are automatically upgraded based on accumulated points and will not be downgraded',
        'Ways to earn points: shopping ($1 = 1 point), activity rewards, inviting friends, etc.',
        'Points can be used for product discounts, coupon exchanges, etc.',
        'Member benefits include but are not limited to: exclusive discounts, free shipping, birthday gifts, etc.',
        'The platform reserves the right for final interpretation'
      ]
    },
    levels: {
      bronze: {
        name: 'Bronze',
        icon: '🥉',
        points: 0,
        benefits: [
          '2% discount on products',
          'Birthday gift',
          'Points redemption'
        ]
      },
      silver: {
        name: 'Silver',
        icon: '🥈',
        points: 500,
        benefits: [
          '5% discount on products',
          'Birthday gift',
          'Points redemption',
          '1 exclusive coupon monthly'
        ]
      },
      gold: {
        name: 'Gold',
        icon: '👑',
        points: 1000,
        benefits: [
          '10% discount on products',
          'Birthday gift',
          'Points redemption',
          '2 exclusive coupons monthly',
          'Free shipping on orders over $88'
        ]
      },
      platinum: {
        name: 'Platinum',
        icon: '💎',
        points: 2000,
        benefits: [
          '15% discount on products',
          'Deluxe birthday gift',
          'Points redemption',
          '3 exclusive coupons monthly',
          'Free shipping on orders over $68',
          'VIP customer service'
        ]
      },
      diamond: {
        name: 'Diamond',
        icon: '💎💎',
        points: 5000,
        benefits: [
          '20% discount on products',
          'Deluxe birthday gift',
          'Points redemption',
          '5 exclusive coupons monthly',
          'Free shipping on all orders',
          'VIP customer service',
          'Priority access to new products',
          'Exclusive member events'
        ]
      }
    }
  },
  
  // Points page
  points: {
    tab: {
      detail: 'Points Details',
      ways: 'Ways to Earn',
      exchange: 'Points Exchange'
    },
    balance: 'Current Points',
    label: 'Available Points',
    ways: {
      shopping: {
        title: 'Shopping',
        desc: 'Earn 1 point per $1 spent',
        points: '1 point/$1'
      },
      review: {
        title: 'Order Review',
        desc: 'Earn points after reviewing orders',
        points: '10 points/review'
      },
      share: {
        title: 'Share Products',
        desc: 'Share products with friends',
        points: '5 points/share'
      },
      sign: {
        title: 'Daily Check-in',
        desc: 'Check in daily to earn points',
        points: '3 points/day'
      }
    },
    records: {
      purchase: {
        mineral: 'Mineral Water Purchase',
        pure: 'Pure Water Purchase'
      },
      exchange: {
        coupon: 'Coupon Exchange'
      },
      review: 'Order Review'
    },
    empty: 'No points records',
    noExchangeItems: 'No items available for exchange'
  },
  
  // Favorites page
  favorite: {
    empty: 'No favorite items',
    goShopping: 'Browse All Products',
    addToCart: 'Add to Cart',
    remove: 'Remove',
    confirmRemove: 'Remove from favorites?',
    removeSuccess: 'Removed from favorites',
    sales: 'Sales',
    status: {
      unavailable: 'Unavailable',
      outOfStock: 'Out of Stock',
      presale: 'Pre-sale',
      normal: 'Available'
    }
  },
  
  // Coupon page
  coupon: {
    tabs: {
      available: 'Available',
      used: 'Used',
      expired: 'Expired'
    },
    empty: 'No coupons available',
    use: 'Use Now',
    used: 'Used',
    expired: 'Expired',
    validPeriod: 'Valid until',
    condition: {
      noLimit: 'No minimum',
      minConsumption: 'Orders over ${amount}'
    },
    scope: {
      all: 'All products',
      specified: 'Selected products'
    },
    toast: {
      selected: 'Coupon selected, continue shopping'
    }
  },
  
  // Address page
  address: {
    empty: 'No shipping address yet',
    defaultTag: 'Default',
    setDefault: 'Set as Default',
    edit: 'Edit',
    delete: 'Delete',
    add: 'Add New Address',
    confirm: 'Confirm',
    confirmDelete: 'Are you sure you want to delete this address?',
    deleteSuccess: 'Successfully deleted',
    deleteFailed: 'Failed to delete',
    setDefaultSuccess: 'Default address set successfully',
    setDefaultFailed: 'Failed to set default address',
    fetchError: 'Failed to fetch addresses'
  },
  
  // Address edit page
  addressEdit: {
    name: 'Recipient',
    nameHolder: 'Enter recipient name',
    phone: 'Phone Number',
    phoneHolder: 'Enter phone number',
    region: 'Region',
    regionHolder: 'Select your region',
    detail: 'Detailed Address',
    detailHolder: 'Enter detailed address information',
    setDefault: 'Set as default address',
    save: 'Save',
    saving: 'Saving...',
    saveSuccess: 'Saved successfully',
    nameRequired: 'Please enter recipient name',
    phoneRequired: 'Please enter phone number',
    phoneInvalid: 'Invalid phone number format',
    regionRequired: 'Please select your region',
    detailRequired: 'Please enter detailed address'
  },
  
  // Customer service page
  service: {
    title: 'SPRINKLE Customer Service',
    subtitle: '9:00-18:00 | Mon to Sun',
    contactTitle: 'Contact Methods',
    phone: {
      title: 'Customer Service',
      number: '400-888-8888'
    },
    chat: {
      title: 'Online Service',
      desc: 'Click to start a conversation'
    },
    wechat: {
      title: 'WeChat Service',
      desc: 'Click to enter WeChat service'
    },
    faqTitle: 'FAQ',
    faq: {
      address: {
        question: 'How do I modify my shipping address?',
        answer: 'You can add, edit or delete shipping addresses in "My Profile - Shipping Address". You can also select or add a new shipping address when placing an order.'
      },
      shipping: {
        question: 'How long does it take to ship after payment?',
        answer: 'Normally, we will arrange shipment within 24 hours after successful payment. There may be delays in special circumstances, please refer to the actual logistics information.'
      },
      refund: {
        question: 'How do I apply for a refund?',
        answer: 'You can find the order that needs a refund in "My Profile - Orders" and click "Apply for Refund". Depending on the order status, it can be divided into "Refund Before Shipping" and "Return and Refund After Shipping".'
      },
      coupon: {
        question: 'What are the rules for using coupons?',
        answer: 'Coupons have usage thresholds (minimum amount) and validity periods. Some coupons may be limited to specific products. Please pay attention to the detailed description of the coupon when using it.'
      },
      points: {
        question: 'How to earn and use Water Drop points?',
        answer: 'You can earn points through shopping, reviews, check-ins, etc. Points can be exchanged for products or coupons in the "Points Mall". For detailed rules, please check the "My Profile - Water Drop Points" page.'
      }
    }
  },
  
  // Article list page
  articleList: {
    title: 'Water Knowledge',
    categories: {
      all: 'All',
      health: 'Health Knowledge',
      science: 'Science',
      tips: 'Drinking Tips'
    },
    loading: 'Loading more...',
    noMore: 'No more articles',
    loadMore: 'Load More',
    noArticles: 'No articles found',
    loadFailed: 'Failed to load, please try again',
    empty: 'No articles available',
    viewsLabel: 'Views',
    dateLabel: 'Published on'
  },
  
  // Article detail related
  articleDetail: {
    viewsLabel: 'Views',
    sharesLabel: 'Shares',
    shareButton: 'Share',
    relatedArticles: 'Related Articles',
    homeButton: 'Home',
    authorLabel: 'Author',
    dateLabel: 'Published on',
    loadingText: 'Loading content...',
    invalidParam: 'Invalid parameter',
    notFound: 'Article not found',
    loadFailed: 'Failed to load, please try again'
  },
  
  // About Us page
  about: {
    slogan: 'Pure Water, Quality Life',
    version: 'Version',
    brandIntro: 'Brand Introduction',
    brandIntroContent: 'SPRINKLE is a brand focused on high-quality drinking water, dedicated to providing consumers with healthy, safe, and pure drinking water products. Our water source comes from glaciers at an altitude of 3800 meters, processed through 18 layers of precision filtration technology to ensure every drop meets the highest purity standards.',
    brandPhilosophy: 'Brand Philosophy',
    brandPhilosophyContent: 'We believe that good water is the foundation of a healthy life. SPRINKLE is not just a drinking water product, but also a lifestyle, conveying the pursuit of quality living and respect for the natural environment.',
    productSeries: 'Product Series',
    productSeriesContent: '· SPRINKLE Pure Water: 0 additives, refreshing taste\n· SPRINKLE Mineral Water: Rich in natural minerals, balanced nutrition\n· SPRINKLE Spring Water: From high mountain glaciers, original ecological quality',
    contactUs: 'Contact Us',
    phone: 'Customer Service',
    email: 'Email',
    officialStore: 'Official Store',
    officialStoreName: 'SPRINKLE Official Flagship Store',
    userAgreement: 'User Agreement',
    privacyPolicy: 'Privacy Policy',
    copySuccess: 'Copied to clipboard'
  },
  
  // Customer Service Chat page
  chat: {
    welcomeMessage: 'Hello, I am SPRINKLE Water Station customer service. I am glad to serve you. How can I help you?',
    inputPlaceholder: 'Please enter your question',
    send: 'Send',
    keywords: {
      delivery: 'delivery',
      price: 'price',
      refund: 'refund',
      address: 'address'
    },
    replies: {
      delivery: 'Our delivery time is from 9 a.m. to 9 p.m., normally delivered within 30 minutes. In case of special circumstances, there may be delays, thank you for your understanding.',
      price: 'Our pure water price starts from $0.30 per bottle. For specific prices, please refer to the product details page.',
      refund: 'To apply for a refund, please find the corresponding order in "My Orders" and click the "Apply for Refund" button to proceed.',
      address: 'You can manage your shipping addresses in Personal Center -> Shipping Address.',
      default: 'Thank you for your inquiry. To better solve your problem, please provide more detailed information, or call our customer service hotline 400-888-8888 for immediate assistance.'
    }
  }
};
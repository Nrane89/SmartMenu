export const translations = {
  hy: {
    // MenuPage
    live: 'Ուղիղ',
    table: 'Սеghан',
    searchPlaceholder: 'Orphonel utestner...',
    allCategory: 'Bolorq',
    itemsCount: (n) => `${n} utestner`,
    searchResults: (q) => ` «${q}»-i arjunqner`,
    filter: 'Filter',
    noItems: 'Voch mi utestner chi gtanvel',
    clearFilter: 'Maqrel filter-y',
    // ItemModal
    rating: 'Gnahatacan',
    prepTime: 'Patrастман жам',
    calories: 'Kaloriya',
    addToCart: 'Avelacnel zambuyugh',
    total: 'Kentamenes',
    spicy: 'Кцу',
    // Cart
    cart: 'Zambuyugh',
    cartEmpty: 'Zambuyughy datark e',
    cartEmptyDesc: 'Avelacru utestner menyu-ic',
    orderTotal: 'Endhameny',
    checkout: 'Varchel patver',
    // Payment
    paymentTitle: 'Varchutyun',
    paymentDesc: 'Nerkayacru varchutyuny sеghani mоt',
    payOnDelivery: 'Varchel matucmany jam',
    payByCard: 'Varchel kartov',
    confirmOrder: 'Hаstatel patver',
    // Success
    successTitle: 'Patver@ yndunvac e!',
    successDesc: 'Khohanocy patrastum e dzez patveры',
    trackOrder: 'Hetevum em patveрин',
    // KDS
    kitchenDisplay: 'Khohаnoцi Ekran',
    active: 'Ákтiv',
    ready: 'Раtrasт',
    done: 'Avartvac',
    all: 'Bolorq',
    startPreparing: 'Sksel Patrаstel',
    markReady: 'Patrast e',
    markDelivered: 'Matuсvac',
    newOrder: 'Nor Patver',
    // Admin
    adminPanel: 'Кáravarchutyun',
    logout: 'Ел',
    // Login
    loginTitle: 'Motnel vanery',
    restaurantId: 'Restоrаni ID',
    username: 'Loginanun',
    password: 'Гахтnabar',
    loginBtn: 'Motnel',
    loginAsSuper: 'Motnel vorpes Super-admin →',
  },

  ru: {
    // MenuPage
    live: 'В эфире',
    table: 'Стол',
    searchPlaceholder: 'Поиск блюд...',
    allCategory: 'Все',
    itemsCount: (n) => `${n} блюд`,
    searchResults: (q) => ` по запросу «${q}»`,
    filter: 'Фильтр',
    noItems: 'Ничего не найдено',
    clearFilter: 'Сбросить фильтр',
    // ItemModal
    rating: 'Рейтинг',
    prepTime: 'Время готовки',
    calories: 'Калории',
    addToCart: 'Добавить в корзину',
    total: 'Итого',
    spicy: 'Острое',
    // Cart
    cart: 'Корзина',
    cartEmpty: 'Корзина пуста',
    cartEmptyDesc: 'Добавьте блюда из меню',
    orderTotal: 'Итого',
    checkout: 'Оформить заказ',
    // Payment
    paymentTitle: 'Оплата',
    paymentDesc: 'Выберите способ оплаты',
    payOnDelivery: 'Оплатить при подаче',
    payByCard: 'Оплатить картой',
    confirmOrder: 'Подтвердить заказ',
    // Success
    successTitle: 'Заказ принят!',
    successDesc: 'Кухня уже готовит ваш заказ',
    trackOrder: 'Слежу за заказом',
    // KDS
    kitchenDisplay: 'Экран кухни',
    active: 'Активные',
    ready: 'Готово',
    done: 'Выполнено',
    all: 'Все',
    startPreparing: '🔥 Начать готовить',
    markReady: '✅ Готово',
    markDelivered: '🛎 Подано',
    newOrder: 'Новый заказ',
    // Admin
    adminPanel: 'Панель управления',
    logout: 'Выйти',
    // Login
    loginTitle: 'Вход в панель',
    restaurantId: 'ID ресторана',
    username: 'Логин',
    password: 'Пароль',
    loginBtn: 'Войти',
    loginAsSuper: 'Войти как Супер-админ →',
  },

  en: {
    // MenuPage
    live: 'Live',
    table: 'Table',
    searchPlaceholder: 'Search dishes...',
    allCategory: 'All',
    itemsCount: (n) => `${n} dishes`,
    searchResults: (q) => ` for «${q}»`,
    filter: 'Filter',
    noItems: 'No items found',
    clearFilter: 'Clear filter',
    // ItemModal
    rating: 'Rating',
    prepTime: 'Prep time',
    calories: 'Calories',
    addToCart: 'Add to cart',
    total: 'Total',
    spicy: 'Spicy',
    // Cart
    cart: 'Cart',
    cartEmpty: 'Cart is empty',
    cartEmptyDesc: 'Add dishes from the menu',
    orderTotal: 'Total',
    checkout: 'Place order',
    // Payment
    paymentTitle: 'Payment',
    paymentDesc: 'Choose payment method',
    payOnDelivery: 'Pay on delivery',
    payByCard: 'Pay by card',
    confirmOrder: 'Confirm order',
    // Success
    successTitle: 'Order confirmed!',
    successDesc: 'The kitchen is preparing your order',
    trackOrder: 'Track my order',
    // KDS
    kitchenDisplay: 'Kitchen Display',
    active: 'Active',
    ready: 'Ready',
    done: 'Done',
    all: 'All',
    startPreparing: '🔥 Start Preparing',
    markReady: '✅ Mark Ready',
    markDelivered: '🛎 Delivered',
    newOrder: 'New Order',
    // Admin
    adminPanel: 'Admin Panel',
    logout: 'Logout',
    // Login
    loginTitle: 'Sign in',
    restaurantId: 'Restaurant ID',
    username: 'Username',
    password: 'Password',
    loginBtn: 'Sign in',
    loginAsSuper: 'Sign in as Super Admin →',
  },
}

const LANG_KEY = 'sm_lang'

export function getLang() {
  return localStorage.getItem(LANG_KEY) || 'hy'
}

export function setLang(lang) {
  localStorage.setItem(LANG_KEY, lang)
  window.dispatchEvent(new Event('lang-change'))
}

export function t(key, arg) {
  const lang = getLang()
  const val = translations[lang]?.[key] || translations['hy'][key] || key
  return typeof val === 'function' ? val(arg) : val
}

export const LANGS = [
  { code: 'hy', label: 'ՀԱՅ', flag: '🇦🇲' },
  { code: 'ru', label: 'РУС', flag: '🇷🇺' },
  { code: 'en', label: 'ENG', flag: '🇬🇧' },
]

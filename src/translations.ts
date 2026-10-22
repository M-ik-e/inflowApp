export type LangCode = 'RU' | 'EN';

export interface LocaleTokens {
    empty_users_list: string;
    deleteUser: string;
    changeARole: string;
    account_creation: string;
    add_a_user: string;
    deleteAccount: string;
    changePassword: string;
    users: string;
    profile: string;
    accounts: string;
    WelcomeName: string;
    dashBoardOverview: string;
    tools: string;
    settings: string;
    logoutBtn: string;
    authWindowTitle: string;
    authWindowDesc: string;
    authWindowSubmit: string;
    fieldName: string;
    fieldPhone: string;
    fieldEmail: string;
    fieldPassword: string;
    fieldSubmitBtn: string;
    modalSubmit: string;
    modalTitle: string;
    modalDesc: string;
    modalNamePlaceholder: string;
    modalPhonePlaceholder: string;
    modalSubmitBtn: string;
    modalCloseBtn: string;
    getAnPersonalOffer: string;
    support: string;
    badge: string;
    headingMain: string;
    headingHighlight: string;
    desc: string;
    passwordPlaceholder: string;
    loginBtn: string;
    demoDisclaimer: string;
    footerRights: string;
    madeIn: string;
}

export const dictionary: Record<LangCode, LocaleTokens> = {
  RU: {
    WelcomeName: 'Добро пожаловать',
    authWindowTitle: 'Авторизация',
    authWindowDesc: 'Пожалуйста, войдите в свою учетную запись:',
    authWindowSubmit: 'Войти',
    fieldName: 'Имя',
    fieldPhone: 'Телефон',
    fieldEmail: 'Электронная почта',
    fieldPassword: 'Пароль',
    fieldSubmitBtn: 'Отправить',
    modalSubmit: 'Отправить',
    modalTitle: 'Запрос на демо',
    modalDesc: 'Пожалуйста, заполните следующую информацию:',
    modalNamePlaceholder: 'Ваше имя',
    modalPhonePlaceholder: 'Номер телефона',
    modalSubmitBtn: 'Отправить запрос',
    modalCloseBtn: 'Закрыть',
    getAnPersonalOffer: 'Зарегестрируйся и получи демо',
    support: 'Поддержка',
    badge: 'Возврат клиентов',
    headingMain: 'Хватит тратить на всех подряд. ',
    headingHighlight: 'Демо подскажет, кого выгодно возвращать, а кто вернётся сам.',
    desc: 'Используй сервис маркетинговой аналитики для возврата клиентов',
    passwordPlaceholder: 'Пароль',
    loginBtn: 'Войти',
    demoDisclaimer: 'Демо-режим: введите любые данные',
    footerRights: '© 2026 Inflowmetrics. Возвращаем клиентов на основе данных.',
    madeIn: 'Сделано в',
    logoutBtn: "Выйти",
    dashBoardOverview: "Панель показателей",
    tools: "Инструментарий",
    settings: "Настройки",
    users: "Пользователи",
    profile: "Профиль",
    accounts: "Аккаунты",
    changePassword: "Сменить пароль",
    deleteAccount: "Удалить Аккаунт",
    add_a_user: "Добавить пользователя",
    account_creation: "Создание аккаунта",
    deleteUser: "Удалить пользователя",
    changeARole: "Сменить роль пользователя",
    empty_users_list: "Нет зарегестрированых пользователей"
  },
  EN: {
    WelcomeName: 'Welcome',
    authWindowTitle: 'Authorization',
    authWindowDesc: 'Please log in to your account:',
    authWindowSubmit: 'Log In',
    fieldName: 'Name',
    fieldPhone: 'Phone',
    fieldEmail: 'Email',
    fieldPassword: 'Password',
    fieldSubmitBtn: 'Submit',
    modalSubmit: 'Submit',
    modalTitle: 'Request the Demo',
    modalDesc: 'Please fill out the following information:',
    modalNamePlaceholder: 'Your Name',
    modalPhonePlaceholder: 'Phone Number',
    modalSubmitBtn: 'Submit Request',
    modalCloseBtn: 'Close',
    getAnPersonalOffer: 'Register and get and demo',
    support: 'Support',
    badge: 'Customer Retention',
    headingMain: 'Stop spending on everyone. ',
    headingHighlight: "Our demo reveals who's worth win-back campaigns and who will come back on their own.",
    desc: 'Leverage data-driven marketing analytics tools to maximize customer retention loops',
    passwordPlaceholder: 'Password',
    loginBtn: 'Log In',
    demoDisclaimer: 'Demo mode: click submit using any mocked credential parameters',
    footerRights: '© 2026 Inflowmetrics. Retaining clients backed by deep analytical insights.',
    madeIn: 'Built by',
    logoutBtn: "Log Out",
    dashBoardOverview: "Dashboard",
    tools: "Tools",
    settings: "Settings",
    users: "Users",
    profile: "Profile",
    accounts: "Accounts",
    changePassword: "Change password",
    deleteAccount: "Delete Account",
    add_a_user: "Add a user",
    account_creation: "Create an account",
    deleteUser: "Delete user",
    changeARole: "Change a role",
    empty_users_list: "No verified users detected for this profile key sequence."
  }
};

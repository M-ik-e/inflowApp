export type LangCode = 'RU' | 'EN';

export interface LocaleTokens {
    muted: string;
    positive: string;
    neutral: string;
    warning: string;
    close: string;
    get_tracking_link: string;
    get_campaign_costs: string;
    add_a_record_to_campaign_costs: string;
    split_and_retargeting_audience: string;
    source_id: string;
    campaign_id: string;
    creative_id: string;
    campaign_name: string;
    amount: string;
    currency: string;
    holdoutDays: string;
    destination_url: string;
    disabled: string;
    active: string;
    profiles_found: string;
    one_Day: string;
    seven_Days: string;
    fourteen_Days: string;
    thirty_Days: string;
    select_or_review_credentials_configurations_associated_with_your_core_user_scope: string;
    no_verified_accounts_detected_for_this_profile: string;
    createAccount: string;
    role: string;
    no_option_available: string;
    start_date: string;
    end_date: string;
    attribution_model_type: string;
    last_click: string;
    first_touch: string;
    window_days_tracking: string;
    is_new_user_profile: string;
    source_name: string;
    event_name: string;
    target_event_1: string;
    target_event_2: string;
    dimension_key: string;
    dimension_value: string;
    loading: string;
    run_incremental_analysys: string;
    run_uplift_analysys: string;
    run_cohort_analysys: string;
    retrive_event_names: string;
    execution_failed: string;
    execution_complete: string;
    account_identifier: string;
    assigned_profile_scope_role: string;
    userID: string;
    userRole: string;
    active_accounts_infrastructure: string;
    syncing_secure_account_access_registries: string;
    confirmation_required: string;
    please_confirm_action: string;
    cancel: string;
    confirm: string;
    role_owner: string;
    role_admin: string;
    role_analyst: string;
    role_readonly: string;
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
    empty_users_list: "Нет зарегестрированых пользователей",
    role_owner: "Владелец",
    role_admin: "Администратор",
    role_analyst: "Аналитик",
    role_readonly: "Только чтение",
    confirmation_required: "Требуется подтверждение",
    please_confirm_action: "Пожалуйста, подтвердите действие",
    cancel: "Отмена",
    confirm: "Подвердить",
    one_Day: "1 День",
    seven_Days: "7 Дней",
    fourteen_Days: "14 Дней",
    thirty_Days: "30 Дней",
    select_or_review_credentials_configurations_associated_with_your_core_user_scope: "Выберите аккаунт:",
    no_verified_accounts_detected_for_this_profile: "Аккаунт не найден",
    createAccount: "Создать аккаунт",
    role: "Роль",
    no_option_available: "Нет доступных опций",
    start_date: "Дата начала",
    end_date: "Дата окончания",
    attribution_model_type: "Атрибут запроса",
    last_click: "Последний клик",
    first_touch: "Первое касание",
    window_days_tracking: "Окно отслеживания",
    is_new_user_profile: "Новый пользователь",
    source_name: "Название Источника",
    event_name: "Название События",
    target_event_1: "Целевое событие 1",
    target_event_2: "Целевое событие 2",
    dimension_key: "Ключ измерения",
    dimension_value: "Значение измерения",
    loading: "Загрузка",
    run_incremental_analysys: "Инкрементальный анализ",
    run_uplift_analysys: "Uplift-моделирование",
    run_cohort_analysys: "Когортный анализ",
    retrive_event_names: "Получить список событий",
    execution_failed: "Операция не выполнена",
    execution_complete: "Операция завершена",
    account_identifier: "Идентификатор аккаунта",
    assigned_profile_scope_role: "Роль",
    userID: "Идентификатор пользователя (ID):",
    userRole: "Роль",
    active_accounts_infrastructure: "Активные аккаунты",
    syncing_secure_account_access_registries: "Синхронизация...",
    profiles_found: "Учетных записей найдено: ",
    disabled: "Отключён: ",
    active: "Активный",
    destination_url: "Целевой URL",
    source_id: "ID Источника",
    campaign_id: "ID Кампании",
    creative_id: "ID Креатива",
    campaign_name: "Название Кампании",
    amount: "Количество",
    currency: "Валюта",
    holdoutDays: "Дни Холдаута",
    get_tracking_link: "Трекинговая ссылка",
    get_campaign_costs: "Расчет затрат на рекламую кампанию",
    add_a_record_to_campaign_costs: "Добавить расход на рекламую кампанию",
    split_and_retargeting_audience: "Сплит и Ретаргетинг аудитории",
    close: "Закрыть",
    warning: "Требует Внимания!",
    muted: "На грани",
    positive: "Позитив",
    neutral: "Нейтрально"
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
    empty_users_list: "No verified users detected for this profile key sequence.",
    role_owner: "Owner",
    role_admin: "Administrator",
    role_analyst: "Analyst",
    role_readonly: "Read Only",
    confirmation_required: "Confirmation Required",
    please_confirm_action: "Please confirm action",
    cancel: "Cancel",
    confirm: "Confirm",
    one_Day: "1 Day",
    seven_Days: "7 Days",
    fourteen_Days: "14 Days",
    thirty_Days: "30 Days",
    select_or_review_credentials_configurations_associated_with_your_core_user_scope: "Select or review credentials configurations associated with your core user scope",
    no_verified_accounts_detected_for_this_profile: "No verified accounts detected for this profile",
    createAccount: "Create account",
    role: "Role",
    no_option_available: "No option available",
    start_date: "Start Date",
    end_date: "End Date",
    attribution_model_type: "Attribution model type",
    last_click: "Last Click",
    first_touch: "First Touch",
    window_days_tracking: "Window days:",
    is_new_user_profile: "New User",
    source_name: "Source Name",
    event_name: "Event Name",
    target_event_1: "Target Event 1",
    target_event_2: "Target Event 2",
    dimension_key: "Dimension Key",
    dimension_value: "Dimension Value",
    loading: "Loading...",
    run_incremental_analysys: "Run Incremental Analysis",
    run_uplift_analysys: "Run Uplift Analysis",
    run_cohort_analysys: "Run CoHort Analysis",
    retrive_event_names: "Retrive Event Names",
    execution_failed: "Execution Failed",
    execution_complete: "Execution Complete",
    account_identifier: "Account Identifier",
    assigned_profile_scope_role: "Assigned Profile Scope Role",
    userID: "User ID:",
    userRole: "User Role",
    active_accounts_infrastructure: "Active Accounts Infrastructure",
    syncing_secure_account_access_registries: "Syncing secure account access registries",
    profiles_found: "Profiles found: ",
    disabled: "Disabled at: ",
    active: "Active",
    destination_url: "Destination URL(absolute http/https)",
    source_id: "Source ID",
    campaign_id: "Campaign ID",
    creative_id: "Creative ID",
    campaign_name: "Campaign Name",
    amount: "Amount",
    currency: "Currency",
    holdoutDays: "HoldOut Days",
    get_tracking_link: "Get Tracking link",
    get_campaign_costs: "Get Campaign cost",
    add_a_record_to_campaign_costs: "Add record to campaign cost",
    split_and_retargeting_audience: "Split and Retargeting audience",
    close: "Close",
    warning: "Warning!",
    muted: "Muted",
    positive: "Positive",
    neutral: "Neutral"
  }
};

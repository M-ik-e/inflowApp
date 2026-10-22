import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, User, Phone, X, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { dictionary, type LangCode } from './translations';
import logo from './assets/logo_trim.png';
import full_lemon from './assets/full_lemon_bng_trim.png';
import empt_lemon from './assets/lem_bng_trim.png';
import './App.css';
import './analytics_tab.css';
import './accounts.css';
import './profile.css'
import ApiResultModal from './modal_for_responce';
import PasswordChangeModal from './modal_pswd';
import AccountCreateModal from './modal_account_creation';
import ConfirmationModal from './confirmationModal';
import AddAUserModal from './add_a_user_modal';

// Define the structure for each rendered image
interface DistributedImage {
  id: string;
  src: string;
  left: string;
  top: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

interface UserData {
  user_id: string,
  email: string,
  display_name: string,
  role: string,
  created_at: string,
  disabled_at: string
}

interface AccountData {
  account_id: string;
  company_name: string;
  role: string;
}

// Array of your PNG image URLs or imported paths
const IMAGE_URLS = [
  full_lemon,
  empt_lemon,
];


export default function App() {

  type AccessLevel = 1 | 2 | 3 | 4;

  type ViewMode = 'home' | 'cabinet';
  const [currentView, setCurrentView] = useState<ViewMode>('home');

  type TabName = 'dashboard' | 'tools' | 'settings';
  const [activeTab, setActiveTab] = useState<TabName>('dashboard');

  type subTabName = 'profile' | 'accounts' | 'users';
  const [activeSubTab, setActiveSubTab] = useState<subTabName>('profile');

  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const dropdownStyle: React.CSSProperties = { padding: '10px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', minWidth: '240px', cursor: 'pointer' };

  // 2. Handle when a user switches options in the dropdown menu
  const handleAccountChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAccountId(event.target.value);
  };

  const [accessGrantedLevel, setAccessGrantedLevel] = useState(-1);

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const [currentLang, setCurrentLang] = useState<LangCode>('RU');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal control state
  const [authWindowActive, setAuthWindowActive] = useState(false);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const [isAccountCreationModalOpen, setIsAccountCreationModalOpen] = useState(false);

  const [isUserAdditionModalOpen, setIsUserAdditionModalOpen] = useState(false);

  const handleAddUser = (userEmail: string, userName: string, userPassword: string, userRole: string) => {
    setUserEmail(userEmail);
    setUserName(userName);
    setUserPassword(userPassword);
    setUserRole(userRole);
    accountUsers('add');
  }; //MARK:: TODO

  const handlePasswordSubmit = (oldPass: string, newPass: string) => {
    setCurrentPassword(oldPass);
    setNewPassword(newPass);
    changeSignedUserPswd();
  };

  const handleAccountCreate = (companyName: string) => {
    setCreateCompanyName(companyName);
    createAnAccount();
  }

  const handleConfirmationProcess = (event : string, confirmation: boolean) =>{
    if(event === 'accountDeletion'){
      deleteAccount();
    }else if(event === 'justConfirm'){

    }
  }

  // Execution Process Status Hooks//
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccessData, setApiSuccessData] = useState<any | null>(null);

  //analytics tab variables and functions
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const [attributionModel, setAttributionModel] = useState<string>('last_click');
  const [windowDays, setWindowDays] = useState<number>(7);
  const [targetEvent1, setTargetEvent1] = useState<string>('');
  const [targetEvent2, setTargetEvent2] = useState<string>('');
  const [dimensionKey, setDimensionKey] = useState<string>('');
  const [dimensionValue, setDimensionValue] = useState<string>('');
  
  //uplift variables and functions
  const [EventName, setEventName] = useState<string>('');
  const [SourceName, setSourceName] = useState<string>('');

  
  // Track if the user is successfully logged in
  const [user, setUser] = useState<LoginResponse['user'] | null>(() => {
      const savedUser = localStorage.getItem('authuser');
      return savedUser ? JSON.parse(savedUser) : null;
  });
  // Dynamic function using unknown variable keys and values
  const updateUserField = (key: string, value: string) => {
    setUser((prev) => {
      // 1. Fallback if user is currently null
      const currentFields = prev || { id: '', username: '', email: '' };
      // 2. Return a brand new object with the updated dynamic key
      return {
        ...currentFields,
        [key]: value
      };
    });
  };

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('authtoken');
  });

  // Call this function to hide the modal window view completely
  const handleCloseModal = () => {
    setApiError(null);
    setApiSuccessData(null);
  };

  // Primary authorization card properties
  const api_key = import.meta.env.VITE_X_API_KEY;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  //accounts tab variables and functions
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<AccountData | null>(null);

  // Responsive UI break check
  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth <= 768;
      setIsMobile(mobileView);
      setIsSidebarOpen(!mobileView);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2. AUTOMATIC ACCOUNTS LIST FETCH TRIGGER ENGINE

  const fetchAccounts = async () => {
      setApiLoading(true);
      setApiError(null);
      const token = localStorage.getItem('authToken');

      try {
        const response = await fetch('/api/v1/me/accounts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to load profile environments. Error status: ${response.status}`);
        }

        const data = await response.json();
        // Adjust array assignments target based on your precise backend nested data response keys
        setAccounts(data.accounts || data);
        //console.log("Fetched accounts:", data.accounts || data);
        //localStorage.setItem('account_id', accounts.length > 0 ? accounts[0].account_id : '[]');
      } catch (err: any) {
        setApiError(err.message || 'An unexpected connection error occurred.');
      } finally {
        setApiLoading(false);
      }
    };


  useEffect(() => {
    if (activeTab !== 'settings') return;

    fetchAccounts();
  }, [activeTab]);
  //end of accounts tab variables and functions
  
  useEffect(() => {
    if (activeSubTab !== 'accounts' && !selectedAccount && users.length > 0) return;

    accountUsers('list');
    console.log("selected account is: ", selectedAccount?.account_id);
  }, [selectedAccount]);


  //MARK:: Users function and var
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  
  const [userRole, setUserRole] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [isUserDisabled, setIsUserDisabled] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [method, setMethod] = useState<string>(''); //out of the scope

  const accountUsers = async (functioncase: string) => {
      setApiLoading(true);
      setApiError(null);

      setSelectedAccountId(selectedAccount?.account_id || '');

      const token = localStorage.getItem('authToken');

      const payload: Record<string, any> = {};
      const custHeaders = new Headers();
  
      
      custHeaders.append('Content-Type', 'application/json');
      custHeaders.append('Authorization', `Bearer ${token}`);
      custHeaders.append('X-Account-Id', selectedAccountId);
      //MARK:: X-Staff-Session ??

      if(functioncase === 'list'){
        setMethod('GET');
      }else if(functioncase === 'add'){
        setMethod('POST');
        
        payload.email = userEmail;
        payload.role = userRole;
        payload.password = userPassword;
        payload.display_name = userName;

      }else if(functioncase === 'read_one'){
        setMethod('GET');
        custHeaders.append('user_id', selectedUserId);
      }else if(functioncase === 'change_role'){
        setMethod('PATCH');
        custHeaders.append('user_id', selectedUserId);
        payload.role = userRole;
        payload.disabled = isUserDisabled;
      }else if(functioncase === 'disable'){
        setMethod('DELETE');
        custHeaders.append('user_id', selectedUserId);
      }
      console.log("requst sent with accountid", selectedAccountId);
      console.log("requst sent with token", token);
      console.log("requst sent with payload", payload);
        try {
          const response = await fetch('/api/v1/users', {
          method: method,
          headers: custHeaders,
          ...(method === 'POST' || method === 'PATCH' ? { body: JSON.stringify(payload) } : {})
        });

        if (!response.ok) {
            throw new Error(`Failed to load profile environments. Error status: ${response.status}`);
        }

        const data = await response.json();
        // Adjust array assignments target based on your precise backend nested data response keys
        setUsers(data.users || data);
        //console.log("Fetched accounts:", data.accounts || data);
        setIsUserAdditionModalOpen(false);
        
      } catch (err: any) {
        setApiError(err.message || 'An unexpected connection error occurred.');
      } finally {
        setApiLoading(false);
      }
  }

    // Floating modal text fillable states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = dictionary[currentLang];

  // 2. Generate even but randomized positions
  const distributedImages = useMemo(() => {
    const items: DistributedImage[] = [];
    const rows = 5; // Adjust grid density
    const cols = 5;
    const maxOffset = 10; // Max % an image can drift from its cell center

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Calculate the base center of each grid cell
        const baseLeft = (c / cols) * 100 + 100 / (cols * 2);
        const baseTop = (r / rows) * 100 + 100 / (rows * 2);

        // Add a random offset so it feels organic, not like a strict grid
        const randomOffsetLeft = (Math.random() - 0.5) * maxOffset;
        const randomOffsetTop = (Math.random() - 0.5) * maxOffset;

        // Pick a random image from your array
        const randomSrc = IMAGE_URLS[Math.floor(Math.random() * IMAGE_URLS.length)];

        const finalLeft = Math.min(85, Math.max(0, baseLeft + randomOffsetLeft));

        items.push({
          id: `${r}-${c}`,
          src: randomSrc,
          left: `${finalLeft}%`,
          top: `${baseTop + randomOffsetTop}%`,
        });
      }
    }
    
    return items;
  }, []);
  //
  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth <= 768;
      setIsMobile(mobileView);
      setIsSidebarOpen(!mobileView); // Open on desktop, close on mobile by default
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 2. Automatically clean up or update localStorage when state changes
  useEffect(() => {
    //console.log('Token useeffect triggered. Current token:', token);
    if (token) {
      //console.log('Current token:', token);
      localStorage.setItem('authtoken', token);
    } else {
      localStorage.removeItem('authtoken');
    }
  }, [token]);

  useEffect(() => {
    //console.log('User useeffect triggered. Current user:', user);
    if (user) {
      //console.log('Current user:', user);
      localStorage.setItem('authuser', JSON.stringify(user));
    } else {
      localStorage.removeItem('authuser');
    }
  }, [user]);

  const handleFormSubmission = async (e: React.SubmitEvent<HTMLFormElement>) => {
    
    e.preventDefault();
    
    setApiLoading(true);
    setApiError(null);

    // 2. Construct the exact schema using your state values
    const payload = {
      email: email,       
      password: password, 
    };

    try {
      // 1. Point to login endpoint
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      // 2. Handle invalid credentials
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid username or password.');
        }
        throw new Error('Login failed. Please try again later.');
      }

      // 3. Parse token and user data from the successful response
      const loginData  = await response.json();
      
      // 4. Securely store the token for subsequent API requests
      localStorage.setItem('authToken', loginData.access_token);
      //console.log('Bearer now: ', loginData.access_token);
      // 2. SECOND CALL: GET request with API Key AND Bearer Token
      const dataResponse = await fetch('/api/v1/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginData.access_token}`,
          'x-api-key': api_key
        }
      });

      const userData = await dataResponse.json();

      // 5. Update your app state with user info
      updateUserField('id', userData.id);
      updateUserField('username', userData.display_name);
      updateUserField('email', userData.email);

      localStorage.setItem('authuser', JSON.stringify(userData));

      setAuthWindowActive(false); // Close the auth window on success
      setCurrentView('cabinet');

      fetchAccounts(); // Optional: fetch account ID immediately after login
    } catch (err: any) {
      setApiError(err.message || 'An unexpected error occurred.');
    } finally {
      setApiLoading(false);
    }
  };

  const handleLogout = async () => {
    // 1. Retrieve the active token from storage
    const token = localStorage.getItem('authToken');

    // If there's no token found, just reset local state immediately
    if (!token) {
      setUser(null);
      return;
    }

    try {
      // 2. Alert the backend to revoke/blacklist the token
      const response = await fetch('/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-api-key': api_key
        }
      });

      if (!response.ok) {
        console.warn(`Server logout returned status: ${response.status}`);
      }

    } catch (error) {
      // Log network/server errors, but proceed with local cleanup anyway
      console.error('Failed to contact logout API:', error);
    } finally {
      // 3. CRITICAL: Always clean up local storage and state, 
      // even if the network request fails or takes too long.
      localStorage.clear();
      setUser(null);
      setCurrentView('home');
    }
  };

  const handleTabChange = (tab: TabName) => {
    setActiveTab(tab);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const handleModalRequest = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    //TODO demo request API call
    alert(`Request Recorded for ${customerName} (${customerPhone}). Selected context: ${currentLang}`);
    // Reset properties and fold modal out of display context
    setCustomerName('');
    setCustomerPhone('');
    setIsModalOpen(false);
  };

  //test functions
  const weebHookDataCollectionClick = async () => {
    setApiLoading(true);
    setApiError(null);
    setApiSuccessData(null);

    const token = localStorage.getItem('authToken');
    //Test Run
    const payload ={
      anonymous_id: 'anon_cookie_998877',
      campaign_name: 'Brand_Keywords_GEO_1',
      source_name: 'google_ads',
      utm_params: {
        creative_id: 'crt_554433'
      }
    };

    try {
      const response = await fetch(`/api/v1/collect/click`, {
        method: 'POST',
        headers: {
          'X-API-Key': api_key,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`Status code returned: ${response.status}`);
      setApiSuccessData(await response.json());
    } catch (err: any) {
      setApiError(err.message || 'An error occurred.');
    } finally {
      setApiLoading(false);
    }
  }

  const weebHookDataCollectionEvent = async () => {
    setApiLoading(true);
    setApiError(null);
    setApiSuccessData(null);

    const token = localStorage.getItem('authToken');

    const payload ={
      anonymous_id: "cookie_42",
      current_url_params: {
        gclid: "CjwK",
        utm_campaign: "brand",
        utm_source: "google"
      },
        event_name: "session_start",
        is_new_user: false,
        registered_user_id: "player_42"
      };

    try {
      const response = await fetch(`/api/v1/collect/event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': api_key
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`Status code returned: ${response.status}`);
      setApiSuccessData(await response.json());
    } catch (err: any) {
      setApiError(err.message || 'An error occurred.');
    } finally {
      setApiLoading(false);
    }
  }

  const getSignedUser = async () => {
    setApiLoading(true);
    setApiError(null);
    setApiSuccessData(null);

    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch(`/api/v1/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-api-key': api_key
        }
      });

      if (!response.ok) throw new Error(`Status code returned: ${response.status}`);
      setApiSuccessData(await response.json());
    } catch (err: any) {
      setApiError(err.message || 'An error occurred.');
    } finally {
      setApiLoading(false);
    }
  }

  const replaceUserDisplayName = async () => {
    setApiLoading(true);
    setApiError(null);
    setApiSuccessData(null);

    const token = localStorage.getItem('authToken');

    const payload ={
      display_name: "Test User 42"
      };

    try {
      const response = await fetch(`/api/v1/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-api-key': api_key
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`Status code returned: ${response.status}`);
      setApiSuccessData(await response.json());
    } catch (err: any) {
      setApiError(err.message || 'An error occurred.');
    } finally {
      setApiLoading(false);
    }
  }

  const changeSignedUserPswd = async () => {
    setApiLoading(true);
    setApiError(null);
    setApiSuccessData(null);

    const token = localStorage.getItem('authToken');

    const payload ={
      current_password: currentPassword,
      new_password: newPassword
    };

    try {
      const response = await fetch(`/api/v1/me/password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-api-key': api_key
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`Status code returned: ${response.status}`);
      setApiSuccessData(await response.json());
      alert("Password updated securely!");
      setIsPasswordModalOpen(false); // Close the module view

      handleLogout
    } catch (err: any) {
      setApiError(err.message || 'An error occurred.');
    } finally {
      setApiLoading(false);
    }
  }

  //MARK tracking link variables and functions
  const [trackingLinkDestinationURL, setTrackingLinkDestinationURL] = useState<string>('https://inflowmetrics.site/');
  const [trackingLinkSourceID, setTrackingLinkSourceID] = useState<string>('56789');
  const [trackingLinkCampaignID, setTrackingLinkCampaignID] = useState<string>('1234');
  const [trackingLinkCreativeID, setTrackingLinkCreativeID] = useState<string>('12093478');

  const getTrackingLink = async () => {
    setApiLoading(true);
    setApiError(null);
    setApiSuccessData(null);

    const token = localStorage.getItem('authToken');

    const payload ={
      destination_url: trackingLinkDestinationURL,
      source_id: trackingLinkSourceID,
      campaign_id: trackingLinkCampaignID,
      creative_id: trackingLinkCreativeID
    };

    //console.log("account_id", localStorage.getItem('account_id'));

    try {
      const response = await fetch(`/api/v1/tracking/links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Account-Id': localStorage.getItem('account_id') || ''
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`Status code returned: ${response.status}`);
      setApiSuccessData(await response.json());
    } catch (err: any) {
      setApiError(err.message || 'An error occurred.');
    } finally {
      setApiLoading(false);
    }
  }

  //MARK click and redirect variables and functions
  const [clickAndRedirectSourceID, setClickAndRedirectSourceID] = useState<string>('56789');
  const [clickAndRedirectCampaignID, setClickAndRedirectCampaignID] = useState<string>('1234');
  const [clickAndRedirectCreativeID, setClickAndRedirectCreativeID] = useState<string>('12093478');
  const [clickAndRedirectcookie_42, setClickAndRedirectcookie_42] = useState<string>('cookie_42');
  const [clickAndRedirectplayer_42, setClickAndRedirectplayer_42] = useState<string>('player_42');

  const recordClickandRedirect = async () => {
    setApiLoading(true);
    setApiError(null);
    setApiSuccessData(null);

    const token = localStorage.getItem('authToken');

    
    const queryParams = new URLSearchParams();
    const appendIfValid = (key: string, value: string | undefined | null) => {
      if (value && value.trim() !== '') {
        queryParams.append(key, value);
      }
    };

    appendIfValid('source_id', clickAndRedirectSourceID);
    appendIfValid('campaign_id', clickAndRedirectCampaignID);
    appendIfValid('creative_id', clickAndRedirectCreativeID);
    appendIfValid('anonymous_id', clickAndRedirectcookie_42);
    appendIfValid('signed_user_id', clickAndRedirectplayer_42);
    
    try {
      const response = await fetch(`/api/v1/t/${token}?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error(`Status code returned: ${response.status}`);
      setApiSuccessData(await response.json());
    } catch (err: any) {
      setApiError(err.message || 'An error occurred.');
    } finally {
      setApiLoading(false);
    }
  }

  //MARK split and retargerting variables and functions
  const [splitAndRetargetingSourceName, setSplitAndRetargetingSourceName] = useState<string>('google_ads');
  const [splitAndRetargetingUserId, setSplitAndRetargetingUserId] = useState<string>('player_42');
  const [splitAndRetargetingHoldoutDays, setSplitAndRetargetingHoldoutDays] = useState<number>(7);

  const splitAndRetargeting = async () => {
    setApiLoading(true);
    setApiError(null);
    setApiSuccessData(null);

    const payload ={
      "source_name": splitAndRetargetingSourceName,
      "registered_user_ids": [
      splitAndRetargetingUserId
      ],
      "holdout_days": 7
    }
    
    try {
      const response = await fetch(`/api/v1/holdout/audience`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'X-Account-Id': localStorage.getItem('account_id') || ''
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`Status code returned: ${response.status}`);
      setApiSuccessData(await response.json());
    } catch (err: any) {
      setApiError(err.message || 'An error occurred.');
    } finally {
      setApiLoading(false);
    }
  }

  //MARK list campaign spends variables and functions
  const listCampaignSpends = async () => {
    setApiLoading(true);
    setApiError(null);
    setApiSuccessData(null);

    const queryParams = new URLSearchParams();
    const appendIfValid = (key: string, value: string | undefined | null) => {
      if (value && value.trim() !== '') {
        queryParams.append(key, value);
      }
    };

    appendIfValid('start_date', startDate);
    appendIfValid('end_date', endDate);
    
    try {
      const response = await fetch(`/api/v1/costs?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'X-Account-Id': localStorage.getItem('account_id') || ''
        }
      });
      if (!response.ok) throw new Error(`Status code returned: ${response.status}`);
      setApiSuccessData(await response.json());
    } catch (err: any) {
      setApiError(err.message || 'An error occurred.');
    } finally {
      setApiLoading(false);
    }
  }

  //Mark record campaign spend variables and functions
  const [recordCampaignSpendSourceName, setRecordCampaignSpendSourceName] = useState<string>('google_ads');
  const [recordCampaignSpendCampaignName, setRecordCampaignSpendCampaignName] = useState<string>('Brand_Keywords_GEO_1');
  const [recordCampaignSpendAmount, setRecordCampaignSpendAmount] = useState<number>(100);
  const [recordCampaignSpendCurrency, setRecordCampaignSpendCurrency] = useState<string>('USD');
  const [recordCampaignSpendPeriodStart, setRecordCampaignSpendPeriodStart] = useState<string>('2024-01-01');
  const [recordCampaignSpendPeriodEnd, setRecordCampaignSpendPeriodEnd] = useState<string>('2024-01-31');


  const recordCampaignSpend = async () => {
    setApiLoading(true);
    setApiError(null);
    setApiSuccessData(null);

    const payload ={
      "costs": [
        {
        "source_name": recordCampaignSpendSourceName,
        "campaign_name": recordCampaignSpendCampaignName,
        "amount": recordCampaignSpendAmount,
        "currency": recordCampaignSpendCurrency,
        "period_start": recordCampaignSpendPeriodStart,
        "period_end": recordCampaignSpendPeriodEnd
        }
      ]
    }
    
    try {
      const response = await fetch(`/api/v1/costs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'X-Account-Id': localStorage.getItem('account_id') || ''
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`Status code returned: ${response.status}`);
      setApiSuccessData(await response.json());
    } catch (err: any) {
      setApiError(err.message || 'An error occurred.');
    } finally {
      setApiLoading(false);
    }
  }

  //MARK: create an account function and variables
  const [createCompanyName, setCreateCompanyName] = useState<string>('');

  const createAnAccount = async () => {
    setApiLoading(true);
    setApiError(null);
    setApiSuccessData(null);

    const payload ={
      "company_name": createCompanyName
    }
    
    try {
      const response = await fetch(`/api/v1/accounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`Status code returned: ${response.status}`);
      
      setApiSuccessData(await response.json());
      setIsAccountCreationModalOpen(false);
      fetchAccounts();

    } catch (err: any) {
      setApiError(err.message || 'An error occurred.');
    } finally {
      setApiLoading(false);
    }
  }

  //MARK: delete account func and var
  const [accountToDelete, setAccountToDelete] = useState<string>(localStorage.getItem('account_id') || '')

  const deleteAccount = async () => {
    setApiLoading(true);
    setApiError(null);
    setApiSuccessData(null);
    //console.log('Account deletion triggered');
    try {
      const response = await fetch(`/api/v1/accounts`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'X-Account-Id': accountToDelete
        }
      });
      if (!response.ok) throw new Error(`Status code returned: ${response.status}`);
      setApiSuccessData(await response.json());
      setIsConfirmationModalOpen(false);
      fetchAccounts();
    } catch (err: any) {
      setApiError(err.message || 'An error occurred.');
    } finally {
      setApiLoading(false);
    }
  }

  //MARK: getAllusersOnTheAcoount fAv
  const getAllusersOnTheAcoount = async () => {
    setApiLoading(true);
    setApiError(null);
    setApiSuccessData(null);
    
    try {
      const response = await fetch(`/api/v1/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'X-Account-Id': selectedAccountId || ''
        }
      });
      if (!response.ok) throw new Error(`Status code returned: ${response.status}`);
      setApiSuccessData(await response.json());
    } catch (err: any) {
      setApiError(err.message || 'An error occurred.');
    } finally {
      setApiLoading(false);
    }
  }


  //MARK: addaPersonToTheAccount fAv
  const [addAPersonEmail, setaddAPersonEmail] = useState<string>('')
  const [addAPersonRole, setaddAPersonRole] = useState<string>('')
  const [addAPersonPassword, setaddAPersonPassword] = useState<string>('')
  const [addAPersonDisplayName, setaddAPersonDisplayName] = useState<string>('')
  const [addAPersonAccountToChoose, setaddAPersonAccountToChoose] = useState<string>(localStorage.getItem('account_id') || '')

  const addaPersonToTheAccount = async () => {
    setApiLoading(true);
    setApiError(null);
    setApiSuccessData(null);

    const payload ={
      "email": addAPersonEmail,
      "role": addAPersonRole,
      "password": addAPersonPassword,
      "display_name": addAPersonDisplayName
    }
    
    try {
      const response = await fetch(`/api/v1/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'X-Account-Id': addAPersonAccountToChoose
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`Status code returned: ${response.status}`);
      setApiSuccessData(await response.json());
    } catch (err: any) {
      setApiError(err.message || 'An error occurred.');
    } finally {
      setApiLoading(false);
    }
  }

  //MARK: readOnePersonFromTheAcoount fAv
  const readOnePersonFromTheAcoount = async () => {
    setApiLoading(true);
    setApiError(null);
    setApiSuccessData(null);

    try {
      const response = await fetch(`/api/v1/users/?${localStorage.getItem('user_id')}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'X-Account-Id': localStorage.getItem('account_id') || ''
        }
      });
      if (!response.ok) throw new Error(`Status code returned: ${response.status}`);
      setApiSuccessData(await response.json());
    } catch (err: any) {
      setApiError(err.message || 'An error occurred.');
    } finally {
      setApiLoading(false);
    }
  }


  //MARK: changeAPersonRole fAv
  const [changeAPersonRole_setRole, setChangeAPersonRole_setRole] = useState<string>('owner');
  const [changeAPersonRole_is_disabled, setchangeAPersonRole_is_disabled] = useState<string>('true');

  const changeAPersonRole = async () => {
    setApiLoading(true);
    setApiError(null);
    setApiSuccessData(null);

    const payload ={
      "role": changeAPersonRole_setRole,
      "disabled": changeAPersonRole_is_disabled
    }
    
    try {
      const response = await fetch(`/api/v1/users/?${localStorage.getItem('user_id')}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'X-Account-Id': localStorage.getItem('account_id') || ''
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`Status code returned: ${response.status}`);
      setApiSuccessData(await response.json());
    } catch (err: any) {
      setApiError(err.message || 'An error occurred.');
    } finally {
      setApiLoading(false);
    }
  }

  //MARK: disableAPersonMembership fAv
  const disableAPersonMembership = async () => {
    setApiLoading(true);
    setApiError(null);
    setApiSuccessData(null);

    try {
      const response = await fetch(`/api/v1/users/?${localStorage.getItem('user_id')}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'X-Account-Id': localStorage.getItem('account_id') || ''
        }
      });
      if (!response.ok) throw new Error(`Status code returned: ${response.status}`);
      setApiSuccessData(await response.json());
    } catch (err: any) {
      setApiError(err.message || 'An error occurred.');
    } finally {
      setApiLoading(false);
    }
  }

  //MARK: analytics functions
  const [actionType, setActionType] = useState<string>('');

  const runMarketingTool = (e: React.SubmitEvent) => {
    e.preventDefault(); // Prevents page reload
    
    // Switch logic based on which button was clicked
    if (actionType === 'Icrementality') {
      triggerIncrementalityTest(e);
    } else if (actionType === 'Uplift') {
      triggerUpliftAnalysis(e);
    } else if (actionType === 'Cohort') {
      triggerCohortAnalysis(e);
    } else if (actionType === 'EventNames') {
      triggerEventNamesAnalysis(e);
    }
  };

  const triggerIncrementalityTest = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setApiLoading(true);
        setApiError(null);
        setApiSuccessData(null);
    
        const token = localStorage.getItem('authToken');
        const accountId = selectedAccountId;
    
        const queryParams = new URLSearchParams();
        //console.log("account fetched is", accountId);
        const appendIfValid = (key: string, value: string | undefined | null) => {
            if (value && value.trim() !== '') {
            queryParams.append(key, value);
            }
        };
    
        appendIfValid('start_date', startDate);
        appendIfValid('end_date', endDate);
        appendIfValid('is_new_user', isNewUser !== undefined ? String(isNewUser) : undefined);
        appendIfValid('attribution_model', attributionModel);
        appendIfValid('window_days', windowDays !== undefined ? String(windowDays) : undefined);
        appendIfValid('target_event1', targetEvent1?.substring(0, 255));
        appendIfValid('target_event2', targetEvent2?.substring(0, 255));
        appendIfValid('dimension_key', dimensionKey?.substring(0, 255));
        appendIfValid('dimension_value', dimensionValue?.substring(0, 255));
    
    
        try {
            // Append query parameters to the target endpoint
            const response = await fetch(`/api/v1/analytics/incrementality?${queryParams.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'X-Account-Id': selectedAccountId
            }
            });
    
            if (!response.ok) {
            throw new Error(`Execution error. Status code returned: ${response.status}`);
            }
    
            const result = await response.json();
            setApiSuccessData(result);
    
        } catch (err: any) {
            setApiError(err.message || 'An error occurred triggering function.');
        } finally {
            setApiLoading(false);
        }
    };
    //end of analytics tab variables and functions
    
  const triggerUpliftAnalysis = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setApiLoading(true);
        setApiError(null);
        setApiSuccessData(null);

        const accountId = localStorage.getItem('account_id') || ''; // Default to first account if available
        const token = localStorage.getItem('authToken');
        //console.log("accountid is:", accountId);
        //console.log("token is:", token);
        
        // Construct the target query criteria parameters matching string inputs exactly
        const queryParams = new URLSearchParams();

        const appendIfValid = (key: string, value: string | undefined | null) => {
            if (value && value.trim() !== '') {
            queryParams.append(key, value);
            }
        };

        appendIfValid('start_date', startDate),
        appendIfValid('end_date', endDate),
        appendIfValid('event_name', EventName),
        appendIfValid('source_name', SourceName)

        try {
            const response = await fetch(`/api/v1/analytics/uplift?${queryParams.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'X-Account-Id': selectedAccountId
            }
            });

            if (!response.ok) {
            throw new Error(`Uplift calculation failed. Server returned status code: ${response.status}`);
            }

            const result = await response.json();
            setApiSuccessData(result);

        } catch (err: any) {
            setApiError(err.message || 'An error occurred running Uplift analysis.');
        } finally {
            setApiLoading(false);
        }
    };
    //end of uplit variables and functions

    //CoHort variables and functions
  const triggerCohortAnalysis = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setApiLoading(true);
        setApiError(null);
        setApiSuccessData(null);

        const accountId = localStorage.getItem('account_id') || ''; // Default to first account if available
        const token = localStorage.getItem('authToken');

        const queryParams = new URLSearchParams({
            start_date: startDate,
            end_date: endDate,
            source_name: SourceName
        });

        try {
            const response = await fetch(`/api/v1/analytics/reactivation-cohort?${queryParams.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'X-Account-Id': selectedAccountId
            }
            });
            if (!response.ok) throw new Error(`Status code returned: ${response.status}`);
            setApiSuccessData(await response.json());
        } catch (err: any) {
            setApiError(err.message || 'An error occurred.');
        } finally {
            setApiLoading(false);
        }
    };
    // End CoHort variables and functions

  const triggerEventNamesAnalysis = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setApiLoading(true);
        setApiError(null);
        setApiSuccessData(null);

        const accountId = localStorage.getItem('account_id') || ''; // Default to first account if available
        const token = localStorage.getItem('authToken');

        const queryParams = new URLSearchParams({
            start_date: startDate,
            end_date: endDate,
        });

        try {
            const response = await fetch(`/api/v1/analytics/event-names?${queryParams.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'X-Account-Id': selectedAccountId
            }
            });
            if (!response.ok) throw new Error(`Status code returned: ${response.status}`);
            setApiSuccessData(await response.json());
        } catch (err: any) {
            setApiError(err.message || 'An error occurred.');
        } finally {
            setApiLoading(false);
        }
    };


  return (
    <div className="app-container">
      <header className="navbar">
        <div className="brand-logo-container">
          <span className="brand-title">
            <img src={logo} alt="Inflowmetrics Logo" className="brand-logo" />
          </span>
        </div>
        
        <div className="nav-controls">
          {user ? (
            <button className="btn-secondary" onClick={handleLogout} type="button">
              <span>{t.logoutBtn}</span>
            </button>
          ) : (
            <button className="btn-secondary" onClick={() => setAuthWindowActive(true)} type="button">
              {/* <Gem size={14} className="gem-icon" /> */}
              <span>{t.loginBtn}</span>
            </button>
          )}

          <div className="lang-selector-wrapper" ref={dropdownRef}>
            <button className="btn-secondary" onClick={() => setIsDropdownOpen(!isDropdownOpen)} type="button">
              
              <span className="flag-glyph">{currentLang === 'RU' ? '🇷🇺' : '🇬🇧'}</span>
              <span>{currentLang}</span>
              <ChevronDown 
                size={12} 
                className="dropdown-chevron-animated"
                style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} 
              />
            </button>

            {isDropdownOpen && (
              <div className="dropdown-options-list">
                <button type="button" className={`dropdown-item-row ${currentLang === 'RU' ? 'active' : ''}`} onClick={() => { setCurrentLang('RU'); setIsDropdownOpen(false); }}>
                  <span className="flag-glyph">🇷🇺</span>
                  <span>Русский</span>
                </button>
                <button type="button" className={`dropdown-item-row ${currentLang === 'EN' ? 'active' : ''}`} onClick={() => { setCurrentLang('EN'); setIsDropdownOpen(false); }}>
                  <span className="flag-glyph">🇬🇧</span>
                  <span>English</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="main-layout">
        
        {distributedImages.map((img) => (
          <img
            key={img.id}
            src={img.src}
            alt="Random decorative element"
            
            style={{
              position: 'absolute',
              objectFit: 'contain',
              pointerEvents: 'none',
              width: '15%',
              height: '15%',
              left: img.left,
              top: img.top,
              opacity: 0.4,
            }}
          />
        ))}
        
        { currentView === 'home' && !user ? (
            <div className="auth-panel" style={{ padding: '1rem' }}  >
              <p style={{ height: '1.5rem'}}></p>
              <h1 className="hero-heading">{t.headingMain}<span>{t.headingHighlight}</span></h1>
              <button type="button" className="btn-primary-action" onClick={() => setIsModalOpen(true)}  >
                <span>{t.getAnPersonalOffer}</span>
              </button>
            <p style={{ height: '1rem'}}></p>
            <p className="hero-desc">{t.desc}</p>
          </div>
        ) : (
          /* Secure Users Cabinet Layout Frame */
          <div className = "platform-container" >
            {/* 1. NAVIGATION BAR BARRIER */}
            <nav className="cabinet-navbar">
              <div className="nav-brand-group">
                {isMobile && (
                  <button className="nav-toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    {isSidebarOpen ? '✕' : '☰'}
                  </button>
                )}
                <p style={{ width: '0.1rem'}}></p>
                <div style={{ display: 'block', alignItems: 'center', gap: '10px' }}>
                  <h2 className="nav-brand-title">{t.WelcomeName + ', '}</h2>
                  <h2 className="nav-brand-title">{user?.username}</h2>
                </div>
                <p style={{ width: '0.2rem'}}></p>
              </div>
            </nav>

            {/* 2. CORE LAYOUT FRAMEWORK CONTAINER */}
            <div className="cabinet-layout-frame">
              
              {/* SIDEBAR DRAWER VIEW */}
              <aside className={`cabinet-sidebar ${isSidebarOpen ? 'sidebar-visible' : 'sidebar-hidden'}`}>
                
                <button className={`sidebar-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                  onClick={() => handleTabChange('dashboard')}>
                  📊 {t.dashBoardOverview}
                </button>
                <button className={`sidebar-link ${activeTab === 'tools' ? 'active' : ''}`}
                  onClick={() => handleTabChange('tools')}>
                  💼 {t.tools}
                </button>
                <button className={`sidebar-link ${activeTab === 'settings' ? 'active' : ''}`}
                  onClick={() => handleTabChange('settings')}>
                  ⚙️ {t.settings}
                </button>
              </aside>

              {/* Dismiss Mask Background for Active Mobile Drawers */}
              {isMobile && isSidebarOpen && (
                <div className="mobile-overlay" onClick={() => setIsSidebarOpen(false)} />
              )}

              {/* 3. CENTRAL MAIN DISPLAY CANVAS */}
              <main className="cabinet-workspace">
                
                {/* 3. CONDITIONAL TAB RENDERING INSIDE THE AUTH PANEL */}
                {activeTab === 'tools' && (
                  <div className='marketing-form-layout'>
                      <select
                          id="dynamic-select"
                          value={selectedAccountId}
                          onChange={handleAccountChange}
                          style={dropdownStyle}
                          disabled={accounts.length === 0}
                        >
                          {/* If the array is empty, give a clean fallback state */}
                          {accounts.length === 0 && (
                            <option value="">No options available</option>
                          )}

                          {/*Automatically loops through any quantity of elements */}
                          {accounts.map((account: AccountData) => (
                            <option key={account.account_id} value={account.account_id}>
                              {account.company_name} ({account.role})
                            </option>
                          ))}
                      </select>

                      <div className='metric-card'>
                        <div className="form-input-block">
                            <label>destination url(absolute http/https)</label>
                            <input type="text" maxLength={255} value={trackingLinkDestinationURL} onChange={(e) => setTrackingLinkDestinationURL(e.target.value)}  />
                          </div>
                        
                        {/* Event Source and Name */}
                        <div className="form-group-row">
                          <div className="form-input-block">
                            <label>source_id</label>
                            <input type="text" maxLength={255} value={trackingLinkSourceID} onChange={(e) => setTrackingLinkSourceID(e.target.value)}  />
                          </div>
                          <div className="form-input-block">
                            <label>campaign_id</label>
                            <input type="text" maxLength={255} value={trackingLinkCampaignID} onChange={(e) => setTrackingLinkCampaignID(e.target.value)}  />
                          </div>
                          <div className="form-input-block">
                            <label>creative_id</label>
                            <input type="text" maxLength={255} value={trackingLinkCreativeID} onChange={(e) => setTrackingLinkCreativeID(e.target.value)}  />
                          </div>
                        </div>

                        <div className="metric-card">
                          <button className="marketing-submit-btn" onClick={getTrackingLink} type="button">Get Tracking link</button>
                        </div>
                      </div>
                    <hr className='horizontalLineStyle' />
                    {/*Campain spends report*/}
                    <div className='metric-card'>
                      {/* DATE CAPTURING ROW */}
                      <div className="form-group-row">
                        <div className="form-input-block">
                          <label>Start Date</label>
                          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                        </div>
                        <div className="form-input-block">
                          <label>End Date</label>
                          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                        </div>
                      </div>
                      
                      <div className="metrics-grid">
                        <div className="metric-card">
                          <button className="marketing-submit-btn" onClick={listCampaignSpends} type="button">Get Campaign costs</button>
                        </div>
                      </div>
                    </div>
                    <hr className='horizontalLineStyle' />
                    {/*Add Campain spends*/}
                    <div className='metric-card'>
                      
                      <div className="form-group-row">
                          <div className="form-input-block">
                            <label>source_name</label>
                            <input type="text" maxLength={255} value={recordCampaignSpendSourceName} onChange={(e) => setRecordCampaignSpendSourceName(e.target.value)}  />
                          </div>
                          <div className="form-input-block">
                            <label>campaign_name</label>
                            <input type="text" maxLength={255} value={recordCampaignSpendCampaignName} onChange={(e) => setRecordCampaignSpendCampaignName(e.target.value)}  />
                          </div>
                      </div>
                      <div className="form-group-row">
                          <div className="form-input-block">
                            <label>amount</label>
                            <input type="text" value={recordCampaignSpendAmount} onChange={(e) => setRecordCampaignSpendAmount(e.target.valueAsNumber)}  />
                          </div>
                          <div className="form-input-block">
                            <label>currency</label>
                            <input type="text" maxLength={255} value={recordCampaignSpendCurrency} onChange={(e) => setRecordCampaignSpendCurrency(e.target.value)}  />
                          </div>
                      </div>
                      
                      {/* DATE CAPTURING ROW */}
                      <div className="form-group-row">
                        <div className="form-input-block">
                          <label>Start Date</label>
                          <input type="date" value={recordCampaignSpendPeriodStart} onChange={(e) => setRecordCampaignSpendPeriodStart(e.target.value)} required />
                        </div>
                        <div className="form-input-block">
                          <label>End Date</label>
                          <input type="date" value={recordCampaignSpendPeriodEnd} onChange={(e) => setRecordCampaignSpendPeriodEnd(e.target.value)} required />
                        </div>
                      </div>
                      
                      <div className="metrics-grid">
                        <div className="metric-card">
                          <button className="marketing-submit-btn" onClick={recordCampaignSpend} type="button">Add a record to campaign costs</button>
                        </div>
                      </div>
                    </div>
                    <hr className='horizontalLineStyle' />
                    <div className='metric-card'> 
                      <div className="form-group-row">
                          <div className="form-input-block">
                            <label>source_name</label>
                            <input type="text" maxLength={255} value={splitAndRetargetingSourceName} onChange={(e) => setSplitAndRetargetingSourceName(e.target.value)}  />
                          </div>
                          <div className="form-input-block">
                            <label>holdoutDays</label>
                            <input type="text" maxLength={255} value={splitAndRetargetingHoldoutDays} onChange={(e) => setSplitAndRetargetingHoldoutDays(e.target.valueAsNumber)}  />
                          </div>
                      </div>
                      <div className="form-group-row">
                          <div className="form-input-block">
                            <label>Users_id</label>
                            <input type="text" value={splitAndRetargetingUserId} onChange={(e) => setSplitAndRetargetingUserId(e.target.value)}  />
                          </div>
                      </div>
                    
                      <div className="metrics-grid">
                        <div className="metric-card">
                          <button className="marketing-submit-btn" onClick={splitAndRetargeting} type="button">Add a record to campaign costs</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className='subtab-pane-container'>
                    <div className='.marketing-subtabs-row'>
                      <button className={`subtab-btn ${activeSubTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveSubTab('profile')}>
                        📊 {t.profile}
                      </button>
                      <button className={`subtab-btn ${activeSubTab === 'accounts' ? 'active' : ''}`}
                        onClick={() => setActiveSubTab('accounts')}>
                        💼 {t.accounts}
                      </button>
                      <button className={`subtab-btn ${activeSubTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveSubTab('users')}>
                        ⚙️ {t.users}
                      </button>
                        {activeSubTab === 'profile' && (
                          <>
                          <hr className='horizontalLineStyle' />
                            <div className="metric-card">
                              <div className="metric-card metrics-grid">
                                <div className="profile-avatar">
                                  {user?.username.charAt(0).toUpperCase()}
                                </div>
                                
                                <div className="metric-card">
                                  <h2>{user?.username}</h2>
                                </div>
                              </div>

                              <div className="metric-card">
                                <button 
                                  className="marketing-submit-btn" 
                                  onClick={() => setIsPasswordModalOpen(true)}>
                                🔑 {t.changePassword}
                                </button>
                              </div>
                              <hr className='horizontalLineStyle'></hr>
                              <div className='metric-card'>
                                <button 
                                  className="modal-blank-btn danger-accent" 
                                  onClick={handleLogout}
                                  >🚪 {t.logoutBtn}
                                </button>
                              </div>
                            </div>
                        
                          </>
                        )}
                        
                        {activeSubTab === 'accounts' && (
                          <>
                            <div className="panel-header">
                              <h2 className="panel-title">Active Accounts Infrastructure</h2>
                              <span className="status-badge">Profiles Found: {accounts.length}</span>
                            </div>

                            {apiLoading && <p style={{ color: '#FFD700' }}>Syncing secure account access registries...</p>}
                            {apiError && <div className="activity-feed error-alert"><p style={{ margin: 0 }}>⚠️ {apiError}</p></div>}

                            {!apiLoading && !apiError && (
                              <div className="accounts-list-container">
                                <p style={{ color: '#aaa', margin: '0 0 5px 0' }}>Select or review credentials configurations associated with your core user scope:</p>
                                
                                {accounts.length === 0 ? (
                                  <div className="activity-feed">
                                    <p style={{ margin: 0, color: '#ccc' }}>No verified accounts detected for this profile key sequence.</p>
                                      <button 
                                        className="marketing-submit-btn" 
                                        onClick={() => setIsAccountCreationModalOpen(true)}>
                                        🔑 {t.changePassword}
                                      </button>
                                  </div>
                                ) : (
                                  <div className="accounts-grid-layout">
                                    {accounts.map((acc) => (
                                      <div key={acc.account_id} className="account-profile-card clickable" onClick={() => setSelectedAccount(acc)}>
                                        <div className="account-card-header">
                                          <span className="account-avatar">💼</span>
                                          <div className="account-details">
                                            <strong className="account-name-title">{acc.company_name || 'Unnamed Account'}</strong>
                                            <div/>
                                            <span className="account-id-sub">ID:{acc.account_id}</span>
                                          </div>
                                        </div>
                                        <div className="account-card-meta">
                                          <span className="account-role-tag">Role: {acc.role || 'Member'}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        )}

                         {activeSubTab === 'users' && (<></>)}

                    </div>  
                  </div>
                )}

                {activeTab === 'dashboard' && (
                <>
                      {/* DYNAMIC ANALYSIS INTERACTION FORM */}
                      <form onSubmit={runMarketingTool} className="marketing-form-layout">
                        <h3 style={{ color: '#FFD700', marginTop: 0, marginBottom: '20px', fontSize: '1.2rem' }}>
                      
                        </h3>

                        <select
                          id="dynamic-select"
                          value={selectedAccountId}
                          onChange={handleAccountChange}
                          style={dropdownStyle}
                          disabled={accounts.length === 0}
                        >
                          {/* If the array is empty, give a clean fallback state */}
                          {accounts.length === 0 && (
                            <option value="">No options available</option>
                          )}

                          {/* ✨ THE MAGIC LOOP: Automatically loops through any quantity of elements */}
                          {accounts.map((account: AccountData) => (
                            <option key={account.account_id} value={account.account_id}>
                              {account.company_name} ({account.role})
                            </option>
                          ))}
                        </select>

                        {/* DATE CAPTURING ROW */}
                        <div className="form-group-row">
                          <div className="form-input-block">
                            <label>Start Date</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                          </div>
                          <div className="form-input-block">
                            <label>End Date</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                          </div>
                        </div>

                        {/* ENUM SELECTION FIELDS ROW */}
                        <div className="form-group-row">
                          <div className="form-input-block">
                            <label>Attribution Model Type</label>
                            <select value={attributionModel} onChange={(e) => setAttributionModel(e.target.value)}>
                              <option value="last_click">Last Click </option>
                              <option value="first_touch">First Touch</option>
                            </select>
                          </div>

                          <div className="form-input-block">
                            <label>Window Days Tracking</label>
                            <select value={windowDays} onChange={(e) => setWindowDays(Number(e.target.value))}>
                              <option value={1}>1 Day</option>
                              <option value={7}>7 Days </option>
                              <option value={14}>14 Days</option>
                              <option value={30}>30 Days</option>
                            </select>
                          </div>
                        </div>

                        {/* NEW USER OPT-IN CHECKBOX BOOLEAN ROW */}
                        <div className="form-group-row flex-align-center">
                          <label className="checkbox-container">
                            <input type="checkbox" checked={isNewUser} onChange={(e) => setIsNewUser(e.target.checked)} />
                            <span className="checkbox-label">Is New User Profile</span>
                          </label>
                        </div>

                        {/* Event Source and Name */}
                        <div className="form-group-row">
                          <div className="form-input-block">
                            <label>Source Name</label>
                            <input type="text" maxLength={255} value={SourceName} onChange={(e) => setSourceName(e.target.value)}  />
                          </div>
                          <div className="form-input-block">
                            <label>Event Name</label>
                            <input type="text" maxLength={255} value={EventName} onChange={(e) => setEventName(e.target.value)}  />
                          </div>
                        </div>


                        {/* TEXT KEY STRINGS - ROW 1 */}
                        <div className="form-group-row">
                          <div className="form-input-block">
                            <label>Target Event 1</label>
                            <input type="text" maxLength={255} value={targetEvent1} onChange={(e) => setTargetEvent1(e.target.value)}  />
                          </div>
                          <div className="form-input-block">
                            <label>Target Event 2</label>
                            <input type="text" maxLength={255} value={targetEvent2} onChange={(e) => setTargetEvent2(e.target.value)}  />
                          </div>
                        </div>

                        {/* TEXT KEY STRINGS - ROW 2 */}
                        <div className="form-group-row">
                          <div className="form-input-block">
                            <label>Dimension Key</label>
                            <input type="text" maxLength={255} value={dimensionKey} onChange={(e) => setDimensionKey(e.target.value)}  />
                          </div>
                          <div className="form-input-block">
                            <label>Dimension Value</label>
                            <input type="text" maxLength={255} value={dimensionValue} onChange={(e) => setDimensionValue(e.target.value)}  />
                          </div>
                        </div>

                        {/* SUBMISSION ACTIVATION TRIGGER */}
                        <button type="submit" disabled={apiLoading} className="marketing-submit-btn" onClick={() => setActionType('Icrementality')}>
                          {apiLoading ? 'Analyzing Incrementality Metrics...' : 'Run Incr analisys'}
                        </button>
                        <button type="submit" disabled={apiLoading} className="marketing-submit-btn" onClick={() => setActionType('Uplift')}>
                          {apiLoading ? 'Analyzing Incrementality Metrics...' : 'Run uplift analisys'}
                        </button>
                        <button type="submit" disabled={apiLoading} className="marketing-submit-btn" onClick={() => setActionType('Cohort')}>
                          {apiLoading ? 'Analyzing Incrementality Metrics...' : 'run '}
                        </button>
                        <button type="submit" disabled={apiLoading} className="marketing-submit-btn" onClick={() => setActionType('EventNames')}>
                          {apiLoading ? 'Analyzing Incrementality Metrics...' : 'run run run'}
                        </button>
                      </form>

                      {/* API PROCESSING OUTPUT VIEWS */}
                      {apiError && <div className="activity-feed error-alert"><p style={{ margin: 0 }}>⚠️ Execution Failed: {apiError}</p></div>}
                
                      {apiSuccessData && (
                        <div className="activity-feed success-alert">
                          <h4 style={{ margin: '0 0 10px 0', color: '#FFD700' }}>✅ Function Execution Complete:</h4>
                          <pre style={{ margin: 0, overflowX: 'auto', fontSize: '0.85rem' }}>{JSON.stringify(apiSuccessData, null, 2)}</pre>
                        </div>
                      )}
                </>
                )}
              </main>
            </div>
          </div>
        )}
      </main>

      <button className="support-btn">{t.support}</button>

      {/* Conditional Floating Window Structural Overlay Layer */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          {/* Card Wrapper - stopPropagation prevents background dismiss fires when interacting inside the form */}
          <div className="modal-window-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3 className="modal-title-text">{t.modalTitle}</h3>
              <button className="btn-close-modal" onClick={() => setIsModalOpen(false)} aria-label="Close window dialog">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleModalRequest} className="modalForm">
              <p className="modal-instruction-text">{t.modalDesc}</p>

              {/* Fillable Field 1: Name */}
              <div className="form-group-field">
                <span className="form-field-icon"><User size={16} /></span>
                <input 
                  type="text" 
                  className="input-ctrl" 
                  placeholder={t.fieldName} 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required 
                />
              </div>

              {/* Fillable Field 2: Phone */}
              <div className="form-group-field">
                <span className="form-field-icon"><Phone size={16} /></span>
                <input 
                  type="tel" 
                  className="input-ctrl" 
                  placeholder={t.fieldPhone} 
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required 
                />
              </div>

              <button type="submit" className="btn-primary-action">
                {t.modalSubmit}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Conditional Authorization Window Overlay */}
      { authWindowActive && (
        <div className="modal-overlay" onClick={() => setAuthWindowActive(false)}>
          {/* Card Wrapper - stopPropagation prevents background dismiss fires when interacting inside the form */}
          <div className="modal-window-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3 className="modal-title-text">{t.authWindowTitle}</h3>
              <button className="btn-close-modal" onClick={() => setAuthWindowActive(false)} aria-label="Close window dialog">
                <X size={16} />
              </button>
            </div>

            <form className='modalForm' onSubmit={handleFormSubmission}>
              <div className="form-group-field">
                <span className="form-field-icon"><Mail size={16} /></span>
                <input type="email" className="input-ctrl" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="form-group-field">
                <span className="form-field-icon"><Lock size={16} /></span>
                <input type={showPassword ? 'text' : 'password'} className="input-ctrl" placeholder={t.passwordPlaceholder} value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" className="btn-toggle-eye" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            <button type="submit" disabled={apiLoading} className="btn-primary-action">
              {t.loginBtn}
            </button>
          </form>
          </div>
        </div>
      )}

      
      {/* MARK: API RESULT MODAL INTERFACE WINDOW*/}
      <ApiResultModal 
        apiError={apiError} 
        apiSuccessData={apiSuccessData} 
        onClose={handleCloseModal} 
      />

      {/* Conditionally mounting our newly decoupled file view */}
      {isPasswordModalOpen && (
        <PasswordChangeModal 
          onClose={() => setIsPasswordModalOpen(false)} 
          onConfirm={handlePasswordSubmit} 
        />
      )}

      {isAccountCreationModalOpen &&(
        <AccountCreateModal
          onClose={() => setIsAccountCreationModalOpen(false)}
          onConfirm={handleAccountCreate}
        />
      )}

      {isConfirmationModalOpen && (
        <ConfirmationModal
          clickSource='accountDeletion'
          onClose={() => setIsConfirmationModalOpen(false)}
          onConfirm={handleConfirmationProcess}
        />
      )}

      {isUserAdditionModalOpen && (
        <AddAUserModal
          onClose={() => setIsUserAdditionModalOpen(false)}
          onConfirm={handleAddUser}
        />
      )}

      {/* ────────────────────────────────────────────────────────
          3. ACCOUNT DRILLDOWN DETAIL MODAL INTERFACE WINDOW
          ──────────────────────────────────────────────────────── */}
      {selectedAccount && (
        <div className="modal-wrapper-overlay" onClick={() => setSelectedAccount(null)}>
          {/* Prevent inner layout click operations from firing parent dismiss listener */}
          <div className="account-detail-modal" onClick={(e) => e.stopPropagation()}>
            
            <button className="modal-close-cross" onClick={() => setSelectedAccount(null)}>✕</button>
            
            <div className="modal-header-block">
              <span className="modal-large-avatar">🏢</span>
              <div>
                <h3 className="modal-account-title">{selectedAccount.company_name || 'Unnamed Account'}</h3>
                <span className="modal-account-subtitle">Infrastructure Identity Scope</span>
              </div>
            </div>

            {/* Profile Variables Breakdown Table/List */}
            <div className="modal-body-fields">
              <div className="data-field-row">
                <span className="field-label">Account Identifier (ID):</span>
                <span className="field-value highlight-string">{selectedAccount.account_id}</span>
              </div>
              <div className="data-field-row">
                <span className="field-label">Assigned Profile Scope Role:</span>
                <span className="field-value">{selectedAccount.role || 'Member'}</span>
              </div>
            </div>

            {/* ACTION FRAME: PLACEHOLDER BLANK FUNCTION BUTTONS */}
            <div className="modal-actions-area">
              <button className="modal-blank-btn execution-accent" onClick={() => setIsUserAdditionModalOpen(true)}>
                {t.add_a_user}
              </button>
              <button className="modal-blank-btn danger-accent" onClick={() => setIsConfirmationModalOpen(true)}>
                {t.deleteAccount}
              </button>
            </div>
            <p style={{ height: '1rem'}}></p>
            <hr className='horizontalLineStyle'/>
            <p style={{ height: '1rem'}}></p>
            
            {users.length === 0 ? (
                <div className="activity-feed">
                  <p style={{ margin: 0, color: '#ccc' }}>{t.empty_users_list}</p>
                    
                </div>
              ) : (
                <div className="accounts-grid-layout">
                  {users.map((acc) => (
                    <div key={acc.user_id} className="account-profile-card clickable" onClick={() => setSelectedUser(acc)}>
                      <div className="account-card-header">
                        <span className="account-avatar">💼</span>
                        <div className="account-details">
                          <strong className="account-name-title">{acc.display_name || 'Unnamed Account'}</strong>
                          <div/>
                          <span className="account-id-sub">ID:{acc.user_id}</span>
                        </div>
                      </div>
                      <div className="account-card-meta">
                        <span className="account-role-tag">Role: {acc.role || 'Member'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      )}

      {selectedUser && (
          <div className="modal-wrapper-overlay" onClick={() => setSelectedUser(null)}>
          {/* Prevent inner layout click operations from firing parent dismiss listener */}
          <div className="account-detail-modal" onClick={(e) => e.stopPropagation()}>
            
            <button className="modal-close-cross" onClick={() => setSelectedUser(null)}>✕</button>
            
            <div className="modal-header-block">
              <span className="modal-large-avatar">🏢</span>
              <div>
                <h3 className="modal-account-title">{selectedUser.display_name || 'Unnamed Account'}</h3>
                <span className="modal-account-subtitle">Infrastructure Identity Scope</span>
              </div>
            </div>

            {/* Profile Variables Breakdown Table/List */}
            <div className="modal-body-fields">
              <div className="data-field-row">
                <span className="field-label">Account Identifier (ID):</span>
                <span className="field-value highlight-string">{selectedUser.user_id}</span>
              </div>
              <div className="data-field-row">
                <span className="field-label">Assigned Profile Scope Role:</span>
                <span className="field-value">{selectedUser.role || 'Member'}</span>
              </div>
            </div>

            {/* ACTION FRAME: PLACEHOLDER BLANK FUNCTION BUTTONS */}
            <div className="modal-actions-area">
              <button className="modal-blank-btn execution-accent" onClick={() => setIsUserAdditionModalOpen(true)}>
                {t.changeARole}
              </button>
              <button className="modal-blank-btn danger-accent" onClick={() => setIsConfirmationModalOpen(true)}>
                {t.deleteAccount}
              </button>
            </div>
            <p style={{ height: '1rem'}}></p>
            <hr className='horizontalLineStyle'/>
            <p style={{ height: '1rem'}}></p>
            
          </div>
        </div>
      )}



      <footer className="footer-bar">
        <div className="footer-meta">{t.footerRights}</div>
      </footer>
    </div>
  );
  }

angular.module('bigcity', [
    'bigcity.website.home',
    'bigcity.website.search',
    'bigcity.website.advert',
    'bigcity.website.user',
    'bigcity.common.messages',
    'bigcity.common.modal',
    'bigcity.common.users',
    'bigcity.common.groups',
    'bigcity.common.nodes',
    'bigcity.common.utils',
    'ui.router',
    'ui.bootstrap',
    'LocalStorageModule',
    'angularFileUpload',
    'pascalprecht.translate'
])
    .constant('API_SERVER', 'http://127.0.0.1:8001')
    //.constant('API_SERVER', 'api.bigcity.today')
    .run(['$rootScope', '$state', '$stateParams', 'localStorageService', '$http',
        function ($rootScope, $state, $stateParams, localStorageService, $http) {
            'use strict';
            $rootScope.userCacheName = 'webusr'; // TODO. This is a constant.
            $rootScope.curUser = localStorageService.get($rootScope.userCacheName);
            $rootScope.cache = localStorageService;
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

            if ($rootScope.curUser) {
                $http.defaults.headers.common.Authorization = 'Token ' + $rootScope.curUser.token;
            }

            $rootScope.$on('$stateChangeStart', function () {
                angular.element('#wrapper').toggleClass('whirl traditional');
            });
            $rootScope.$on('$stateChangeSuccess', function () {
                angular.element('#wrapper').toggleClass('whirl traditional');
            });
        }])

    .config(['$urlRouterProvider', 'localStorageServiceProvider', '$resourceProvider',
        function ($urlRouterProvider, localStorageServiceProvider, $resourceProvider) {
            'use strict';
            localStorageServiceProvider
                .setStorageType('sessionStorage')
                .setNotify(false, false);
            $resourceProvider.defaults.stripTrailingSlashes = false;

            $urlRouterProvider
                .when('/', '/')
                .when('/search/', '/search/all')
                .when('/advert/', '/advert/')
                .when('/login/', '/login/')
                .when('/logout/', '/logout/')
                .otherwise('/');
        }]
    )
    .config(['$translateProvider', function ($translateProvider) {
        $translateProvider.translations('en_EN', {
            'LOGIN':'Login',
            'SIGNUP': 'Signup',
            'POST_FREE_ADD': 'Post a Free Ad',
            'UPDATE_ADVERT_CATEGORY': 'Update advert. Category',
            'FIND_CLASSIFIED_ADS_H1': 'Find classified ads',
            'FIND_CLASSIFIED_ADS_P': 'Find local classified ads on Bigcity in Minutes',
            'LOCATION': 'Location',
            'I_AM_LOOKING_FOR': 'I\'m looking for a ...',
            'FIND': 'Find',
            'FIND_WORLD_WIDE': 'Find Classified Ads World Wide',
            'TRUSTED_SELLER': 'Trusted Seller',
            'CATEGORIES': 'Categories',
            'CATEGORY': 'Category',
            'LOCATIONS': 'Locations',
            'FACEBOOK_FANS': 'Facebook Fans',
            'PAGE_BOTTOM_INFO_CONTENT': 'If you have any questions, comments or concerns, please call the ' +
                                        'Classified Advertising department at (000) 555-5555',
            'CALL_NOW': 'Call Now',
            'HOME': 'Home',
            'TERMS_AND_CONDITIONS': 'Terms and Conditions',
            'PRIVACY_POLICY': 'Privacy Policy',
            'CONTACT_US': 'Contact Us',
            'FAQ': 'FAQ',
            'USERNAME': 'Username',
            'PASSWORD': 'Password',
            'SUBMIT': 'Submit',
            'ABOUT_US': 'About Us',
            'LOST_YOUR_PASSWORD': 'Lost Your Password',
            'DONT_HAVE_ACCOUNT': 'Don\'t have an account',
            'CREATE_FREE_ACCOUNT': 'Create your account, Its free',
            'FIRST_NAME': 'First Name',
            'LAST_NAME': 'Last Name',
            'PHONE': 'Phone Number',
            'CURRENT_LOCATION': 'Your Current Location',
            'STATE_CITY_ADDRESS': 'State, City, Street',
            'GENDER': 'Gender',
            'MALE': 'Male',
            'FEMALE': 'Female',
            'ABOUT_YOURSELF': 'About Yourself',
            'EMAIL': 'Email',
            '6_CHARS': 'At least 6 characters',
            'READ_AND_AGREE': 'I have read and agree with',
            'POST_A_FREE_AD': 'Post a Free Classified Ad',
            'STEP_1': 'Step 1. Create your ad.',
            'STEP_2': 'Step 2. Upload your photos',
            'TITLE': 'Ad title',
            'GREAT_TITLE_NEED': 'A great title needs at least 60 characters.',
            'DESCRIBE': 'Describe Ad',
            'GENERAL_SQUARE': 'General square of an appartment',
            'PROVIDE_GENERAL_SQUARE': 'Provide general square in a meters',
            'HOUSEROOM': 'Houseroom',
            'PROVIDE_HOUSEROOM': 'Please provide a houseroom in a meters',
            'HEIGHT_OF_APPART': 'A height of an appartment',
            'PROVIDE_HEIGHT_OF_APPART': 'Provide height of an appartment in a meters',
            'NUMBER_OF_ROOMS': 'Number of rooms in an appartment',
            'NUMBER_OF_FLOORS': 'What number of floors your building have?',
            'FLOOR_OF_A_FLAT': 'What floor your flat is on?',
            'BUILDING_WALL': 'Type of a building\'s wall.',
            'BRICK': 'Brick',
            'FERROCONCRETE': 'Ferroconcrete',
            'BUILDING_TYPE': 'Type of a building',
            'NEW': 'New',
            'SECONDARY': 'Secondary',
            'PRICE': 'Price',
            'PLEASE_SAVE_YOUR_AD': 'Please save your advert first',
            'ADD_UP_TO_5_PHOTOS': 'Add up to 5 photos. Use a real image of your product, not catalogs.',
            'FILE': 'File',
            'ACTION': 'Action',
            'CANCEL': 'Cancel',
            'UPLOAD': 'Upload',
            'REMOVE': 'Remove',
            'SAVE': 'Save',
            'ALL_CATEGORIES': 'All Categories',
            'MORE_ADS_BY_USER': 'More ads by user',
            'ALL_ADS': 'All Ads',
            'PRICE_RANGE': 'Price Range',
            'DO_YOU_GET_ANYTHING': 'Do you get anything for sell ?',
            'NEXT': 'Next',
            'PREV': 'Prev',
            'THERE_WERE_NO_ADS': 'There were no adverts found',
            'SIGNOUT': 'Signout',
            'PERSONAL_HOME': 'Personal Home',
            'MY_ADS': 'My Ads',
            'ENTER_TEXT': 'e.g. Mobile Sale',
            'HELLO': 'Hello',
            'LAST_LOGGED_IN': 'You last loged in at',
            'MY_DETAILS': 'My Details',
            'NEW_PASSWORD': 'New Password',
            'CONFIRM_PASSWORD': 'Confirm Password',
            'UPDATE': 'Update',
            'PASSWORDS_DOESNT_MATCH': 'Passwords doesn\'t match',
            'ATTACHED_FILES': 'Attached files',
            'BACK_TO_RESULTS': 'Back to results',
            'ADS_DETAILS': 'Ads Details',
            'SHARE_AD': 'Share Ad',
            'SEND_MESSAGE': 'Send a message',
            'CONTACT_SELLER': 'Contact Seller',
            'JOINED': 'Contact Seller',
            'POSTED_ON': 'Posted On'
        });

        $translateProvider.translations('ua_UA', {
            'POSTED_ON': 'Дата створення',
            'JOINED': 'Зареєструвався',
            'CONTACT_SELLER': 'Зв’язатись з продавцем',
            'SEND_MESSAGE': 'Надіслати повідомлення',
            'SHARE_AD': 'Поділитись...',
            'MORE_ADS_BY_USER': 'Більше оголошень',
            'ADS_DETAILS': 'Деталі',
            'BACK_TO_RESULTS': 'Повернутись до результатів',
            'ALL_ADS': 'Всі оголошення',
            'ATTACHED_FILES': 'Прикріплені файли',
            'UPDATE_ADVERT_CATEGORY': 'Оновити оголошення. Категорія',
            'PASSWORDS_DOESNT_MATCH': 'Паролі не співпадають',
            'UPDATE': 'Оновити',
            'CONFIRM_PASSWORD': 'Повторіть ще раз',
            'NEW_PASSWORD': 'Новий пароль',
            'MY_DETAILS': 'Мій профіль',
            'LAST_LOGGED_IN': 'Востаннє Ви заходити о',
            'HELLO': 'Привіт',
            'ENTER_TEXT': 'Введіть текст...',
            'MY_ADS': 'Мої Оголошення',
            'PERSONAL_HOME': 'Моя домівка',
            'SIGNOUT': 'Вийти',
            'SAVE': 'Зберегти',
            'THERE_WERE_NO_ADS': 'Нажаль, нічого не знайдено',
            'NEXT': 'Наступний',
            'PREV': 'Попередній',
            'DO_YOU_GET_ANYTHING': 'Маєте що продати ?',
            'PRICE_RANGE': 'Ціновий діапазон',
            'ALL_CATEGORIES': 'Всі Категорії',
            'REMOVE': 'Видалити',
            'UPLOAD': 'Завантажити',
            'CANCEL': 'Відмінити',
            'ACTION': 'Дія',
            'FILE': 'Файл',
            'ADD_UP_TO_5_PHOTOS': 'Додайте до 5 фотографій. ' +
                                  'Використовуйте реальні зображення вашого продукту, а не з каталогу',
            'PLEASE_SAVE_YOUR_AD': 'Будь-ласка, збережіть спочатку оголошення',
            'PRICE': 'Ціна',
            'NEW': 'Новий',
            'SECONDARY': 'Вторинний',
            'BUILDING_TYPE': 'Тип будівлі',
            'BRICK': 'Цегла',
            'FERROCONCRETE': 'Залізобетон',
            'BUILDING_WALL': 'Тип стіни',
            'FLOOR_OF_A_FLAT': 'Поверх квартири',
            'NUMBER_OF_FLOORS': 'Кількість поверхів',
            'NUMBER_OF_ROOMS': 'Кількість кімнат',
            'HEIGHT_OF_APPART': 'Висота кімнати',
            'PROVIDE_HEIGHT_OF_APPART': 'Вкажіть висоту кімнати в метрах',
            'PROVIDE_HOUSEROOM': 'Вкажіть житлову площу в метрах квадратних',
            'HOUSEROOM': 'Кімнатна площа',
            'PROVIDE_GENERAL_SQUARE': 'Вкажіть загальну площу в квадратних метрах',
            'GENERAL_SQUARE': 'Загальна площа квартири',
            'DESCRIBE': 'Опис',
            'GREAT_TITLE_NEED': 'Хороший заголовок вимагає щонайменше 60 символів',
            'TITLE': 'Заголовок',
            'CATEGORY': 'Категорія',
            'STEP_1': 'Крок 1. Створити оголошення',
            'STEP_2': 'Крок 2. Загрузити фото.',
            'POST_A_FREE_AD': 'Створити нове оголошення, безплатно',
            'READ_AND_AGREE': 'Я прочитав і погоджуюсь з',
            '6_CHARS': 'Щонайменше 6 символів',
            'EMAIL': 'Електронна адреса',
            'ABOUT_YOURSELF': 'Про себе',
            'MALE': 'Чоловіча',
            'FEMALE': 'Жіноча',
            'GENDER': 'Стать',
            'STATE_CITY_ADDRESS': 'Місто, область',
            'CURRENT_LOCATION': 'Поточна адреса',
            'PHONE': 'Телефон',
            'LAST_NAME': 'Ім’я',
            'ABOUT_US': 'Про нас',
            'DONT_HAVE_ACCOUNT': 'Ще не зареєстровані',
            'LOST_YOUR_PASSWORD': 'Забули пароль',
            'SUBMIT': 'Відправити',
            'PASSWORD': 'Пароль',
            'LOGIN':'Ввійти',
            'SIGNUP': 'Зареєструватись',
            'POST_FREE_ADD': 'Додати Оголошення',
            'FIND_CLASSIFIED_ADS_H1': 'Знайти оголошення',
            'FIND_CLASSIFIED_ADS_P': 'Знайти місцеві оголошення в Bigcity',
            'LOCATION': 'Місцезнаходження',
            'I_AM_LOOKING_FOR': 'Я намагаюсь знайти ...',
            'FIND': 'Пошук',
            'FIND_WORLD_WIDE': 'Знайти оголошення по цілому світі',
            'TRUSTED_SELLER': 'Перевірених продавців',
            'CATEGORIES': 'Категорій',
            'LOCATIONS': 'Місцезнаходжень',
            'FACEBOOK_FANS': 'Facebook користувачів',
            'PAGE_BOTTOM_INFO_CONTENT': 'Якщо у Вас виникли запитання або пропозиції, просимо звернутись за довідкою' +
                                        ' у наш відділ за телефоном (000) 555-5555',
            'CALL_NOW': 'Дзвоніть',
            'HOME': 'Домівка',
            'TERMS_AND_CONDITIONS': 'Умови та Використання',
            'PRIVACY_POLICY': 'Політика Приватності',
            'CONTACT_US': 'Контакти',
            'FAQ': 'Запитання',
            'USERNAME': 'Користувач',
            'CREATE_FREE_ACCOUNT': 'Створити Ваш Рахунок, це безплатно',
            'FIRST_NAME': 'Прізвище'
        });
        $translateProvider.use('ua_UA');
    }]
);


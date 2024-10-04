'use strict';

const dev = {
    API_URL: 'http://192.168.2.119:3000/api',
    API_VERSION: {
        V1: '/v1'
    },
    END_POINTS:{
        LOGIN: '/auth/login',
        SIGN_UP: '/auth/signup',
        LOGOUT: '/auth/logout',
        REFRESH_TOKEN:'/refresh-token',
        PROFILE: '/auth/profile',
        CHANGE_PASSWORD:'/auth/change-password',
        USER_STATUS:'/auth/status',
    }
}

const prod = {
	API_VERSION: {
		V1: '/v1',
	},
	API_URL: 'http://localhost:3000/api',
	END_POINTS: {
		LOGIN: '/login',
		REGISTER: '/register',
		LOGOUT: '/logout',
		PROFILE: '/profile',
	},
};

module.exports = dev;

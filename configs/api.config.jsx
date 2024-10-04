'use strict';

const dev = {
	API_URL: 'http://192.168.2.240:8000/api',
	API_VERSION: {
		V1: '/v1',
	},
	END_POINTS: {
		LOGIN: '/auth/login',
		SIGN_UP: '/auth/signup',
		LOGOUT: '/auth/logout',
		REFRESH_TOKEN: '/refresh-token',
		PROFILE: '/auth/profile',
		CHANGE_PASSWORD: '/auth/change-password',
		USER_STATUS: '/auth/status',  
		GET_QUIZ_BY_USER: '/quizzes/get-by-user',
		GET_QUIZ_QUESTIONS: '/quizzes/get-questions',
		GET_QUESTION_DETAIL: '/questions/get-details',
		QUESTION_UPDATE: '/questions/update',
		QUESTION_CREATE: '/questions/create',
		QUIZ_DETAIL: '/quizzes/get-details',
		QUIZ_CREATE: '/quizzes/create',
	},
};

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

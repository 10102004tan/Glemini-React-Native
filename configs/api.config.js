'use strict';

const dev = {
	API_URL: 'http:////10.0.160.60:3000/api',
	API_VERSION: {
		V1: '/v1',
	},
	END_POINTS: {
		SERVER: '/working',
		LOGIN: '/auth/login',
		SIGN_UP: '/auth/signup',
		LOGOUT: '/auth/logout',
		REFRESH_TOKEN: '/refresh-token',
		PROFILE: '/user/profile',
		PROFILE_EDIT: '/user/profile',
		CHANGE_PASSWORD: '/auth/change-password',
		USER_STATUS: '/auth/status',
		GET_QUIZ_BY_USER: '/quizzes/get-by-user',
		GET_QUIZ_QUESTIONS: '/quizzes/get-questions',
		GET_QUESTION_DETAIL: '/questions/get-details',
		QUESTION_UPDATE: '/questions/update',
		QUESTION_CREATE: '/questions/create',
		QUESTION_UPLOAD_IMAGE: '/questions/upload',
		QUIZ_UPLOAD_IMAGE: '/quizzes/upload',
		QUIZ_DETAIL: '/quizzes/get-details',
		QUIZ_CREATE: '/quizzes/create',
		QUIZ_DELETE: '/quizzes/delete',
		QUIZ_UPLOAD_DOC: '/quizzes/docs/upload',
		RESULT_SAVE_QUESTION: '/result/save-question',
		RESULT_COMPLETED: '/result/complete-quiz',
		RESULT_REVIEW: '/result/review',
		QUIZ_UPDATE: '/quizzes/update',
		SUBJECTS: '/subjects',
		SCHOOL_LIST: '/schools',
	},
};

const prod = {
	API_VERSION: {
		V1: '/v1',
	},
	API_URL: 'http://localhost:8000/api',
	END_POINTS: {
		LOGIN: '/login',
		REGISTER: '/register',
		LOGOUT: '/logout',
		PROFILE: '/profile',
	},
};

module.exports = dev;
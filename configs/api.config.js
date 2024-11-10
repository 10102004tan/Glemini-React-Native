'use strict';

const dev = {
	API_URL: 'http://192.168.247.116:3000/api',

	API_VERSION: {
		V1: '/v1',
	},

	END_POINTS: {
		SERVER: '/working',

		// Authentication
		LOGIN: '/auth/login',
		SIGN_UP: '/auth/signup',
		LOGOUT: '/auth/logout',
		VERIFY_OTP: '/auth/verify-otp',
		RESET_PASSWORD: '/auth/reset-password',
		REFRESH_TOKEN: '/auth/refresh-token',
		PROFILE: '/user/profile',
		PROFILE_EDIT: '/user/profile',
		RE_UPLOAD: '/user/profile/verification/re-upload',
		USER_NOTIFICATION: '/user/notifications',
		PROFILE_EDIT_AVATAR: '/user/profile/avatar',
		PROFILE_TEACHER_IMAGES: '/user/profile/verification/images',
		CHANGE_PASSWORD: '/auth/change-password',
		FORGOT_PASSWORD: '/auth/forgot-password',
		USER_STATUS: '/auth/status',

		// Notification
		UPDATE_NOTIFICATION_STATUS: '/notification',

		// Question
		GET_QUIZ_BY_USER: '/quizzes/get-by-user',
		GET_QUIZ_QUESTIONS: '/quizzes/get-questions',
		GET_QUESTION_DETAIL: '/questions/get-details',
		QUESTION_UPDATE: '/questions/update',
		QUESTION_CREATE: '/questions/create',
		QUESTION_CREATE_MANY: '/questions/creates',
		QUESTION_UPLOAD_IMAGE: '/questions/upload',
		QUESTION_DELETE: '/questions/delete',
		QUIZ_GENERATE_GEMINI_IMAGE: '/quizzes/gemini/generate/images',

		// Quizzes
		QUIZ_UPLOAD_IMAGE: '/quizzes/upload',
		QUIZ_DETAIL: '/quizzes/get-details',
		QUIZ_CREATE: '/quizzes/create',
		QUIZ_DELETE: '/quizzes/delete',
		QUIZ_PUBLISHED: '/quizzes/published',
		QUIZ_BANNER: '/quizzes/banner',
		QUIZ_UPLOAD_DOC: '/quizzes/docs/upload',
		QUIZ_UPLOAD_MD: '/quizzes/md/upload',
		QUIZ_UPLOAD_TXT: '/quizzes/txt/upload',
		QUIZ_GET_DOCX_TEMPLATE: '/quizzes/get-templates/template_docx',
		QUIZ_GET_MD_TEMPLATE: '/quizzes/get-templates/template_md',
		QUIZ_GET_TXT_TEMPLATE: '/quizzes/get-templates/template_txt',
		QUIZ_FILTER: '/quizzes/filter',
		QUIZ_GENERATE_GEMINI: '/quizzes/gemini/generate/prompt',
		QUIZ_UPDATE: '/quizzes/update',
		QUIZ_SEARCH: '/quizzes/search',
		GET_ALL_QUIZZES_SHARED: '/quizzes/get-all-quizzes-shared',
		REMOVE_QUIZ_SHARED: '/quizzes/remove-quiz-shared',

		// Results
		RESULT_STUDENT: '/result/student',
		RESULT_TEACHER: '/result/teacher',
		RESULT_SAVE_QUESTION: '/result/save-question',
		RESULT_COMPLETED: '/result/complete-quiz',
		RESULT_REVIEW: '/result/review',
		RESULT_OVERVIEW: '/result/overview',
		RESULT_REPORT: '/result/reports',

		// Subjects
		SUBJECTS: '/subjects',

		// Collection
		COLLECTION_CREATE: '/collections/create',
		COLLECTION_UPDATE_NAME: '/collections/update',
		COLLECTION_DELETE: '/collections/delete',
		COLLECTION_GET_DETAILS: '/collections/get-details',
		COLLECTION_ADD_QUIZ: '/collections/add-quiz',
		COLLECTION_REMOVE_QUIZ: '/collections/remove-quiz',
		COLLECTION_GETALL: '/collections',

		// School
		SCHOOL: '/schools',

		// Classroom
		CLASSROOM: '/classroom',
		CLASSROOM_CREATE: '/classroom/create',
		CLASSROOM_DELETE: '/classroom/delete',
		CLASSROOM_INFO: '/classroom/info',
		CLASSROOM_GET_BY_TEACHER: '/classroom/teacher',
		CLASSROOM_GET_BY_STUDENT: '/classroom/student',
		CLASSROOM_UPLOAD: '/classroom/upload',
		CLASSROOM_GET_EXCEL_TEMPLATE: '/classroom/get-templates/template_excel',
		CLASSROOM_ADD_STUDENT: '/classroom/add-student',
		CLASSROOM_ADD_QUIZ: '/classroom/add-quiz',
		CLASSROOM_REMOVE_STUDENT: '/classroom/rm-student',

		// Email
		CHECK_EMAIL: '/user/check-email',

		// Room
		ROOM_CREATE: '/room/create',
		ROOM_LIST: '/room/list',
		ROOM_DETAIL: '/room/detail',

		// Use for realtime play
		ROOM_GET_RESULTS: '/result/get-results',
		ROOM_UPDATE_RESULT: '/result/update-result',
		ROOM_UPDATE_STATUS: '/room/update',

		//user
		// CHECK_EMAIL: '/user/check-email',
		SHARE_QUIZ: '/user/share-quiz',

		// room
		ROOM_CREATE: '/room/create',
		ROOM_REPORT: '/room/report',

		// exercise
		EXERCISE_REPORT: '/exercise/report',
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

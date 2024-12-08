'use strict';
import { useAppProvider } from '@/contexts/AppProvider';
import markdownToTxt from 'markdown-to-txt';

const validateEmail = (email) => {
	const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
	return re.test(email);
};

const validatePassword = (password) => {
	// password must be at least 8 characters long
	const re = /^[A-Za-z0-9]{8,}$/g;
	return re.test(password);
};

const validateFullname = (fullname) => {
	return 1;
};

const convertSubjectData = (data) => {
	return data.map((item) => ({
		key: item._id,
		value: item.name,
	}));
};

// chuyển đổi data từ mongo sang
const collectionData = (data) => {
	return data.map((item) => ({
		key: item._id,
		value: item.collection_name,
		quizzes: item.quizzes,
	}));
};

// debounce function
const debounce = (fn, delay) => {
	delay = delay || 1000; // default delay falsy
	let timerId;
	console.log('debounce', timerId);
	return () => {
		if (timerId) {
			clearTimeout(timerId);
			timerId = null;
		}
		console.log('debounce2', timerId);
		timerId = setTimeout(() => {
			fn();
		}, delay);
		console.log('debounce3', timerId);
	};
};

// cut text
const truncateDescription = (description, maxLength) => {
	if (description.length <= maxLength) return description;
	const words = description.split(' ');
	let truncated = words[0];
	for (let i = 1; i < words.length; i++) {
		if ((truncated + ' ' + words[i]).length > maxLength) break;
		truncated += ' ' + words[i];
	}
	return truncated + '...';
};

const convertMarkdownToText = (markdown) => {
	return markdownToTxt(markdown);
};

const sortRankBoardDesc = (data) => {
	return {
		...data,
		rank: data.rank.sort((a, b) => b.userScore - a.userScore),
	};
};

const createdAtConvert = (dateString) => {
	const { i18n } = useAppProvider();
	const date = new Date(dateString);
	const now = new Date();
	const diffInSeconds = Math.floor((now - date) / 1000);

	if (diffInSeconds < 60) {
		return i18n.t('room_item.new');
	}

	const diffInMinutes = Math.floor(diffInSeconds / 60);
	if (diffInMinutes < 60) {
		return `${diffInMinutes} ${i18n.t('room_item.prevMinutes')}`;
	}

	const diffInHours = Math.floor(diffInMinutes / 60);
	if (diffInHours < 24) {
		return `${diffInHours} ${i18n.t('room_item.prevHour')}`;
	}

	const diffInDays = Math.floor(diffInHours / 24);
	if (diffInDays < 30) {
		return `${diffInDays} ${i18n.t('room_item.prevDay')}`;
	}

	const diffInMonths = Math.floor(diffInDays / 30);
	if (diffInMonths < 12) {
		return `${diffInMonths} ${i18n.t('room_item.prevMonth')}`;
	}

	const diffInYears = Math.floor(diffInMonths / 12);
	return `${diffInYears} ${i18n.t('room_item.prevYear')}`;
};

const convertSubjectToDataKeyValue = (subjects) => {
	if (subjects.length === 0) return;
	return subjects.map((item) => {
		return {
			key: item._id,
			value: item.name,
		};
	});
};

export {
	validateEmail,
	validatePassword,
	validateFullname,
	convertSubjectData,
	debounce,
	truncateDescription,
	collectionData,
	convertMarkdownToText,
	sortRankBoardDesc,
	createdAtConvert,
	convertSubjectToDataKeyValue,
};

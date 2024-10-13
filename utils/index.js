'use strict';

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
	return data.map((item, index) => ({
		key: item._id.toString(),
		value: item.name,
		selected: true,
	}));
};

// debounce function
const debounce = (fn, delay) => {
	delay = delay || 1000; // default delay falsy
	let timerId;
	console.log('debounce',timerId);
	return () => {
		if (timerId) {
			clearTimeout(timerId);
			timerId = null;
		}
		console.log('debounce2',timerId);
		timerId = setTimeout(() => {
			fn();
		}, delay);
		console.log('debounce3',timerId);
	}
}

export {
	validateEmail,
	validatePassword,
	validateFullname,
	convertSubjectData,
	debounce
};

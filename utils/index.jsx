'use strict';

const validateEmail = (email) => {
	const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
	return re.test(email);
};

const validatePassword = (password) => {
	// password must be at least 8 characters long and contain at least one number
	const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
	return re.test(password);
};

const validateFullname = (fullname) => {
	return 1;
};

const convertSubjectData = (data) => {
	return data.map((item, index) => ({
		key: item._id.toString(),
		value: item.name,
	}));
};

export {
	validateEmail,
	validatePassword,
	validateFullname,
	convertSubjectData,
};

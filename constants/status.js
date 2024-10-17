const Status = {
	quiz: {
		EXPLAINATION: 'EXPLAINATION',
		QUESTION: 'QUESTION',
		ANSWER: 'ANSWER',
	},
	// Chế độ hiển thị của quiz
	view: [
		{ key: 'published', value: 'Công khai', data_selected: 'published' },
		{
			key: 'unpublished',
			value: 'Chỉ mình tôi',
			data_selected: 'unpublished',
		},
	],
};

export default Status;

import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
	const [user, setUser] = useState({
		_id: '66fa6bed27be1817947b4281',
		user_fullname: 'Datto',
		user_email: 'dat@gmail.com',
		user_password: 'admin',
		user_type: 'student',
		user_phone: '',
		user_avatar: '',
		status: 'active',
		accessToken:
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjZmYTZiZWQyN2JlMTgxNzk0N2I0MjgxIiwidXNlcl9lbWFpbCI6ImRhdDYxMjIyQGdtYWlsLmNvbSIsInVzZXJfdHlwZSI6InN0dWRlbnQiLCJpYXQiOjE3Mjc3NzM2OTAsImV4cCI6MTcyNzk0NjQ5MH0.x69vpwo9MaRKU8lZzAoBoYCG1qSYFvuQ_GnvhU9QQyk',
	});

	const switchUserType = () => {
		setUser({
			...user,
			user_type: user.user_type === 'student' ? 'teacher' : 'student',
		});
	};

	return (
		<UserContext.Provider value={{ user, setUser, switchUserType }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUserProvider = () => {
	return useContext(UserContext);
};

export default UserProvider;

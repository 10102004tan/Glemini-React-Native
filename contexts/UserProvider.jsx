import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
	const [user, setUser] = useState({
		_id: '66fc2879dc333e9e009d7e35',
		user_fullname: 'Trần Trung Chiến',
		user_email: 'chientt@gmail.com',
		user_password: '1234567',
		user_type: 'student',
		user_phone: '',
		user_avatar: '',
		status: 'active',
		accessToken:
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjZmYzI4NzlkYzMzM2U5ZTAwOWQ3ZTM1IiwidXNlcl9lbWFpbCI6ImNoaWVudHRAZ21haWwuY29tIiwidXNlcl90eXBlIjoic3R1ZGVudCIsImlhdCI6MTcyNzg2Mjg2NSwiZXhwIjoxNzI4MDM1NjY1fQ.hOMIIDucPLbLfLsy9Vz5QSwHgfiyG7k3qUUAM4XWd7M'		 
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

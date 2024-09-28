import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
	const [user, setUser] = useState({
		_id: 1,
		user_fullname: 'Datto',
		user_email: 'dat@gmail.com',
		user_password: 'admin',
		user_type: 'admin',
		user_phone: '',
		user_avatar: '',
		status: 'active',
	});
	return (
		<UserContext.Provider value={{ user, setUser }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUserProvider = () => {
	return useContext(UserContext);
};

export default UserProvider;

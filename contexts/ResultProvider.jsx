import { View, Text } from 'react-native';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_URL, API_VERSION, END_POINTS } from '@/configs/api.config';
import { useAuthContext } from './AuthContext';

const ResultContext = createContext();

const ResultProvider = ({ children }) => {
	const [results, setResults] = useState([]);
	const { userData } = useAuthContext();
	// Lấy dữ liệu từ API
	const fetchResults = async () => {
		const response = await fetch(
			`${API_URL}${API_VERSION.V1}${END_POINTS.RESULT_STUDENT}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-client-id': userData._id,
					authorization: userData.accessToken,
				},
				body: JSON.stringify({ userId: userData._id }),
			}
		);

		const data = await response.json();

		if (data.statusCode === 200) {
			setResults(data.metadata);
		}
	};

	useEffect(() => {
		if (userData) {
			fetchResults();

		}
	}, [userData]);

	return (
		<ResultContext.Provider value={{
			results,
			fetchResults
		}}>
			{children}
		</ResultContext.Provider>
	);
};

export const useResultProvider = () => useContext(ResultContext);

export default ResultProvider;

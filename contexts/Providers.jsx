import React from 'react';
import AppProvider from './AppProvider';
import QuizProvider from './QuizProvider';
import QuestionProvider from './QuestionProvider';
import SubjectProvider from './SubjectProvider';
import { AuthProvider } from './AuthContext';
import ClassroomProvider from './ClassroomProvider';
import RoomProvider from './RoomProvider';
import ResultProvider from './ResultProvider';

const combineProviders = (...providers) =>
	providers.reduce(
		(Combined, Provider) =>
			({ children }) => (
				<Combined>
					<Provider>{children}</Provider>
				</Combined>
			),
		({ children }) => <>{children}</> // Trả về children nếu không có provider nào
	);

const Providers = combineProviders(
	AppProvider, // Thêm AppProvider
	AuthProvider, // Thêm AuthContext
	QuizProvider, // Thêm QuizProvider
	QuestionProvider, // Thêm QuestionProvider
	SubjectProvider, // Thêm SubjectProvider
	ClassroomProvider, // Thêm ClassroomProvider
	RoomProvider, // Thêm RoomProvider
	ResultProvider, // Thêm ResultProvider
);

export default Providers;

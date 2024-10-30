import { View, Text} from 'react-native';
import React, {useContext} from 'react';
import Wrapper from '@/components/customs/Wrapper';
import { useClassroomProvider } from '@/contexts/ClassroomProvider';
const StudentDetail = () => {
	const { classroom, fetchClassroom } = useClassroomProvider();
	return (
		<Wrapper>
			<Text>Student Detail</Text>
		</Wrapper>
	);
};

export default StudentDetail;

import { View, Text} from 'react-native';
import React, {useContext} from 'react';
import Wrapper from '@/components/customs/Wrapper';
import {AuthContext} from "@/contexts/AuthContext";
import LockFeature from "@/components/customs/LockFeature";

const ClassroomScreen = () => {

	const {teacherStatus} = useContext(AuthContext);

	if (teacherStatus && teacherStatus === 'pedding' || teacherStatus === 'rejected') {
		return (
			<LockFeature/>
		)
	}
	
	return (
		<Wrapper>
			<Text>Classroom</Text>
		</Wrapper>

	);
};

export default ClassroomScreen;

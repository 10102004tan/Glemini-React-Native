import { View, Text} from 'react-native';
import React, {useContext} from 'react';
import Wrapper from '@/components/customs/Wrapper';
import {AuthContext} from "@/contexts/AuthContext";
import LockFeature from "@/components/customs/LockFeature";
import StudentView from '../(classroom)/student_view';
import TeacherView from '../(classroom)/teacher_view';

const ClassroomScreen = () => {

	const {teacherStatus, userData} = useContext(AuthContext);

	if (userData.user_type === 'student') {
		return <StudentView/>
	} else if (userData.user_type === 'teacher') {
		if (teacherStatus && (teacherStatus === 'pedding' || teacherStatus === 'rejected')) {
			return (
				<LockFeature/>
			)
		} else {
			return <TeacherView/>
		}
	}
	
};

export default ClassroomScreen;

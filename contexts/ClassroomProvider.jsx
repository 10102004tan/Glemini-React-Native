import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_URL, API_VERSION, END_POINTS } from '@/configs/api.config';
import { useAuthContext } from './AuthContext';

const ClassroomContext = createContext();

const ClassroomProvider = ({ children }) => {
    const [schools, setSchools] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [classroom, setClassroom] = useState([]);
    const { userData } = useAuthContext();

    // Lấy danh sách trường từ API
    const fetchSchools = async () => {
        const response = await fetch(
            `${API_URL}${API_VERSION.V1}${END_POINTS.SCHOOL}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-client-id': userData._id,
                    authorization: userData.accessToken,
                },
            }
        );

        const data = await response.json();

        if (data.statusCode === 200) {
            setSchools(data.metadata);
        }
    };

	const fetchClassrooms = async () => {
        const path = userData.user_type === 'teacher' ?
        `${API_URL}${API_VERSION.V1}${END_POINTS.CLASSROOM_GET_BY_TEACHER}`:
        `${API_URL}${API_VERSION.V1}${END_POINTS.CLASSROOM_GET_BY_STUDENT}`
		const response = await fetch(
            path,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-client-id': userData._id,
                    authorization: userData.accessToken,
                },
				body: JSON.stringify(
                    userData.user_type === 'teacher' ? {user_id: userData._id} : {_id: userData._id}
                )
            }
        );

        const data = await response.json();

        if (data.statusCode === 200) {
            setClassrooms(data.metadata);
        } else {
			setClassrooms([])
		}
	}

    const fetchClassroom = async (classroomId) => {
		const response = await fetch(
            `${API_URL}${API_VERSION.V1}${END_POINTS.CLASSROOM_INFO}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-client-id': userData._id,
                    authorization: userData.accessToken,
                },
				body: JSON.stringify({_id: classroomId})
            }
        );

        const data = await response.json();

        if (data.statusCode === 200) {
            setClassroom(data.metadata);
        } else {
			setClassroom([])
		}
	}

    // Hàm tạo lớp học
    const createClassroom = async (classData) => {
        try {
            const response = await fetch(
                `${API_URL}${API_VERSION.V1}${END_POINTS.CLASSROOM_CREATE}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-client-id': userData._id,
                        authorization: userData.accessToken,
                    },
                    body: JSON.stringify(classData),
                }
            );

            const data = await response.json();

            if (data.statusCode === 200) {
                setClassrooms((prevClassrooms) => [...prevClassrooms, data.metadata]);
            } else {
                setClassrooms([])
            }
        } catch (error) {
            console.error('Error creating classroom:', error);
            setClassrooms([])
        }
    };


    const removeStudent = async (classroomId, studentId) => {
        try {
            const response = await fetch(
                `${API_URL}${API_VERSION.V1}${END_POINTS.CLASSROOM_REMOVE_STUDENT}/${classroomId}/students/${studentId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-client-id': userData._id,
                        authorization: userData.accessToken,
                    }
                }
            );

            const data = await response.json();

            if (data.statusCode === 200) {
                setClassroom((prevClassroom) => ({
                    ...prevClassroom,
                    students: prevClassroom.students.filter((student) => student._id !== studentId),
                }));
            } else {
                console.error('Failed to remove student:', data.message);
            }
        } catch (error) {
            console.error('Error removing student:', error);
        }
    };

    const addStudent = async (classroomId, studentEmail) => {
        try {
            const response = await fetch(
                `${API_URL}${API_VERSION.V1}${END_POINTS.CLASSROOM_ADD_STUDENT}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-client-id': userData._id,
                        authorization: userData.accessToken,
                    },
                    body: JSON.stringify(
                        {
                            classroomId: classroomId, 
                            user_email: studentEmail
                        }
                    )
                }
            );

            const data = await response.json();

            if (data.statusCode === 200) {
                fetchClassroom(classroomId)
            } else {
                console.error('Failed to add student:', data.message);
            }
        } catch (error) {
            console.error('Error add student:', error);
        }
    };

    useEffect(() => {
        if (userData) {
            fetchSchools();
			fetchClassrooms();
        }
    }, [userData]);

    return (
        <ClassroomContext.Provider value={{ 
            schools, 
            classrooms, 
            createClassroom,
            setClassrooms,
            fetchClassroom, 
            fetchClassrooms, 
            classroom,
            removeStudent,
            addStudent
        }}>
            {children}
        </ClassroomContext.Provider>
    );
};

export const useClassroomProvider = () => useContext(ClassroomContext);
export default ClassroomProvider;

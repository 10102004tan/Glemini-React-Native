import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_URL, API_VERSION, END_POINTS } from '@/configs/api.config';
import { useAuthContext } from './AuthContext';
import Toast from 'react-native-toast-message-custom';

const ClassroomContext = createContext();

const ClassroomProvider = ({ children }) => {
    const [province, setProvince] = useState('');
	const [districts, setDistricts] = useState([]);
	const [selectDistrict, setSelectDistrict] = useState('');
	const [schools, setSchools] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [classroom, setClassroom] = useState([]);
    const { userData } = useAuthContext();

    // Lấy danh sách trường từ API
    // const fetchSchools = async () => {
    //     const response = await fetch(
    //         `${API_URL}${API_VERSION.V1}${END_POINTS.SCHOOL}`,
    //         {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'x-client-id': userData._id,
    //                 authorization: userData.accessToken,
    //             },
    //         }
    //     );

    //     const data = await response.json();

    //     if (data.statusCode === 200) {
    //         setSchools(data.metadata);
    //     }
    // };

    const fetchClassrooms = async () => {
        const path = userData.user_type === 'teacher' ?
            `${API_URL}${API_VERSION.V1}${END_POINTS.CLASSROOM_GET_BY_TEACHER}` :
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
                body: JSON.stringify({ user_id: userData._id })
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
                body: JSON.stringify({ _id: classroomId })
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

    const removeClassroom = async (classroomId) => {
        try {
            const response = await fetch(
                `${API_URL}${API_VERSION.V1}${END_POINTS.CLASSROOM_DELETE}/${classroomId}`,
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
                if (data.metadata === true) {
                    await fetchClassrooms()
                    Toast.show({
                        type: 'success',
                        text1: 'Xóa lớp học thành công',
                        visibilityTime: 1500
                    })
                } else {
                    Toast.show({
                        type: 'success',
                        text1: 'Xóa lớp học thất bại',
                        visibilityTime: 1500
                    })
                }
            } else {
                console.error('Failed to remove classroom:', data.message);
            }
        } catch (error) {
            console.error('Error removing student:', error);
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
                if (data.metadata === true) {
                    Toast.show({
                        type: 'success',
                        text1: 'Thêm mới thành công!',
                        autoHide: true,
                    });
                    fetchClassroom(classroomId)
                } 
                else {
                    Toast.show({
                        type: 'error',
                        text1: 'Thêm mới thất bại!',
                        autoHide: true,
                    });
                }
            } else {
                Toast.show({
                    type: 'error',
                    text1: data.message,
                    autoHide: true,
                })
            }
        } catch (error) {
            console.error('Error add student:', error);
        }
    };

    const addQuizToClassroom = async (name, classroomId, quizId, start, deadline) => {
        try {
            const response = await fetch(
                `${API_URL}${API_VERSION.V1}${END_POINTS.CLASSROOM_ADD_QUIZ}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-client-id': userData._id,
                        authorization: userData.accessToken,
                    },
                    body: JSON.stringify(
                        {
                            name: name,
                            classroomId: classroomId,
                            quizId: quizId,
                            start: start,
                            deadline: deadline
                        }
                    )
                }
            );

            const data = await response.json();

            if (data.statusCode === 200) {
                Toast.show({
                    type: 'success',
                    text1: "Giao bài tập thành công.",
                    visibilityTime: 1000,
                    autoHide: true,
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: "Giao bài tập thất bại.",
                    visibilityTime: 1000,
                    autoHide: true,
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: `${error}`,
                visibilityTime: 1000,
                autoHide: true,
            });
        }
    };

	const fetchDistrictQuery = async (provinceId) => {
        
		const body = {
			"operationName": "fetchDistrictQ",
			"variables": {
				"province": provinceId
			},
			"query": "query fetchDistrictQ($province: String!) {\n  fetchDistrict(province: $province) {\n    id\n    name\n    __typename\n  }\n}\n"
		}
		const response = await fetch(`https://violympic.vn/graphql`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			body: JSON.stringify(body)
		});
		const data = await response.json();
        setDistricts(data)
	}

	const fetchSchoolQuery = async (districtId) => {
		const body = {
			"operationName": "fetchSchoolQ",
			"variables": {
				"district": districtId
			},
			"query": "query fetchSchoolQ($district: String!) {\n  fetchSchool(district: $district) {\n    id\n    name\n    __typename\n  }\n}\n"
		}
		const response = await fetch(`https://violympic.vn/graphql`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			body: JSON.stringify(body)
		});
		const data = await response.json();
		setSchools(data)
	}

    useEffect(() => {
        if (userData) {
            fetchClassrooms();
        }
    }, [userData]);

    return (
        <ClassroomContext.Provider value={{
            schools,
            setSchools,
            classrooms,
            createClassroom,
            setClassrooms,
            fetchClassroom,
            fetchClassrooms,
            classroom,
            removeStudent,
            addStudent,
            addQuizToClassroom,
            removeClassroom,
			fetchSchoolQuery,
			fetchDistrictQuery,
			province, setProvince, districts, setDistricts, selectDistrict, setSelectDistrict
        }}>
            {children}
        </ClassroomContext.Provider>
    );
};

export const useClassroomProvider = () => useContext(ClassroomContext);
export default ClassroomProvider;

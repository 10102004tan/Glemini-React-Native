import { View, Text } from 'react-native';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_URL, API_VERSION, END_POINTS } from '@/configs/api.config';
import { useAuthContext } from './AuthContext';

const SubjectContext = createContext();

const SubjectProvider = ({ children }) => {
  const [subjects, setSubjects] = useState([]);
  const { userData } = useAuthContext();
  // Lấy dữ liệu từ API
  const fetchSubjects = async () => {
    const response = await api.post(`${API_URL}${API_VERSION.V1}${END_POINTS.SUBJECTS}`);

    const data = await response.data;

    if (data.statusCode === 200) {
      setSubjects(data.metadata);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchSubjects();
    }
  }, [userData]);

  return <SubjectContext.Provider value={{ subjects }}>{children}</SubjectContext.Provider>;
};

export const useSubjectProvider = () => useContext(SubjectContext);

export default SubjectProvider;

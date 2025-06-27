import { View, Text } from 'react-native';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_URL, API_VERSION, END_POINTS } from '@/configs/api.config';
import { useAuthContext } from './AuthContext';
import api from '@/libs/axios';
import { useAuthStore } from '@/store/useAuthStore';

const SubjectContext = createContext();

const SubjectProvider = ({ children }) => {
  const [subjects, setSubjects] = useState([]);
  const {user} = useAuthStore();
  // Lấy dữ liệu từ API
  const fetchSubjects = async () => {
    const response = await api.post(`${API_VERSION.V1}${END_POINTS.SUBJECTS}`);
    if (response.data.statusCode === 200) {
      setSubjects(response.data.metadata);
    } else {
      console.error('Failed to fetch subjects:', response.data.message);
    }
  };

  useEffect(() => {
    if (user){
      fetchSubjects();
    }
  }, [user]);

  return <SubjectContext.Provider value={{ subjects }}>{children}</SubjectContext.Provider>;
};

export const useSubjectProvider = () => useContext(SubjectContext);

export default SubjectProvider;

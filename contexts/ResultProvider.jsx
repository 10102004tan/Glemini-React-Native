import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_URL, API_VERSION, END_POINTS } from '@/configs/api.config';
import { useAuthContext } from './AuthContext';
import Toast from 'react-native-toast-message-custom';
import api from '@/libs/axios';
import { useAuthStore } from '@/store/useAuthStore';

const ResultContext = createContext();

const ResultProvider = ({ children }) => {
  const [results, setResults] = useState([]);
  const [result, setResult] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [overViewData, setOverviewData] = useState([]);
  const { user } = useAuthStore();
  // Lấy dữ liệu từ API
  // Fetch results for teachers with optional filters
  const fetchResultsForTeacher = async (
    page = 1,
    sortOrder = 'newest',
    identifier = '',
    class_name = '',
    type = '',
  ) => {
    const path = `${API_VERSION.V1}${END_POINTS.RESULT_REPORT}`;
    const requestBody = {
      userId: user.user_id,
      page,
      sortOrder,
      identifier,
      class_name,
      type,
    };

    try {
      const response = await api.post(path, requestBody);
      const data = response.data;
      if (data.statusCode === 200) {
        console.log('[CONTEXT]:Result teacher=>', data.metadata);
        setResults(data.metadata);
        return data.metadata;
      }
    } catch (error) {
      console.log('[CONTEXT]:Result=>', error);
    }
  };

  // Fetch results for students without filters
  const fetchResultsForStudent = async () => {
    const path = `${API_VERSION.V1}${END_POINTS.RESULT_STUDENT}`;
    try {
      console.log('User ID:', user); // Use user._id from useAuthStore
      const body = {
        userId: user?.user_id, // Use user._id from useAuthStore
      };
      const response = await api.post(path, body);
      const data = response.data;
      if (data.statusCode === 200) {
        console.log('[CONTEXT]:Result=>', data.metadata);
        setResults(data.metadata);
        return data.metadata;
      }
    } catch (error) {
      console.log('[CONTEXT]:Result=>', error);
    }
  };

    const fetchResultData = async ({ quizId, exerciseId, roomId, type }) => {
      const query = {
        user_id: user.user_id,
        quiz_id: quizId,
        type,
        ...(exerciseId && { exercise_id: exerciseId }),
        ...(roomId && { room_id: roomId }),
      };

      // console.log(query);

      try {
        const res = await api.post(`${API_VERSION.V1}${END_POINTS.RESULT_REVIEW}`, query);
        const data = await res.data;
        setResult(data.metadata);
        return data.metadata;
      } catch (error) {
        Toast.show({
          type: 'warn',
          text1: 'Đang lấy kết quả: ' + error.message,
          visibilityTime: 1000,
          autoHide: true,
        });
        return null;
      }
    };

    const fetchOverViewData = async (id) => {
      try {
        const res = await api.post(`${API_VERSION.V1}${END_POINTS.RESULT_OVERVIEW}`, { id });

        const data = await res.data;
        setOverviewData(data.metadata);
      } catch (error) {
        Toast.show({
          type: 'warn',
          text1: 'Đang lấy kết quả',
          visibilityTime: 1000,
          autoHide: true,
        });
      }
    };

    const fetchResetResultOfQuiz = async (resultId) => {
      console.log(resultId);

      const res = await api.post(`${API_VERSION.V1}${END_POINTS.RESULT_RESET_V2}`, { resultId });

      const data = await res.data;
      if (data.statusCode === 200) {
        return data.metadata;
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi.',
          text2: { error },
          visibilityTime: 1000,
          autoHide: true,
        });
      }
    };

    const completed = async (exerciseId, quizId) => {
      console.log(exerciseId, quizId);

      try {
        const res = await api.post(`${API_VERSION.V1}${END_POINTS.RESULT_COMPLETED}`, {
          exercise_id: exerciseId,
          user_id: user.user_id,
          quiz_id: quizId,
          status: 'completed',
        });

        const data = await res.data;

        if (data.statusCode === 200) {
          return data.metadata;
        } else {
          return null;
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Lỗi khi cập nhật trạng thái hoàn thành.',
          text2: { error },
          visibilityTime: 1000,
          autoHide: true,
        });
      }
    };

    /**
     * Fetch report detail for a specific result
     * @param {*} id
     * @param {*} type
     */
    const fetchReportDetail = async (id, type) => {
      const path =
        type === 'room'
          ? API_URL + API_VERSION.V1 + END_POINTS.ROOM_REPORT
          : API_URL + API_VERSION.V1 + END_POINTS.EXERCISE_REPORT;
      try {
        const res = await api.post(path, { id });

        const data = await res.data;
        setReportData(data.metadata);
      } catch (error) {
        Toast.show({
          type: 'warn',
          text1: 'Đang lấy kết quả',
          visibilityTime: 1000,
          autoHide: true,
        });
      }
    };

    useEffect(() => {
      if (user) {
        fetchResultsForStudent();
      }
    }, []);

    return (
      <ResultContext.Provider
        value={{
          results,
          fetchResultsForStudent,
          fetchResultsForTeacher,
          fetchResultData,
          result,
          completed,
          reportData,
          fetchReportDetail,
          overViewData,
          fetchOverViewData,
          fetchResetResultOfQuiz,
        }}
      >
        {children}
      </ResultContext.Provider>
    );
  };
export const useResultProvider = () => useContext(ResultContext);
export default ResultProvider;

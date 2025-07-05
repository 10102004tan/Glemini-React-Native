import React, { createContext, useContext, useEffect, useState } from 'react';
// import { useAuthContext } from "./AuthContext";
import { API_URL, API_VERSION, END_POINTS } from '../configs/api.config';
import { router } from 'expo-router';
import api from '@/libs/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { useAuthContext } from './AuthContext';
import { Alert } from 'react-native';
const QuizContext = createContext();
const QuizProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([]); // By User
  const [filterQuizzes, setFilterQuizzes] = useState([]); // Get Publish
  const [bannerQuizzes, setBannerQuizzes] = useState([]); // Banner
  const [needUpdate, setNeedUpdate] = useState(false);
  const [quizFetching, setQuizFetching] = useState(false);
  const [questionFetching, setQuestionFetching] = useState(false);
  const [actionQuizType, setActionQuizType] = useState('create');
  const [isSave, setIsSave] = useState(false);
  // const { userData } = useAuthContext();
  const { user } = useAuthStore();
  const LIMIT = 10;
  const [isEdited, setIsEdited] = useState(false);
  const [sharedQuizzes, setSharedQuizzes] = useState([]);

  // Get all quizzes of the user - UPDATED TO V2
  const fetchQuizzes = async ({ skip = 0, limit = LIMIT }) => {
    if (!quizFetching) {
      setQuizFetching(true);
      try {
        // V2 API - RESTful approach with query params
        const response = await api.get(`${API_VERSION.V2}/quizzes/user`, {
          params: {
            user_id: user.user_id,
            skip,
            limit,
          },
        });
        const data = response.data;

        if (data.message === 'Get quizzes successfully') {
          if (data.metadata.length > 0) {
            if (skip === 0) {
              setQuizzes(data.metadata);
            } else {
              setQuizzes([...quizzes, ...data.metadata]);
            }
          } else {
            // Không có dữ liệu, ngừng load thêm dữ liệu mới nữa
            setQuizzes((prev) => [...prev]);
          }
        }
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        // Fallback to V1 if V2 fails
        const body = {
          user_id: user.user_id,
          skip,
          limit,
        };
        const response = await api.post(`${API_VERSION.V1}${END_POINTS.GET_QUIZ_BY_USER}`, body);
        const data = response.data;
        if (data.statusCode === 200) {
          if (data.metadata.length > 0) {
            if (skip === 0) {
              setQuizzes(data.metadata);
            } else {
              setQuizzes([...quizzes, ...data.metadata]);
            }
          } else {
            setQuizzes((prev) => [...prev]);
          }
        }
      }
      setQuizFetching(false);
      setNeedUpdate(false);
    }
  };

  // hàm xóa quiz đã chia sẻ - KEEP V1 (no V2 endpoint yet)
  const removeQuizShared = async (quiz_id) => {
    const body = {
      user_id: user.user_id,
      quiz_id: quiz_id,
    };
    const response = await api.post(`${API_VERSION.V1}${END_POINTS.REMOVE_QUIZ_SHARED}`, body);
    const data = response.data;
    if (data.statusCode === 200) {
      setSharedQuizzes(sharedQuizzes.filter((quiz) => quiz._id !== quiz_id));
    }
  };

  // Get Quiz Published - KEEP V1 (no V2 endpoint yet)
  // const getQuizzesPublished = async () => {
  //   const response = await api.post(`${API_VERSION.V1}${END_POINTS.QUIZ_PUBLISHED}`, {
  //     user_id: user.user_id,
  //   });

  //   const data = response.data;

  //   if (data.statusCode === 200) {
  //     setFilterQuizzes(data.metadata);
  //   } else {
  //     setFilterQuizzes([]);
  //   }
  // };

  /**
   * Description: Get quizzes for banner - KEEP V1 (no V2 endpoint yet)
   * @returns {Promise<void>}
   */
  // const getQuizzesBanner = async () => {
  //   const response = await api.post(`${API_VERSION.V1}${END_POINTS.QUIZ_BANNER}`, {
  //     user_id: user.user_id,
  //   });
  //   const data = response.data;
  //   if (data.statusCode === 200) {
  //     setBannerQuizzes(data.metadata);
  //   } else {
  //     setBannerQuizzes([]);
  //   }
  // };

  // Delete quiz - UPDATED TO V2
  const deleteQuiz = async (quizId) => {
    try {
      // V2 API - RESTful DELETE
      const response = await api.delete(`${API_VERSION.V2}${END_POINTS.V2.QUIZ_DELETE}/${quizId}`);
      const data = response.data;

      if (data.message === 'Delete quiz successfully') {
        setNeedUpdate(true);
        return true;
      }
    } catch (error) {
      console.error('Error deleting quiz with V2:', error);
      // Fallback to V1 if V2 fails
      const body = {
        quiz_id: quizId,
        user_id: user.user_id,
      };
      const response = await api.post(`${API_VERSION.V1}${END_POINTS.QUIZ_DELETE}`, body);
      const data = response.data;
      if (data.statusCode === 200) {
        setNeedUpdate(true);
        return true;
      }
    }
    return false;
  };

  // Update quiz - UPDATED TO V2
  const updateQuiz = async (quiz) => {
    try {
      // V2 API - RESTful PUT
      const response = await api.put(
        `${API_VERSION.V2}${END_POINTS.V2.QUIZ_UPDATE}/${quiz._id || quiz.quiz_id}`,
        quiz,
      );
      const data = response.data;

      if (data.message === 'Update quiz successfully') {
        setNeedUpdate(true);
        setIsSave(false);
        return true;
      }
    } catch (error) {
      console.error('Error updating quiz with V2:', error);
      // Fallback to V1 if V2 fails
      const body = {
        ...quiz,
        user_id: user.user_id,
      };
      const response = await api.post(`${API_VERSION.V1}${END_POINTS.QUIZ_UPDATE}`, body);
      const data = response.data;
      if (data.statusCode === 200) {
        setNeedUpdate(true);
        setIsSave(false);
        return true;
      }
    }
    return false;
  };

  // Update quiz if need
  useEffect(() => {
    if (needUpdate) {
      fetchQuizzes({ skip: 0 });
      setNeedUpdate(false);
    }
  }, [needUpdate]);

  /**
   * Description: Duplicate quiz - UPDATED TO V2
   * @param {String} quiz_id
   * @returns {Boolean}
   * */
  const duplicateQuiz = async (quiz_id) => {
    try {
      // V2 API - RESTful POST for duplication
      const response = await api.post(
        `${API_VERSION.V2}${END_POINTS.V2.QUIZ_DUPLICATE}/${quiz_id}/duplicate`,
      );
      const data = response.data;

      if (data.message === 'Duplicate quiz successfully') {
        setNeedUpdate(true);
        return true;
      }
    } catch (error) {
      console.error('Error duplicating quiz with V2:', error);
      // Fallback to V1 if V2 fails
      const body = {
        quiz_id,
        user_id: user.user_id,
      };
      const response = await api.post(`${API_VERSION.V1}${END_POINTS.QUIZ_DUPLICATE}`, body);
      const data = response.data;
      if (data.statusCode === 200) {
        setNeedUpdate(true);
        return true;
      }
    }
    return false;
  };

  return (
    <QuizContext.Provider
      value={{
        actionQuizType,
        setActionQuizType,
        quizzes,
        setQuizzes,
        needUpdate,
        setNeedUpdate,
        quizFetching,
        questionFetching,
        deleteQuiz,
        updateQuiz,
        setQuestionFetching,
        setQuizFetching,
        isSave,
        setIsSave,
        fetchQuizzes,
        LIMIT,
        isEdited,
        setIsEdited,
        removeQuizShared,
        sharedQuizzes,
        setSharedQuizzes,
        duplicateQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuizProvider = () => {
  return useContext(QuizContext);
};

export default QuizProvider;

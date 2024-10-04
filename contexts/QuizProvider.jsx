import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";
import { API_URL, API_VERSION, END_POINTS } from "../configs/api.config";

const QuizContext = createContext();

const QuizProvider = ({ children }) => {
  const [selectedQuiz, setSelectedQuiz] = useState({});
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [actionQuizType, setActionQuizType] = useState("create");
  // const [createQuestionType, setCreateQuestionType] = useState('multiple');
  const { userData } = useAuthContext();
  const [needUpdate, setNeedUpdate] = useState(false);
  const [quizFetching, setQuizFetching] = useState(false);
  const [questionFetching, setQuestionFetching] = useState(false);

  // Get all quizzes of the user
  const fetchQuizzes = async () => {
    setQuizFetching(true);
    const response = await fetch(
      `${API_URL}${API_VERSION.V1}${END_POINTS.GET_QUIZ_BY_USER}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": userData._id,
          authorization: userData.accessToken,
        },
        body: JSON.stringify({ user_id: userData._id }),
      }
    );
    const data = await response.json();

    if (data.statusCode === 200) {
      setQuizzes(data.metadata);
      setQuizFetching(false);
    }
    // Handle error when fetch quizzes
  };
  // Get all questions of the selected quiz
  const fetchQuestions = async () => {
    setQuestionFetching(true);
    const response = await fetch(
      `${API_URL}${API_VERSION.V1}${END_POINTS.GET_QUIZ_QUESTIONS}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": userData._id,
          authorization: userData.accessToken,
        },
        body: JSON.stringify({ quiz_id: selectedQuiz._id }),
      }
    );
    const data = await response.json();
    // console.log(data.metadata);
    if (data.statusCode === 200) {
      setCurrentQuizQuestion(data.metadata);
    } else {
      setCurrentQuizQuestion([]);
    }
    setQuestionFetching(false);
  };

  // Get all quizzes of the user
  useEffect(() => {
    if (userData) {
      fetchQuizzes();
    }
  }, [userData]);

  // If NeedUpdate is true, fetch quizzes again
  // useEffect(() => {
  // 	if (needUpdate) {
  // 		fetchQuizzes();
  // 		setNeedUpdate(false);
  // 	}
  // }, [needUpdate]);

  // Get all questions of the selected quiz
  useEffect(() => {
    // console.log(selectedQuiz._id);
    if (userData && selectedQuiz._id) {
      fetchQuizzes();
      fetchQuestions();
    }
  }, [selectedQuiz, userData]);

  return (
    <QuizContext.Provider
      value={{
        selectedQuiz,
        setSelectedQuiz,
        quizzes,
        setQuizzes,
        needUpdate,
        setNeedUpdate,
        currentQuizQuestion,
        setCurrentQuizQuestion,
        actionQuizType,
        setActionQuizType,
        quizFetching,
        questionFetching,
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

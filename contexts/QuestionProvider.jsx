import React, { createContext, useContext, useEffect, useState } from "react";
import { router } from "expo-router";
import { useAuthContext } from "./AuthContext";
import { API_URL, API_VERSION, END_POINTS } from "@/configs/api.config";
const QuestionContext = createContext();
const QuestionProvider = ({ children }) => {
  const [question, setQuestion] = useState({
    question_excerpt: "<div>Nội dung câu hỏi</div>",
    question_description: "",
    question_image: "",
    question_audio: "",
    question_video: "",
    question_point: 1,
    question_time: 30,
    question_explanation: "",
    question_type: "multiple",
    correct_answer_ids: [],
    question_answer_ids: [
      {
        _id: 1,
        text: "Ấn vào để chỉnh sửa đáp án",
        image: "",
        correct: false,
      },
      {
        _id: 2,
        text: "Ấn vào để chỉnh sửa đáp án",
        image: "",
        correct: false,
      },
      {
        _id: 3,
        text: "Ấn vào để chỉnh sửa đáp án",
        image: "",
        correct: false,
      },
      {
        _id: 4,
        text: "Ấn vào để chỉnh sửa đáp án",
        image: "",
        correct: false,
      },
    ],
  });
  const [questions, setQuestions] = useState([]);
  const [updateQuestionId, setUpdateQuestionId] = useState(0);
  const { userData } = useAuthContext();

  // Get the current question to update
  const getCurrentUpdateQuestion = async () => {
    const response = await fetch(
      `${API_URL}${API_VERSION.V1}${END_POINTS.GET_QUESTION_DETAIL}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": userData._id,
          authorization: userData.accessToken,
        },
        body: JSON.stringify({ question_id: updateQuestionId }),
      }
    );
    const data = await response.json();
    console.log(data.metadata);
    if (data.statusCode === 200) {
      setQuestion(data.metadata);
      setUpdateQuestionId(0);
      router.push("/(app)/(quiz)/edit_quiz_question");
    } else {
      // Alert to user here
      console.log("Error when get question details");
    }
  };

  useEffect(() => {
    if (updateQuestionId !== 0) {
      getCurrentUpdateQuestion();
    }
  }, [updateQuestionId]);

  // Reset lại mảng câu hỏi
  const resetQuestion = () => {
    setQuestion({
      question_excerpt: "<div>Nội dung câu hỏi</div>",
      question_description: "",
      question_image: "",
      question_audio: "",
      question_video: "",
      question_point: 1,
      question_time: 30,
      question_explanation: "",
      question_type: "multiple",
      correct_answer_ids: [],
      question_answer_ids: [
        {
          _id: 1,
          text: "Ấn vào để chỉnh sửa đáp án",
          image: "",
          correct: false,
        },
        {
          _id: 2,
          text: "Ấn vào để chỉnh sửa đáp án",
          image: "",
          correct: false,
        },
        {
          _id: 3,
          text: "Ấn vào để chỉnh sửa đáp án",
          image: "",
          correct: false,
        },
        {
          _id: 4,
          text: "Ấn vào để chỉnh sửa đáp án",
          image: "",
          correct: false,
        },
      ],
    });
  };

  // Xóa một đáp án đã tạo
  const deleteAnswer = (id) => {
    if (question.question_answer_ids.length > 1) {
      const newAnswers = question.question_answer_ids.filter(
        (answer) => answer._id !== id
      );
      setQuestion({ ...question, question_answer_ids: newAnswers });
    }
  };

  // Đánh dấu đáp án chính xác
  const markCorrectAnswer = (id, isMultiple) => {
    // console.log(id);

    // Nếu không cho phép chọn nhiều đáp án, reset các đáp án về false
    const resetAnswers = isMultiple
      ? question.question_answer_ids
      : question.question_answer_ids.map((answer) => ({
          ...answer,
          correct: false,
        }));

    // Cập nhật câu trả lời có id tương ứng với việc đánh dấu đúng/sai
    const updatedAnswers = resetAnswers.map((answer) =>
      answer._id === id ? { ...answer, correct: !answer.correct } : answer
    );

    // console.log(updatedAnswers);

    // Cập nhật lại state với các câu trả lời mới
    setQuestion({ ...question, question_answer_ids: updatedAnswers });
  };

  // Đặt lại đánh dấu cho tất cả các đáp án đã đánh dấu chính xác
  const resetMarkCorrectAnswer = () => {
    const resetAnswers = question.question_answer_ids.map((answer) => ({
      ...answer,
      correct: false,
    }));
    setQuestion({ ...question, question_answer_ids: resetAnswers });
  };

  const findAnswer = (id) => {
    return question.question_answer_ids.find((answer) => answer._id === id);
  };

  // Thêm một đáp án mới
  const addAnswer = () => {
    const newAnswers = [
      ...question.question_answer_ids,
      {
        _id:
          question.question_answer_ids[question.question_answer_ids.length - 1]
            ._id + 1,
        text: "Ấn vào để chỉnh sửa đáp án",
        image: "",
        correct: false,
      },
    ];
    setQuestion({ ...question, question_answer_ids: newAnswers });
  };

  // Chỉnh sửa nội dung của đáp án
  const editAnswerContent = (id, content) => {
    const newAnswers = question.question_answer_ids.map((answer) => {
      if (answer._id === id) {
        return { ...answer, text: content };
      }
      return answer;
    });
    // console.log(newAnswers);
    setQuestion({ ...question, question_answer_ids: newAnswers });
  };

  // Cập nhật thời gian cho câu hỏi
  const updateQuestionTime = (time) => {
    setQuestion({ ...question, question_time: time });
  };

  // Cập nhật điểm cho câu hỏi
  const updateQuestionPoint = (point) => {
    setQuestion({ ...question, question_point: point });
  };

  // Kiểm tra nếu đáp án là đáp án chính xác
  const checkCorrectAnswer = (id) => {
    let correctAnswer = question.question_answer_ids.find(
      (answer) => answer._id === id && answer.correct === true
    );
    return correctAnswer;
    //		return question.question_answer_ids.some((answer) => answer._id === id);
  };

  // Lưu câu hỏi đã tạo lên server
  const saveQuestion = async (quizId) => {
    try {
      // Gọi API lưu câu hỏi
      const response = await fetch(
        `${API_URL}${API_VERSION.V1}${END_POINTS.QUESTION_CREATE}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-client-id": userData._id,
            authorization: userData.accessToken,
          },
          body: JSON.stringify({ ...question, quiz_id: quizId }),
        }
      );
      const data = await response.json();
      console.log(data)
      if (data.statusCode === 200) {
        console.log("Lưu câu hỏi thành công");
        // Alert to user here
        // Lưu câu hỏi vào mảng các câu hỏi
        setQuestions([...questions, question]);
        resetQuestion();
        router.replace("/(app)/(quiz)/" + quizId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const editQuestion = async (quizId, questionId) => {
    try {
      // Gọi API cập nhật câu hỏi
      const response = await fetch(
        `${API_URL}${API_VERSION.V1}${END_POINTS.QUESTION_UPDATE}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: userData.accessToken,
            "x-client-id": userData._id,
          },
          body: JSON.stringify({ ...question, quiz_id: quizId }),
        }
      );
      const data = await response.json();
      if (data.statusCode === 200) {
        console.log("Cập nhật câu hỏi thành công");
        // Alert to user here

        // Cập nhật lại câu hỏi vào mảng câu hỏi
        const newQuestions = questions.map((q) => {
          if (q.id === questionId) {
            return question;
          }
          return q;
        });

        setQuestions(newQuestions);
        resetQuestion();
        setUpdateQuestionId(0);
        router.replace("/(app)/(quiz)/" + quizId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <QuestionContext.Provider
      value={{
        questions,
        setQuestions,
        question,
        setQuestion,
        resetQuestion,
        deleteAnswer,
        markCorrectAnswer,
        addAnswer,
        findAnswer,
        resetMarkCorrectAnswer,
        editAnswerContent,
        saveQuestion,
        updateQuestionTime,
        updateQuestionPoint,
        editQuestion,
        updateQuestionId,
        checkCorrectAnswer,
        setUpdateQuestionId,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};

export const useQuestionProvider = () => {
  return useContext(QuestionContext);
};

export default QuestionProvider;

import React, { createContext, useContext, useEffect, useState } from 'react';
import { router } from 'expo-router';
import { useAuthContext } from './AuthContext';
import { API_URL, API_VERSION, END_POINTS } from '@/configs/api.config';
const QuestionContext = createContext();
const QuestionProvider = ({ children }) => {
   const [isChangeData, setIsChangeData] = useState(false);
   const [question, setQuestion] = useState({
      question_excerpt: '',
      question_description: '',
      question_image: '',
      question_audio: '',
      question_video: '',
      question_point: 1,
      question_time: 30,
      question_explanation: '',
      question_type: 'multiple',
      correct_answer_ids: [],
      question_answer_ids: [
         {
            _id: 1,
            text: 'Ấn vào để chỉnh sửa đáp án',
            image: '',
            correct: false,
         },
         {
            _id: 2,
            text: 'Ấn vào để chỉnh sửa đáp án',
            image: '',
            correct: false,
         },
         {
            _id: 3,
            text: 'Ấn vào để chỉnh sửa đáp án',
            image: '',
            correct: false,
         },
         {
            _id: 4,
            text: 'Ấn vào để chỉnh sửa đáp án',
            image: '',
            correct: false,
         },
      ],
   });
   const [questions, setQuestions] = useState([]);
   const { userData } = useAuthContext();

   const fetchQuestions = async (quizId) => {
      setQuestions([])
		try {
			const res = await fetch(API_URL + API_VERSION.V1 + END_POINTS.GET_QUIZ_QUESTIONS, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-client-id': userData._id,
					authorization: userData.accessToken,
				},
				body: JSON.stringify({
					quiz_id: quizId,
				}),
			});


			const data = await res.json();
			setQuestions(data.metadata);
		} catch (error) {
			Toast.show({
				type: 'error',
				text1: 'Lỗi khi lấy câu hỏi',
				text2: { error },
				visibilityTime: 1000,
				autoHide: true,
			});
		}
	};

   // Lấy nội dung câu hỏi từ file template docx
   const getQuestionFromTemplateFile = async (questionData, quizId) => {
      setQuestions([]); // Reset mảng câu hỏi

      const insertDatas = questionData.map((question) => {
         const q = {
            quiz_id: quizId,
            question_excerpt: question.question,
            question_answer_ids: question.answers.map((answer, index) => ({
               _id: index + 1,
               text: answer,
               image: '',
               correct: answer[0] === question.correctAnswer,
            })),
         };
         return q;
      });
      // console.log(JSON.stringify(insertDatas, null, 2));
      const data = await saveQuestions(insertDatas);
      if (data) {
         router.replace({
            pathname: '/(app)/(quiz)/overview/',
            params: { id: quizId },
         });
      }
   };

   // Hàm tạo các câu hỏi được generate từ AI
   const generateQuestionsFromGemini = async (questionData, quizId) => {
      setQuestions([]); // Reset mảng câu hỏi

      const insertDatas = questionData.map((question) => {
         const q = {
            quiz_id: quizId,
            question_excerpt: question.questionName,
            question_type: question.questionType,
            question_explanation: question.questionExplanation,
            question_description: '',
            question_image: '',
            question_audio: '',
            question_video: '',
            question_point: 1,
            question_time: 30,
            question_answer_ids: question.answers.map((answer, index) => ({
               _id: index + 1,
               text: answer.answerName,
               image: '',
               correct: answer.isCorrect,
            })),
         };

         return q;
      });

      const data = await saveQuestions(insertDatas);

      if (data) {
         router.replace({
            pathname: '/(app)/(quiz)/overview',
            params: { id: quizId },
         });
      }
   };

   // Reset lại mảng câu hỏi
   const resetQuestion = () => {
      setQuestion({
         question_excerpt: '',
         question_description: '',
         question_image: '',
         question_audio: '',
         question_video: '',
         question_point: 1,
         question_time: 30,
         question_explanation: '',
         question_type: 'multiple',
         correct_answer_ids: [],
         question_answer_ids: [
            {
               _id: 1,
               text: 'Ấn vào để chỉnh sửa đáp án',
               image: '',
               correct: false,
            },
            {
               _id: 2,
               text: 'Ấn vào để chỉnh sửa đáp án',
               image: '',
               correct: false,
            },
            {
               _id: 3,
               text: 'Ấn vào để chỉnh sửa đáp án',
               image: '',
               correct: false,
            },
            {
               _id: 4,
               text: 'Ấn vào để chỉnh sửa đáp án',
               image: '',
               correct: false,
            },
         ],
      });
   };

   // Chọn loại câu hỏi
   const selectQuestionType = (type) => {
      return setQuestion({ ...question, question_type: type });
   };

   // Tạo mẫu câu hỏi dạng box
   const createBoxQuestion = () => {
      const boxQuestion = {
         question_excerpt: '',
         question_description: '',
         question_image: '',
         question_audio: '',
         question_video: '',
         question_point: 1,
         question_time: 30,
         question_explanation: '',
         question_type: 'box',
         correct_answer_ids: [],
         question_answer_ids: [
            {
               _id: 1,
               text: 'Đáp án 1, Đán án 2',
               image: '',
               correct: true,
            },
         ],
      };
      setQuestion(boxQuestion);
   };

   // Tạo mẫu câu hỏi dạng blank
   const createBlankQuestion = () => {
      const blankQuestion = {
         question_excerpt: '',
         question_description: '',
         question_image: '',
         question_audio: '',
         question_video: '',
         question_point: 1,
         question_time: 30,
         question_explanation: '',
         question_type: 'blank',
         correct_answer_ids: [],
         question_answer_ids: [
            {
               _id: 1,
               text: 'Đán án của câu hỏi',
               image: '',
               correct: true,
            },
         ],
      };
      setQuestion(blankQuestion);
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

   // Xóa một câu hỏi
   const deleteQuestion = async (quizId, questionId) => {
      const response = await fetch(
         `${API_URL}${API_VERSION.V1}${END_POINTS.QUESTION_DELETE}`,
         {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'x-client-id': userData._id,
               authorization: userData.accessToken,
            },
            body: JSON.stringify({ question_id: questionId, quiz_id: quizId }),
         }
      );

      const data = await response.json();
      if (data.statusCode === 200) {
         const newQuestions = questions.filter((question) => question._id !== questionId);
         setQuestions(newQuestions);
         setIsChangeData(true);
         router.back();

      } else {
         console.log('Error when delete question');
      }
   }

   // Đánh dấu đáp án chính xác
   const markCorrectAnswer = (id, isMultiple) => {


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
               question.question_answer_ids[
                  question.question_answer_ids.length - 1
               ]._id + 1,
            text: 'Ấn vào để chỉnh sửa đáp án',
            image: '',
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
         if (question.question_excerpt === '') {
            alert('Nội dung câu hỏi không được để trống');
            return;
         }

         // Gọi API lưu câu hỏi
         const response = await fetch(
            `${API_URL}${API_VERSION.V1}${END_POINTS.QUESTION_CREATE}`,
            {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  'x-client-id': userData._id,
                  authorization: userData.accessToken,
               },
               body: JSON.stringify({ ...question, quiz_id: quizId }),
            }
         );
         const data = await response.json();
         console.log(data);
         if (data.statusCode === 200) {
            console.log('Lưu câu hỏi thành công');
            // Alert to user here
            // Lưu câu hỏi vào mảng các câu hỏi
            setQuestions([...questions, question]);
            resetQuestion();
            setIsChangeData(true);
            router.back();
         }
      } catch (error) {
         console.log(error);
      }
   };

   // Lưu một danh sách câu hỏi
   const saveQuestions = async (questions) => {
      try {
         // Gọi API lưu câu hỏi
         const response = await fetch(
            `${API_URL}${API_VERSION.V1}${END_POINTS.QUESTION_CREATE_MANY}`,
            {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  'x-client-id': userData._id,
                  authorization: userData.accessToken,
               },
               body: JSON.stringify({ questions }),
            }
         );
         const data = await response.json();
         console.log(JSON.stringify(data, null, 2));
         if (data.statusCode === 200) {
            console.log('Lưu câu hỏi thành công');
            // Alert to user here
            setQuestions(data.metadata);
            setIsChangeData(true);
            resetQuestion();
            return true;
         } else {
            return false;
         }
      } catch (error) {
         console.log(error);
         return false;
      }
   };

   // Cập nhật câu hỏi
   const editQuestion = async (quizId, questionId) => {
      // console.log(JSON.stringify({ ...question, quiz_id: quizId }, null, 2));
      console.log(JSON.stringify(questions, null, 2));

      try {
         // Gọi API cập nhật câu hỏi
         const response = await fetch(
            `${API_URL}${API_VERSION.V1}${END_POINTS.QUESTION_UPDATE}`,
            {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  authorization: userData.accessToken,
                  'x-client-id': userData._id,
               },
               body: JSON.stringify({ ...question, quiz_id: quizId }),
            }
         );
         const data = await response.json();
         console.log(data)
         if (data.statusCode === 200) {
            console.log('Cập nhật câu hỏi thành công');
            // Alert to user here

            // Cập nhật lại câu hỏi vào mảng câu hỏi
            const newQuestions = questions.map((q) => {
               if (q._id === questionId) {
                  return data.metadata;
               }
               return q;
            });

            console.log(JSON.stringify(newQuestions, null, 2));

            setQuestions(newQuestions);
            resetQuestion();
            setIsChangeData(true);
            // console.log('Quiz ID: ', quizId);
            router.back();
         }
      } catch (error) {
         console.log(error);
      }
   };

   // Lưu kết quả mỗi câu
   const saveQuestionResult = async (exerciseId, quizId, questionId, answerId, correct, score) => {
		await fetch(API_URL + API_VERSION.V1 + END_POINTS.RESULT_SAVE_QUESTION, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-client-id': userData._id,
				authorization: userData.accessToken,
			},
			body: JSON.stringify({
				exercise_id: exerciseId,
				user_id: userData._id,
				quiz_id: quizId,
				question_id: questionId,
				answer: answerId,
				correct,
				score,
			}),
		});
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
            checkCorrectAnswer,
            getQuestionFromTemplateFile,
            selectQuestionType,
            createBoxQuestion,
            createBlankQuestion,
            generateQuestionsFromGemini,
            deleteQuestion,
            isChangeData,
            setIsChangeData,
            fetchQuestions,
            saveQuestionResult
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

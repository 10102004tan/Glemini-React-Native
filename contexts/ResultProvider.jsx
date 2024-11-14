import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_URL, API_VERSION, END_POINTS } from '@/configs/api.config';
import { useAuthContext } from './AuthContext';

const ResultContext = createContext();

const ResultProvider = ({ children }) => {
   const [results, setResults] = useState([]);
   const [result, setResult] = useState([]);
   const [reportData, setReportData] = useState([]);
   const [overViewData, setOverviewData] = useState([]);
   const { userData } = useAuthContext();
   // Lấy dữ liệu từ API
   // Fetch results for teachers with optional filters
   const fetchResultsForTeacher = async (page = 1, sortOrder = "newest", identifier = "", class_name = "", type = "") => {
      const path = `${API_URL}${API_VERSION.V1}${END_POINTS.RESULT_REPORT}`;
      const requestBody = {
         userId: userData._id,
         page,
         sortOrder,
         identifier,
         class_name,
         type,
      };

      try {
         const response = await fetch(path, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               "x-client-id": userData._id,
               authorization: userData.accessToken,
            },
            body: JSON.stringify(requestBody),
         });

         const data = await response.json();
         console.log(data)

         if (data.statusCode === 200) {
            setResults(data.metadata);
            return data.metadata
         }
      } catch (error) {
         console.error("Failed to fetch results for teacher:", error);
      }
   };

   // Fetch results for students without filters
   const fetchResultsForStudent = async () => {
      const path = `${API_URL}${API_VERSION.V1}${END_POINTS.RESULT_STUDENT}`;

      try {
         const response = await fetch(path, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               "x-client-id": userData._id,
               authorization: userData.accessToken,
            },
            body: JSON.stringify({ userId: userData._id }),
         });

         const data = await response.json();

         if (data.statusCode === 200) {
            setResults(data.metadata);
         }
      } catch (error) {
         console.error("Failed to fetch results for student:", error);
      }
   };

   const fetchResultData = async ({ quizId, exerciseId, roomId, type }) => {
      const query = {
         user_id: userData._id,
         quiz_id: quizId,
         type,
         ...(exerciseId && { exercise_id: exerciseId }),
         ...(roomId && { room_id: roomId })
      };

      // console.log(query);

      try {
         const res = await fetch(API_URL + API_VERSION.V1 + END_POINTS.RESULT_REVIEW, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'x-client-id': userData._id,
               authorization: userData.accessToken,
            },
            body: JSON.stringify(query),
         });

         const data = await res.json();
         setResult(data.metadata);
         return data.metadata;
      } catch (error) {
         Toast.show({
            type: 'warn',
            text1: 'Đang lấy kết quả',
            visibilityTime: 1000,
            autoHide: true,
         })
         return null;
      }
   };

   const fetchOverViewData = async (id) => {
      try {
         const res = await fetch(API_URL + API_VERSION.V1 + END_POINTS.RESULT_OVERVIEW, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'x-client-id': userData._id,
               authorization: userData.accessToken,
            },
            body: JSON.stringify({ id }),
         });

         const data = await res.json();
         setOverviewData(data.metadata);
      } catch (error) {
         Toast.show({
            type: 'warn',
            text1: 'Đang lấy kết quả',
            visibilityTime: 1000,
            autoHide: true,
         })
      }
   };

   const completed = async (exerciseId, quizId) => {
      try {
         await fetch(API_URL + API_VERSION.V1 + END_POINTS.RESULT_COMPLETED, {
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
               status: 'completed',
            }),
         });
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

   const fetchReportDetail = async (id, type) => {
      const path = type === 'room' ? API_URL + API_VERSION.V1 + END_POINTS.ROOM_REPORT : API_URL + API_VERSION.V1 + END_POINTS.EXERCISE_REPORT;
      try {
         const res = await fetch(path, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'x-client-id': userData._id,
               authorization: userData.accessToken,
            },
            body: JSON.stringify({
               id: id
            }),
         });

         const data = await res.json();
         setReportData(data.metadata);
      } catch (error) {
         Toast.show({
            type: 'warn',
            text1: 'Đang lấy kết quả',
            visibilityTime: 1000,
            autoHide: true,
         })
      }
   };

   useEffect(() => {
      if (userData) {
         fetchResultsForStudent();
      }
   }, [userData]);


   return (
      <ResultContext.Provider value={{
         results,
         fetchResultsForStudent,
         fetchResultsForTeacher,
         fetchResultData,
         result,
         completed,
         reportData,
         fetchReportDetail,
         overViewData,
         fetchOverViewData
      }}>
         {children}
      </ResultContext.Provider>
   );
};

export const useResultProvider = () => useContext(ResultContext);

export default ResultProvider;

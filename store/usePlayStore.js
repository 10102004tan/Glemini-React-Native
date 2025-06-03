import { create } from 'zustand';
import api from '../libs/axios';
import * as SecureStore from 'expo-secure-store';

export const usePlayStore = create((set, get) => ({
    answersId: [],
    currentQuestion: null,
    isNext: false,
    isCorrect: false,
    checkCorrect:async()=>{
        const { answersId ,currentQuestion} = get();
        try {
           const body = {
        questionId: currentQuestion.id,
        answersId 
      }
      const response = await api.post("/v2/questions/check", body);
      const data = response.data;
      const {isCorrect=true} = data.metadata;
        set({ isCorrect });
    } catch (error) {
      console.error('Error checking answer:', error);
    }
    }
}));
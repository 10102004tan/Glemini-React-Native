import { create } from 'zustand';
import api from '../libs/axios';
import * as SecureStore from 'expo-secure-store';

export const usePlayStore = create((set, get) => ({
  answersId: [],
  currentQuestion: null,
}));

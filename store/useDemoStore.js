import { create } from 'zustand'
import api from '../libs/axios'

export const useDemoStore = create((set, get) => ({
    banners:[],
    isLoading: false,
    error: null,
    fetchBanners: async () => {
        set({ isLoading: true })
        try {
            const response = await api.post('/v1/quizzes/banner')
            console.log("/banners=>response::::", response.data)
            set({ banners: response.data.metadata, isLoading: false })
        } catch (error) {
            console.error(error)
            set({ error: error.response.data.message, isLoading: false })
        }
    },
}))
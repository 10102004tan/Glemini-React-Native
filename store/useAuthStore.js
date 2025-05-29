import { create } from 'zustand'
import api from '../libs/axios'
import * as SecureStore from 'expo-secure-store'

export const useAuthStore = create((set, get) => ({
    user: null,
    isLoading: true,
    error: null,
    isSignedIn: false,
    signIn: async (email, password) => {
        set({ error: null })
        try {
            const response = await api.post('/v2/auth/login', {
                email, password,
            })
            const { tokens, user } = response.data.metadata
            console.log("/login=>tokens::::", tokens)
            await SecureStore.setItemAsync('Authorization', tokens.accessToken)
            await SecureStore.setItemAsync('refreshToken', tokens.refreshToken)
            await SecureStore.setItemAsync('x-client-id', user.user_id)
            // set withCredentials
            api.defaults.withCredentials = true
            api.defaults.headers.common['Authorization'] = tokens.accessToken
            api.defaults.headers.common['x-client-id'] = user.user_id
            set({ user, isSignedIn: true })
            return { success: true }
        } catch (error) {
            console.log("/login=>error::::", error)
            let message = 'An error occurred. Please try again.'
            if (error.response) {
                if (error.response.status === 400) {
                    message = 'Invalid email or password'
                } else if (error.response.status === 500) {
                    message = 'Server error. Please try again later.'
                } else if (error.response.status === 401) {
                    message = 'Unauthorized. Please check your credentials.'
                }
            }
            return { success: false, error: message }
        }
    },
    signOut: async () => {
        set({ isLoading: true })
        await SecureStore.deleteItemAsync('Authorization')
        await SecureStore.deleteItemAsync('refreshToken')
        await SecureStore.deleteItemAsync('x-client-id')
        set({ user: null, isSignedIn: false, isLoading: false })
    },
    signUp: async ({
        email, password, fullname
    }) => {
        try {
            // set({ isLoading: true, error: null })
            const response = await api.post('/v2/auth/signup', {
                email, password, fullname
            })
            console.log("[STORE] signUp: => " + response.data.metadata)
            set({ user: response.data.metadata })
            return { success: true }
        } catch (error) {
            let message = 'An error occurred. Please try again.'
            if (error.response) {
                if (error.response.status === 400) {
                    message = 'Invalid input. Please check your details.'
                } else if (error.response.status === 500) {
                    message = 'Server error. Please try again later.'
                } else if (error.response.status === 409) {
                    message = 'Email already exists. Please use a different email.'
                }
            }
            return { success: false, error: message }
        }
    },
    checkAuth: async () => {
        set({ isLoading: true })
        try {
            const authorization = await SecureStore.getItemAsync('Authorization')
            const xClientId = await SecureStore.getItemAsync('x-client-id')
            console.log("/me=>authorization::::", authorization)
            console.log("/me=>xClientId::::", xClientId)
            if (!authorization) {
                set({ isSignedIn: false, isLoading: false })
                return
            }

            const response = await api.get('/v2/auth/me', {
                headers: {
                    Authorization: `${authorization}`,
                    "x-client-id": xClientId
                },
            })
            const { metadata } = response.data
            console.log("/me=>emetadata::::", metadata)
            // set withCredentials
            api.defaults.withCredentials = true
            api.defaults.headers.common['Authorization'] = authorization
            api.defaults.headers.common['x-client-id'] = xClientId
            set({ user: metadata, isSignedIn: true, isLoading: false })
        } catch (error) {
            console.log("/me=>error::::", error)
            await SecureStore.deleteItemAsync('Authorization')
            await SecureStore.deleteItemAsync('refreshToken')
            await SecureStore.deleteItemAsync('x-client-id')
        }
    },
}))
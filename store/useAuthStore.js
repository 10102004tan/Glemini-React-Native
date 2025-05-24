import { create } from 'zustand'
import api from '../libs/axios'
import * as SecureStore from 'expo-secure-store'

export const useAuthStore = create((set, get) => ({
    user: null,
    isLoading: false,
    error: null,
    isSignedIn: false,
    signIn: async (email, password) => {
        set({ isLoading: true })
        try {
            const response = await api.post('/v2/auth/login', {
                email, password,
            })
            const { tokens,user} = response.data.metadata
            console.log("/login=>tokens::::", tokens)
            await SecureStore.setItemAsync('Authorization', tokens.accessToken)
            await SecureStore.setItemAsync('refreshToken', tokens.refreshToken)
            await SecureStore.setItemAsync('x-client-id', user.user_id)
            // set withCredentials
            api.defaults.withCredentials = true
            api.defaults.headers.common['Authorization'] = tokens.accessToken
            api.defaults.headers.common['x-client-id'] = user.user_id
            set({ user, isSignedIn: true, isLoading: false })

        } catch (error) {
            // check if error is 401
            if (error.response && error.response.status === 401) {
                set({ error: 'Invalid email or password', isLoading: false })
            } else {
                set({ error: 'An error occurred. Please try again.', isLoading: false })
            }
        }
    },
    signOut: async () => {
        set({ isLoading: true })
        await SecureStore.deleteItemAsync('Authorization')
        await SecureStore.deleteItemAsync('refreshToken')
        await SecureStore.deleteItemAsync('x-client-id')
        set({ user: null, isSignedIn: false, isLoading: false })
    },
    signUp: async (email, password, username) => {
        set({ isLoading: true })
        try {
            const response = await api.post('/auth/sign-up', {
                email, password, username

            })
            set({ user: response.data.user, isSignedIn: true, isLoading: false })
            // set to Async storage to persist user data
        } catch (error) {
            console.error(error)
            set({ error: error.response.data.message, isLoading: false })
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
            // remove token from Async storage
            set({ error: error.response.data.message, isLoading: false, isSignedIn: false })
            // await SecureStore.removeItemAsync('Authorization')
            await SecureStore.deleteItemAsync('Authorization')
            await SecureStore.deleteItemAsync('refreshToken')
            await SecureStore.deleteItemAsync('x-client-id')
        }
    },
}))
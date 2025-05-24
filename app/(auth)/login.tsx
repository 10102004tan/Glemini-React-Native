import AuthLayout from '@/components/layouts/AuthLayout'
import React, { useEffect } from 'react'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import { Formik } from 'formik'
import * as Yup from 'yup'
import loginSchema from '@/validation/loginSchema'
import { router } from 'expo-router'
import { useAuthStore } from '@/store/useAuthStore'
const Login = () => {
    const { signIn,error } = useAuthStore();

    const handleLogin = (values: any,{
        setSubmitting
    }:{
        setSubmitting: (isSubmitting: boolean) => void
    }) => {
        signIn(values.email, values.password).then(() => {
            if (!error) {
                console.log("Login successful");
            }
            setSubmitting(false);
        })
    }
    return (
        <AuthLayout>
            {error && <Text style={{ color: "red", fontSize: 16,
                paddingVertical: 10,
                paddingHorizontal: 20,
                backgroundColor: "#FEE2E2",
                borderRadius: 8,
                marginBottom: 20,
             }}>{error}</Text>}
            <View>
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 24, fontWeight: "bold" }}>Masuk ke akun kamu</Text>
                    <Text style={{ fontSize: 16, color: "#6B7280" }}>Belajar gratis di Namanyajugabelajar.io, dan memulai karir yang kamu cita-citata sejak dalam embrio!</Text>
                </View>

                {/* form input for login */}
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={loginSchema}
                    onSubmit={handleLogin}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                        <View style={{ marginBottom: 20 }}>
                            <View style={{ marginBottom: 14 }}>
                                <Text style={{
                                    fontSize: 16, color: "#374151"
                                    , fontWeight: "bold"
                                }}>Email</Text>

                                <TextInput
                                    style={{
                                        borderWidth: 1,
                                        borderColor: "#D1D5DB",
                                        borderRadius: 8,
                                        paddingVertical: 10,
                                        paddingHorizontal: 20,
                                        marginTop: 10,
                                        backgroundColor: "#F9FAFB",
                                    }}
                                    onChangeText={handleChange('email')}
                                    value={values.email}
                                    placeholder="email@example.com"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>

                            <View style={{ marginBottom: 14 }}>
                                <Text style={{
                                    fontSize: 16, color: "#374151"
                                    , fontWeight: "bold"
                                }}>Password</Text>
                                <TextInput
                                    style={{
                                        borderWidth: 1,
                                        borderColor: "#D1D5DB",
                                        borderRadius: 8,
                                        paddingVertical: 10,
                                        paddingHorizontal: 20,
                                        backgroundColor: "#F9FAFB",
                                        marginTop: 10,
                                    }}
                                    onChangeText={handleChange('password')}
                                    value={values.password}
                                    placeholder="********"
                                    secureTextEntry={true}
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>

                            <View style={{ marginBottom: 14 }}>
                                <TouchableOpacity
                                    onPress={()=>handleSubmit()}
                                    style={{
                                        backgroundColor: "#4f46e5",
                                        borderRadius: 8,
                                        paddingVertical: 15,
                                        paddingHorizontal: 20,
                                        alignItems: "center",
                                    }}

                                >
                                    <Text style={{ fontSize: 16, color: "#FFFFFF", fontWeight: "bold" }}>
                                        {isSubmitting ? 'Loading...' : 'Masuk'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </Formik>


                <View style={{ marginBottom: 20, alignItems: "center" }}>
                    <Text style={{ fontSize: 16, color: "#6B7280" }}>Don't have an account? <Text style={{ color: "#4f46e5", fontWeight: "bold" }}>Sign up</Text></Text>
                </View>
            </View>
        </AuthLayout>
    )
}

export default Login
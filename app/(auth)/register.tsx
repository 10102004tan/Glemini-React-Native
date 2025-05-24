import AuthLayout from '@/components/layouts/AuthLayout'
import React from 'react'
import { View, Text, Image, FlatList, TouchableOpacity, Dimensions, TextInput } from 'react-native'
const Register = () => {
    return (
        <AuthLayout>
            <View>
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 24, fontWeight: "bold" }}>Bikin akun baru</Text>
                    <Text style={{ fontSize: 16, color: "#6B7280" }}>Nggak susah kok, kamu cuma tinggal masukin beberapa data aja terus langsung jadi deh!</Text>
                </View>

                {/* form input for login */}
                <View style={{ marginBottom: 20 }}>
                    <View style={{ marginBottom: 14 }}>
                        <Text style={{
                            fontSize: 16, color: "#374151"
                            , fontWeight: "bold"
                        }}>Full Name</Text>
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
                            placeholder="John Doe"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

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
                            placeholder="********"
                            secureTextEntry={true}
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    <View style={{ marginBottom: 14 }}>
                        <Text style={{
                            fontSize: 16, color: "#374151"
                            , fontWeight: "bold"
                        }}>
                            Confirm Password
                        </Text>
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
                            placeholder="********"
                            secureTextEntry={true}
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    <Text style={{
                        marginBottom: 14,
                        fontSize: 12, color: "#374151"
                    }}
                    >
                        Dengan mendaftar berarti kamu setuju dengan Terms of Service dan Privacy Policy dari Namanyajugabelajar.io
                    </Text>

                    <View style={{ marginBottom: 14 }}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: "#4f46e5",
                                borderRadius: 8,
                                paddingVertical: 15,
                                paddingHorizontal: 20,
                                alignItems: "center",
                            }}
                            onPress={() => {
                                // handle login
                            }}
                        >
                            <Text style={{ fontSize: 16, color: "#FFFFFF", fontWeight: "bold" }}>Register</Text>
                        </TouchableOpacity>
                    </View>

                </View>
                <View style={{ marginBottom: 20, alignItems: "center" }}>
                    <Text style={{ fontSize: 16, color: "#6B7280" }}>
                        Sudah punya akun? <Text style={{ color: "#4f46e5", fontWeight: "bold" }}>Login</Text></Text>
                </View>
            </View>
        </AuthLayout>
    )
}

export default Register
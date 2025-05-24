import AuthLayout from "@/components/layouts/AuthLayout"
import React from "react"
import { View, Text, Image, FlatList, Dimensions, TouchableOpacity, TextInput } from "react-native"

const Reset = () => {
    return (
        <AuthLayout>
            <View>
                <View
                    style={{ marginBottom: 20 }}
                >
                    <Text style={{ fontSize: 24, fontWeight: "bold" }}>Atur ulang kata sandi</Text>
                    <Text style={{ fontSize: 16, color: "#6B7280" }}>Jangan pake kata sandi yang susah-susah makannya, ngerepotin mulu jadi orang.</Text>
                </View>
                <View style={{ marginBottom: 20 }}>
                    <View style={{ marginBottom: 14 }}>
                        <Text style={{
                            fontSize: 16, color: "#374151"
                            , fontWeight: "bold"
                        }}>
                            Kata Sandi Baru
                        </Text>
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
                            Konfirmasi Kata Sandi
                        </Text>
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
                            placeholder="********"
                            secureTextEntry={true}
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

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
                            <Text style={{ fontSize: 16, color: "#FFFFFF", fontWeight: "bold" }}>Atur Ulang!</Text>
                        </TouchableOpacity>
                    </View>

                </View >
            </View >

        </AuthLayout >
    )
}

export default Reset
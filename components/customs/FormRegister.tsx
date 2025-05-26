import { useAuthStore } from "@/store/useAuthStore";
import registerSchema from "@/validation/registerSchema";
import { router } from "expo-router";
import { Formik } from "formik";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

const FormRegister = () => {
    const { signUp } = useAuthStore();
    const handleRegister = async (
        values: { fullname: string; email: string; password: string; },
        { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
    ) => {
        // chặn không cho chuyển trang khi đang submit
        setSubmitting(true);
        const result = await signUp(values)
        if (result.success) {
            router.replace({
                pathname: "/(auth)/",
                params: {
                    message: "Akun berhasil dibuat, silahkan login"
                }
            })
        } else {
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Gagal membuat akun',
                text2: result.error
            });
        }
        setSubmitting(false);
    }
    return (
        <Formik
            initialValues={{ fullname: 'Nguyen Phuong Tan', email: 'tan987@gmail.com', password: '12345678', confirmPassword: '12345678' }}
            validationSchema={registerSchema}
            onSubmit={handleRegister}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                <View style={{ marginBottom: 20 }}>

                    {/* errors */}
                    {errors.fullname && touched.fullname && (
                        <Text style={{ color: 'red', marginBottom: 10 }}>{errors.fullname}</Text>
                    )}

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
                            onChangeText={handleChange('fullname')}
                            onBlur={handleBlur('fullname')}
                            value={values.fullname}
                            autoCapitalize="words"
                            placeholder="John Doe"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    {/* errors */}
                    {errors.email && touched.email && (
                        <Text style={{ color: 'red', marginBottom: 10 }}>{errors.email}</Text>
                    )}

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
                            onBlur={handleBlur('email')}
                            value={values.email}
                            autoCapitalize="none"
                            placeholder="email@example.com"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    {/* errors */}
                    {errors.password && touched.password && (
                        <Text style={{ color: 'red', marginBottom: 10 }}>{errors.password}</Text>
                    )}
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
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            autoCapitalize="none"
                            autoComplete="password"
                            secureTextEntry={true}
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    {/* errors */}
                    {errors.confirmPassword && touched.confirmPassword && (
                        <Text style={{ color: 'red', marginBottom: 10 }}>{errors.confirmPassword}</Text>
                    )}
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
                            onChangeText={handleChange('confirmPassword')}
                            onBlur={handleBlur('confirmPassword')}
                            value={values.confirmPassword}
                            autoCapitalize="none"
                            autoComplete="password"
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
                                handleSubmit();
                            }}
                        >
                            <Text style={{ fontSize: 16, color: "#FFFFFF", fontWeight: "bold" }}>
                                {isSubmitting ? "Loading..." : "Buat Akun"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </Formik>
    )
}

export default FormRegister;
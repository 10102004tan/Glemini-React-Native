import MainLayout from "@/components/layouts/MainLayout"
import { Stack } from "expo-router"
import { Image, Text, View } from "react-native"

const VerifyTeacher = () => {

    const documents = [
        {
            title: "Giấy xác nhận",
            icon: "https://cdn-icons-png.flaticon.com/512/25/25383.png",
            onPress: () => {
                // router.push("/(protected)/(teacher)/verify");
            },
        },
        {
            title: "Giấy tờ tùy thân",
            icon: "https://cdn-icons-png.flaticon.com/512/25/25383.png",
            onPress: () => {
                // router.push("/(protected)/(teacher)/verify");
            },
        },
        {
            title: "Ảnh thẻ",
            icon: "https://cdn-icons-png.flaticon.com/512/25/25383.png",
            onPress: () => {
                // router.push("/(protected)/(teacher)/verify");
            },
        },
        {
            title: "Giấy tờ khác",
            icon: "https://cdn-icons-png.flaticon.com/512/25/25383.png",
            onPress: () => {
                // router.push("/(protected)/(teacher)/verify");
            },
        }
    ]
    return (
        <MainLayout>
            <Stack.Screen
                options={{
                    headerTitle: "Xác thực tài khoản giáo viên",
                    headerTitleAlign: "center",
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: "#fff",
                    },
                    headerTintColor: "#000",
                }}
            />
            <View
            >
                <View
                    style={{
                        marginBottom: 14,

                    }}>
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            paddingBottom: 10,
                            borderBottomColor: "#E5E7EB",
                            borderBottomWidth: 1,
                        }}
                    >
                        Thông tin công dân
                    </Text>

                    <Image
                        source={{ uri: "https://congan.haiphong.gov.vn/upload/congan/product/2021/3/can-cuoc-cong-dan-gan-chip-2-1c9e7e4c0d544f729969f086e878f502.jpg?maxwidth=1000" }}
                        resizeMode="contain"
                        style={{
                            width: 400,
                            height: 200,
                            borderRadius: 10,
                            marginTop: 20,
                            padding: 5,
                        }}
                    />
                </View>

                <View
                    style={{
                        marginBottom: 14
                    }}
                >
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            color: "#DA191E",
                        }}
                    >
                        Trạng thái đã xác thực
                    </Text>
                    <Text
                        style={{
                            fontSize: 14,
                            color: "#374151",
                            paddingBottom: 15,
                            borderBottomColor: "#E5E7EB",
                            borderBottomWidth: 1,
                        }}
                    >
                        Tài khoản của bạn đã được xác thực thành công
                    </Text>

                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: 10,
                            flexWrap: "wrap",
                        }}
                    >
                        {
                            documents.map((item, index) => (
                                <View
                                    key={index}
                                    style={{
                                        alignItems: "center",
                                        marginTop: 20,
                                        width: "33%",
                                    }}
                                >
                                    <Image
                                        source={{ uri: item.icon }}
                                        style={{
                                            width: 30,
                                            height: 30,
                                            borderRadius: 100,
                                            padding: 10,
                                            backgroundColor: "#F3F4F6",
                                            marginRight: 10,
                                        }}
                                    />
                                    <Text
                                        style={{
                                            fontSize: 14,
                                        }}
                                    >
                                        {item.title}
                                    </Text>
                                </View>
                            ))
                        }
                    </View>
                </View>
            </View>
        </MainLayout>
    )
}
export default VerifyTeacher
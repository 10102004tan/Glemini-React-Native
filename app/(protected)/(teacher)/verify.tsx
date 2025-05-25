import MainLayout from "@/components/layouts/MainLayout"
import { Entypo } from "@expo/vector-icons"
import { Stack } from "expo-router"
import { Image, ScrollView, Text, View } from "react-native"

const VerifyTeacher = () => {
    const user = {
        user_role: "teacher",
        is_verified: false,
    }
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
            <ScrollView
            >
                {
                    user.is_verified ? (
                        <Verified />
                    ) : (
                        <UploadVerify />
                    )
                }
            </ScrollView>
        </MainLayout>
    )
}

const Verified = () => {
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

    const ocrCCCD = [{
        field: "Họ và tên",
        value: "Nguyễn Văn A"
    }, {
        field: "Ngày sinh",
        value: "01/01/2000"
    }, {
        field: "Giới tính",
        value: "Nam"
    }, {
        field: "Nơi cấp",
        value: "Công an tỉnh Hà Tĩnh"
    }, {
        field: "Ngày cấp",
        value: "01/01/2020"
    }, {
        field: "Số CMND",
        value: "123456789"
    }, {
        field: "Địa chỉ thường trú",
        value: "Thành phố Hà Tĩnh, tỉnh Hà Tĩnh"
    }]

    // Giấy xác nhận giảng dạy, có thể là giấy xác nhận của trường hoặc giấy xác nhận của cơ quan nhà nước có thẩm quyền
    const ocrGiayXacNhan = [{
        field: "Họ và tên",
        value: "Nguyễn Văn A"
    }, {
        field: "Ngày sinh",
        value: "01/01/2000"
    }, {
        field: "Giới tính",
        value: "Nam"
    }, {
        field: "Nơi cấp",
        value: "Trường Đại học Hà Tĩnh"
    }, {
        field: "Ngày cấp",
        value: "01/01/2020"
    }, {
        field: "Địa chỉ thường trú",
        value: "Thành phố Hà Tĩnh, tỉnh Hà Tĩnh"
    }, {
        field: "Số điện thoại",
        value: "0123456789"
    }, {
        field: "Chức vụ",
        value: "Giảng viên"
    }, {
        field: "Khoa",
        value: "Khoa Công nghệ thông tin"
    }, {
        field: "Chuyên ngành",
        value: "Công nghệ thông tin"
    }, {
        field: "Thời gian giảng dạy",
        value: "Từ 01/01/2020 đến 01/01/2023"
    }]
    return (
        <View>
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
                    Ảnh thẻ (3x4)
                </Text>

                <Image
                    source={{ uri: "https://media.loveitopcdn.com/54/091609-thumb-15222092411420-ds-770.jpg" }}
                    style={{
                        borderRadius: 5,
                        marginTop: 20,
                        padding: 5,
                        height: 150,
                        width: 120
                    }}
                />
            </View>

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
                        display: "none"
                    }}
                />

                {/* OCR */}
                <View

                >
                    {
                        ocrCCCD.map((item, index) => (
                            <View
                                key={index}
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    paddingVertical: 10,
                                    borderBottomColor: "#E5E7EB",
                                    borderBottomWidth: 1,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: "bold",
                                    }}
                                >
                                    {item.field}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        color: "#6B7280",
                                    }}
                                >
                                    {item.value}
                                </Text>
                            </View>
                        ))
                    }
                </View>
            </View>


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
                    Thông tin giảng dạy
                </Text>

                <Image
                    source={{ uri: "https://image.tienphong.vn/600x315/Uploaded/2025/urerex_kilfexuzey/2019_07_25/1_IWBH.jpg" }}
                    resizeMode="contain"
                    style={{
                        width: 400,
                        height: 200,
                        borderRadius: 10,
                        marginTop: 20,
                        padding: 5,
                        display: "none"
                    }}
                />

                {
                    ocrGiayXacNhan.map((item, index) => (
                        <View
                            key={index}
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                paddingVertical: 10,
                                borderBottomColor: "#E5E7EB",
                                borderBottomWidth: 1,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: "bold",
                                }}
                            >
                                {item.field}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: "#6B7280",
                                }}
                            >
                                {item.value}
                            </Text>
                        </View>
                    ))
                }
            </View>
        </View>
    )
}

const UploadVerify = () => {

    return (
        <View>
            <Text
                style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    paddingBottom: 10,
                    borderBottomColor: "#E5E7EB",
                    borderBottomWidth: 1,
                }}
            >
                Tải lên giấy tờ xác thực
            </Text>
            <View>
                <UploadItem 
                    title="Căn cước công dân"
                    description="Tải lên ảnh giấy xác nhận của bạn"
                />
                <UploadItem 
                title="Giấy xác nhận"
                description="Giấy chứng thực hoạt động nghề nghiệp của bạn"
                />
                <UploadItem 
                title="Ảnh thẻ"
                description="Tải lên ảnh thẻ của bạn, kích thước 3x4"
                />
            </View>
            {/* button */}
            <View
                style={{
                    backgroundColor: "#1E77CC",
                    padding: 15,
                    borderRadius: 5,
                    marginTop: 20,
                    alignItems: "center",
                }}
            >
                <Text
                    style={{
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: "bold",
                    }}
                >
                    Gửi yêu cầu xác thực
                </Text>
            </View>
        </View>
    )
}

const UploadItem = ({
    title = "Giấy xác nhận",
    icon = <Entypo name="upload" size={24} color="#1E77CC" />,
    description = "Tải lên ảnh căn cước công dân của bạn",
    onPress = () => { },
}) => {
    return (
        <View
            style={{
                // border line - - -
                borderColor: "#1E77CC",
                borderWidth: 1,
                borderStyle: "dashed",
                borderRadius: 5,
                padding: 20,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
            }}
        >
            <Text
                style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    paddingVertical: 10,
                    marginBottom: 10,
                    color: "#1E77CC",
                }}
            >
                {title}
            </Text>
            {icon}
            <Text
                style={{
                    fontSize: 12,
                    color: "#6B7280",
                    marginTop: 10,
                }}
            >
                ({description})
            </Text>
        </View>
    )
}
export default VerifyTeacher
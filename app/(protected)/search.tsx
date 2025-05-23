import { Stack } from "expo-router"
import { Text, View,TextInput } from "react-native"
import { AntDesign } from "@expo/vector-icons"

const Search = () => {
    console.log("Search")
    return (
        <View
        style={{
            backgroundColor: "#fff",
            flex: 1,
        }}
        >
            <Stack.Screen
                options={{
                    headerTitle: "",
                    headerTitleAlign: "center",
                    headerShadowVisible: false,
                    headerRight: () => (
                        <View
                        style={{
                            flexDirection: "row",
                            gap: 10,
                            marginBottom: 10,
                            borderRadius: 20,
                            overflow: "hidden",
                            backgroundColor: "#FFF",
                            paddingHorizontal: 15,
                            justifyContent: "center",
                            alignItems: "center",
                            borderWidth: 1,
                            borderColor: "#E5E5E5",
                        }}
                        >
                            <TextInput
                                placeholder="Search"
                                style={{
                                    paddingHorizontal: 5,
                                    paddingVertical: 10,
                                    width: 250,
                                }}
                                />
                                {/* icon search */}
                                <AntDesign name="camerao" size={24} color="black" />
                        </View>
                    )
                }}
            />
            <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 10,
                paddingHorizontal: 15,
                marginBottom: 14,
            }}
            >
                <Text
                style={{
                    fontSize: 16,
                    fontWeight: "600",
                    marginBottom: 10,
                    marginLeft: 15,
                }}
                >
                    Recently searched
                </Text>

                <AntDesign name="delete" size={20} color="black" />
            </View>

            <View
            style={{
                marginBottom: 14,
                flexWrap: "wrap",
                flexDirection: "row",
            }}
            >
                {
                    ["Community", "Classroom", "Teacher", "Student","Game online"].map((item, index) => (
                        <Text
                        key={index}
                        style={{
                            fontSize: 14,
                            fontWeight: "400",
                            marginBottom: 10,
                            marginLeft: 15,
                            paddingVertical: 5,
                            paddingHorizontal: 20,
                            backgroundColor: "#fff",
                            borderRadius: 20,
                            width:"auto",
                            color: "#000",
                            borderWidth: 1,
                            borderColor: "#E5E5E5",
                        }}
                        >
                            {item}
                        </Text>
                    ))
                }
            </View>
        </View>

    )
}

export default Search
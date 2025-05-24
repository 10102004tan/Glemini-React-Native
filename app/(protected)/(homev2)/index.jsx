
import NotificationIcon from "@/components/customs/NotificationIcon";
import MainLayout from "@/components/layouts/MainLayout";
import { router } from "expo-router";
import { Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { FlatList } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { useAuthStore } from "@/store/useAuthStore";


export default function Home() {
  
  const {user} = useAuthStore();

  return (
    <MainLayout>
      {
        user.user_role === "user" ? (
          <StudentHome />
        ) : (<TeacherHome />)
      }
    </MainLayout>
  )
}

const StudentHome = () => {
  const handleRedirectSearch = () => {
    console.log("Redirecting to search page");
    // router.push("/(protected)/search")
    router.push({
      pathname: "/(protected)/search",
    }
    )

  }
  return (
    <MainLayout>
      {/* notification */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <NotificationIcon numberOfUnreadNoti={3} />
      </View>
      <View>
        <TouchableOpacity onPress={handleRedirectSearch} style={{ marginBottom: 14 }}>
          <TextInput
            // disable
            editable={false}
            style={{
              borderWidth: 1,
              borderColor: "#D1D5DB",
              borderRadius: 8,
              paddingVertical: 10,
              paddingHorizontal: 20,
              backgroundColor: "#F9FAFB",
            }}
            placeholder="Search"
            placeholderTextColor="#9CA3AF"
          />
        </TouchableOpacity>
      </View>


      {/* list */}
      {/* <FlashList
        data={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
        renderItem={({ item }) => (
          <View
            style={{
              borderRadius: 8,
              marginBottom: 10,
            }}
          >
            <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#111827",
                  marginBottom: 5,
                }}
              >Math</Text>
              <AntDesign name="right" size={20} color="black" />
            </View>
            <FlatList
              data={[1, 2, 3, 4]}
              renderItem={({ item }) => (
                <View
                  style={{
                    backgroundColor: "#F9FAFB",
                    borderRadius: 8,
                    marginBottom: 10,
                    marginRight: 10,
                  }}
                >
                  <Image
                    source={{ uri: "https://hips.hearstapps.com/hmg-prod/images/facebook-founder-and-ceo-mark-zuckerberg-delivers-the-news-photo-1740153091.pjpeg?crop=1xw:1xh;center,top&resize=980:*" }}
                    style={{ width: 200, height: 120, borderRadius: 5 }}
                  />
                  <Text>Item {item}</Text>
                </View>
              )}
              keyExtractor={(item) => item.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 10,
              }}
              style={{
                marginTop: 10,
              }}
              estimatedItemSize={10}
             
            />
          </View>
        )}
        estimatedItemSize={10} /> */}
    </MainLayout>
  )
}

const TeacherHome = () => {
  return (
    <View>
      <Text>Teacher Home</Text>
    </View>
  )
}

import { Ionicons } from "@expo/vector-icons"
import { Link, Stack } from "expo-router"
import { Text, View } from "react-native"

const Profile = () => {
	return (
		<View>
			<Stack.Screen
				options={{
					headerTitle: "Profile",
					headerTitleAlign: "center",
					headerTitleStyle: {
						fontSize: 20,
						fontWeight: "bold",
					},
					headerStyle: {
						backgroundColor: "#f8f8f8",
						elevation: 0,
						shadowColor: "transparent",
					},
					headerRight: () => (
						<Link href={{
							pathname:"/(protected)/settings"
						}} style={{ marginRight: 10 }}>
							<Ionicons name="settings" size={24} color="black" />
						</Link>
					)
				}}
			/>

			<Text>
				Profile Screen
			</Text>
		</View>
	)
}
export default Profile
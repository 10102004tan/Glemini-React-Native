import {Alert, FlatList, Image, Text, TouchableOpacity, View} from "react-native";
import {useContext, useEffect, useState} from "react";
import {END_POINTS, API_URL, API_VERSION} from "../../configs/api.config";
import {AuthContext} from "../../contexts/AuthContext";
import {Feather, FontAwesome} from "@expo/vector-icons";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";
import {Link, router} from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import CustomButton from "../../components/customs/CustomButton";
import {LinearGradient} from "expo-linear-gradient";
import NotificationCard from "@/components/customs/NotificationCard";

export default function NotificationScreen() {
    const {userData} = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchNotifications();
    }, []);


    const fetchNotifications = async () => {
        const response = await fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.USER_NOTIFICATION}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${userData.accessToken}`,
                'x-client-id': `${userData._id}`
            }
        });
        const data = await response.json();
        if (data.statusCode === 200) {
            setNotifications(data.metadata);
        }
    }

    return (
        <View className={"px-2 bg-white pt-[20px]"}>
            <FlatList data={notifications} renderItem={(notification) => {
                const {noti_type, noti_content, createdAt, noti_options} = notification.item;
                return (
                    <NotificationCard type={noti_type} content={noti_content} time={createdAt} options={noti_options}/>
                )
            }}/>
        </View>
    )
}





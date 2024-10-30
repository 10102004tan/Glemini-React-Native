import {Alert, FlatList, Text, TouchableOpacity, View} from "react-native";
import {useContext, useEffect, useRef, useState} from "react";
import {AuthContext} from "../../contexts/AuthContext";
import NotificationCard from "@/components/customs/NotificationCard";
import {Modalize} from 'react-native-modalize';
import {router} from "expo-router";
import {Portal} from "react-native-paper";

export default function NotificationScreen() {
    const {notification, fetchNotification} = useContext(AuthContext);
    const modalizeRef = useRef(null);
    const [currentSelected, setCurrentSelected] = useState(null);
    useEffect(() => {
        fetchNotification();
    }, []);

    const onOpen = () => {
        modalizeRef.current?.open();
    };

    const handleNotification = (item) => {
        switch (item.noti_type) {
            case "SYS-001":
                setCurrentSelected(item);
                onOpen();
                break;
            case "SYS-002":
                setCurrentSelected(item);
                onOpen();
                break;
            case "SHARE-001":
                router.push({pathname: "/(app)/(quiz)/overview", query: {id: item.noti_options.id}});
                break;
            case "SHARE-002":
                break;
            case "ROOM-001":
                Alert.alert("Thông báo", "Bạn đã được thêm vào phòng học");
                break;
            default:
                break;
        }
    };

    return (
        <View className={"px-2 bg-white pt-[20px]"}>
            <FlatList data={notification} renderItem={(item) => {
                const {noti_type, noti_content, createdAt, noti_options, noti_status} = item.item;
                return (
                    <NotificationCard onPress={()=>handleNotification(item.item)} type={noti_type} content={noti_content}
                                      status={noti_status} time={createdAt} options={noti_options}/>
                )
            }}/>

            <Modalize avoidKeyboardLikeIOS={true} children={<View></View>} modalStyle={{padding: 10, marginTop: 30}}  ref={modalizeRef}
                      withHandle={false} scrollViewProps={{showsVerticalScrollIndicator: false}}
                      HeaderComponent={<View><Text>Header</Text></View>}>
                <View>
                    <Text>{currentSelected?.noti_content}</Text>
                </View>
            </Modalize>
        </View>
    )
}





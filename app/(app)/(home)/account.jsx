import {Entypo, FontAwesome} from "@expo/vector-icons";
import {Link, router} from "expo-router";
import {useContext, useEffect, useRef, useState} from "react";
import {Alert, FlatList, Image, Pressable, Text, View} from "react-native";
import {AuthContext} from "@/contexts/AuthContext";
import AccoutntStatusItem from "@/components/customs/AccountStatusItem";
import {useAppProvider} from "@/contexts/AppProvider";
import NotificationCard from "@/components/customs/NotificationCard";
import {Modalize} from "react-native-modalize";
import {
    SYSTEM_MAINTENANCE,
    SYSTEM_NEW_FEATURE,
    SHARE_QUIZ_TO_TEACHER,
    SHARE_QUIZ_TO_CLASSROOM,
    ROOM_REALTIME,
    STATUS_VERIFIED
} from "@/utils/notificationCode";
import Markdown from "react-native-markdown-display";
import {convertMarkdownToText} from "@/utils";

const COUNT_LENGTH = 30;
const COUNT_NOTIFICATION_RECENT = 2;
export default function AccountScreen() {
    const {
        userData: {user_fullname, user_email, user_type, user_avatar},
        userData,
        teacherStatus,
        notification,
        updateNotificationStatus,
        setNumberOfUnreadNoti,
        setNotification
    } = useContext(AuthContext);
    const {i18n,setIsHiddenNavigationBar} = useAppProvider();
    const modalizeRef = useRef(null);
    const [currentSelected, setCurrentSelected] = useState(null);

    useEffect(() => {
        if (!currentSelected) return;
        const {_id: notiId, noti_status} = currentSelected;
        if (noti_status === "read") return;
        updateNotificationStatus({notiId}).then((statusCode) => {
            if (statusCode === 200) {
                setNumberOfUnreadNoti((prev) => {
                    return prev - 1;
                });
                setNotification((prev) => {
                    return prev.map((item) => {
                        if (item._id === notiId) {
                            return {...item, noti_status: "read"};
                        }
                        return item;
                    })
                });
            }
        }).catch(err => console.err(err));
    }, [currentSelected]);

    const onOpen = () => {
        modalizeRef.current?.open();
        setIsHiddenNavigationBar(true);
    };

    const handleNotification = (item) => {
        setCurrentSelected(item);
        switch (item.noti_type) {
            case SYSTEM_MAINTENANCE:
                onOpen();
                break;
            case SYSTEM_NEW_FEATURE:
                onOpen();
                break;
            case SHARE_QUIZ_TO_TEACHER:
                const {quiz_id} = item.noti_options;
                router.push({
                    pathname: "/(app)/(quiz)/detail_quiz",
                    params: {
                        id: quiz_id
                    }
                });
                break;
            case SHARE_QUIZ_TO_CLASSROOM:
                break;
            case ROOM_REALTIME:
                Alert.alert("Thông báo", "Bạn đã được thêm vào phòng học");
                break;
            case STATUS_VERIFIED:
                router.push({
                    pathname: "/(app)/profile-auth",
                });
                break;
            default:
                break;
        }
    };

    const onClosed = () => {
        setCurrentSelected(null);
    }

    return (
        <View className="bg-white h-[100%] px-[20px]">
            <View className="flex flex-row gap-2 p-3 border-[1px] mt-3 border-[#eee] rounded mb-3">
                <Image src={user_avatar} className="w-[60px] h-[60px] object-cover rounded-full"/>
                <View className="flex-1">
                    <Text className="font-semibold text-[14px]">{user_fullname}</Text>
                    <Text className="text-gray text-[12px]">{user_email}</Text>
                    {user_type === "teacher" && (<AccoutntStatusItem status={teacherStatus}/>)}
                </View>
                <Link href={'(app)/profile'}>
                    <View className="flex flex-row items-center">
                        <FontAwesome name="edit" size={16} color="black"/>
                        <Text className="ms-2 text-[12px]">{i18n.t("account.buttonEdit")}</Text>
                    </View>
                </Link>
            </View>
            <View className={"mb-3"}>
                <View className={"flex flex-row gap-2 items-center mb-3"}>
                    <Entypo name={"back-in-time"}/>
                    <Text className={"font-semibold"}>Action Recent</Text>
                </View>
                <FlatList data={notification.slice(0, COUNT_NOTIFICATION_RECENT)} renderItem={(item) => {
                    const {noti_type, noti_content, createdAt, noti_options, noti_status, _id: notiId} = item.item;
                    return (
                        <NotificationCard status={noti_status} onPress={() => handleNotification(item.item)}
                                          type={noti_type} content={noti_content}
                                          time={createdAt} options={noti_options}/>
                    )
                }}/>
            </View>

            <Modalize onClose={()=>{setIsHiddenNavigationBar(false);}} onClosed={onClosed} avoidKeyboardLikeIOS={true} children={<View></View>}
                      modalStyle={{padding: 10, marginTop: 30, zIndex: 1000}} ref={modalizeRef}
                      withHandle={false} scrollViewProps={{showsVerticalScrollIndicator: false}}>
                <Markdown>
                    {currentSelected ? currentSelected.noti_content : ""}
                </Markdown>
            </Modalize>
        </View>

    )
}


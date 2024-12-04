import {Alert, Dimensions, FlatList, Text, TouchableOpacity, View} from "react-native";
import {useContext, useEffect, useRef, useState} from "react";
import {AuthContext} from "../../contexts/AuthContext";
import NotificationCard from "@/components/customs/NotificationCard";
import {Modalize} from 'react-native-modalize';
import {convertMarkdownToText} from "@/utils";
import Markdown from "react-native-markdown-display";
import LottieView from "lottie-react-native";
import NotificationEmpty from "@/components/customs/NotificationEmpty";
import AntiFlatList from "@/components/customs/AntiFlatList/AntiFlatList";
import AntiFlatListNotification from "@/components/customs/AntiFlatList/AntiFlatListNotification";
import {router} from "expo-router";
import {STATUS_VERIFIED} from "@/utils/notificationCode";
import NotificationListSkelaton from "@/components/customs/AntiFlatList/NotificationListSkelaton";

const COUNT_LENGTH = 30;
export default function NotificationScreen() {
    const {
        notification,
        updateNotificationStatus,
        setNumberOfUnreadNoti,
        setNotification,
        setSkipNotification,
        setIsRefreshing,
        isRefreshing
    } = useContext(AuthContext);
    const modalizeRef = useRef(null);
    const [currentSelected, setCurrentSelected] = useState(null);
    const [isLoadMore, setIsLoadMore] = useState(false);
    // const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        if (!currentSelected) return;
        const {_id: notiId} = currentSelected;
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
    };

    const handleNotification = (item) => {
        setCurrentSelected(item);
        switch (item.noti_type) {
            case "SYS-001":
                onOpen();
                break;
            case "SYS-002":
                onOpen();
                break;
            case "SHARE-001":
                const {quiz_id} = item.noti_options;
                router.push({
                    pathname:"/(app)/(quiz)/detail_quiz",
                    params:{
                        id:quiz_id
                    }
                });
                break;
            case "SHARE-002":
                break;
            case "ROOM-001":
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

    const ComponentItem = ({data}) => {
        const {noti_type, noti_content, createdAt, noti_options, noti_status, _id: notiId} = data;
        return <NotificationCard status={noti_status} onPress={() => handleNotification(data)}
                                 type={noti_type} content={noti_content}
                                 time={createdAt} options={noti_options}/>
    };

    const handleLoadMore = () => {
        setIsLoadMore(true);
        setSkipNotification((prev) => {
            return prev + 10;
        });
        setIsLoadMore(false);
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        setSkipNotification(0);
    };

    return (
        <View className={"px-2 bg-white pt-[20px]"}>
            <AntiFlatListNotification loading={isLoadMore} isRefreshing={isRefreshing} handleRefresh={handleRefresh} handleLoadMore={handleLoadMore} colSpan={4} data={notification} componentItem={ComponentItem}/>
            <Modalize onClosed={onClosed} avoidKeyboardLikeIOS={true} children={<View></View>}
                      modalStyle={{padding: 10, marginTop: 30, paddingBottom: 50}} ref={modalizeRef}
                      withHandle={false} scrollViewProps={{showsVerticalScrollIndicator: false}}>
                <Markdown>
                    {currentSelected ? currentSelected.noti_content : ""}
                </Markdown>
            </Modalize>
        </View>
    )
}





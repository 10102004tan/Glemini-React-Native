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

const COUNT_LENGTH = 30;
export default function NotificationScreen() {
    const {
        notification,
        updateNotificationStatus,
        setNumberOfUnreadNoti,
        setNotification,
        fetchNotification,
        setSkip,skip
    } = useContext(AuthContext);
    const modalizeRef = useRef(null);
    const [currentSelected, setCurrentSelected] = useState(null);
    const [isLoadMore, setIsLoadMore] = useState(false);

    console.log(notification)

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

    const onClosed = () => {
        setCurrentSelected(null);
    }

    // const onEndReached = () => {
    //     if (skip === -1) return;
    //     setIsLoadMore(true);
    //     fetchNotification({skip: skip + 10, limit: 10}).then((data) => {
    //         console.log(data)
    //         setIsLoadMore(false);
    //         if (data === -1) {
    //             setSkip(-1);
    //             return;
    //         }
    //         setSkip(skip + 10);
    //     }).catch(err => console.err(err));
    // }

    const ComponentItem = ({data}) => {
        console.log("DATA::",data.noti_content)
        const {noti_type, noti_content, createdAt, noti_options, noti_status, _id: notiId} = data;
        const newContent = convertMarkdownToText(noti_content);
        const content = newContent.length > COUNT_LENGTH ? newContent.substring(0, COUNT_LENGTH) + "..." : newContent;
        return <NotificationCard status={noti_status} onPress={() => handleNotification(data)}
                                 type={noti_type} content={content}
                                 time={createdAt} options={noti_options}/>
    };

    return (
        <View className={"px-2 bg-white pt-[20px]"}>

            <AntiFlatList handleLoadMore={()=>{console.log("loadmore")}} colSpan={4} data={notification} componentItem={ComponentItem}/>

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





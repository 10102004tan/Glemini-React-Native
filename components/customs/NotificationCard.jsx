import {Alert, Image, Text, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment/moment";
import AntDesign from "@expo/vector-icons/AntDesign";
import CustomButton from "@/components/customs/CustomButton";
import {LinearGradient} from "expo-linear-gradient";
import {useContext} from "react";
import {AuthContext} from "@/contexts/AuthContext";

export default function NotificationCard({type,status,content = "", time, options = {},onPress}) {
    const {updateNotificationStatus} = useContext(AuthContext);
    if (type === "SYS-001") {
        return (
            <TouchableOpacity onPress={onPress}>
                <View className={`px-3 py-4 flex-row justify-between mb-4 rounded shadow-2xl`}
                      style={{flex: 1, borderWidth: 1, borderColor: "000"}}>
                    <View className={"flex gap-3 flex-row"}>
                        <Icon name={"settings"} size={24} color={"#000"}/>
                        <View className={"max-w-[200px]"}>
                            <Text className={"text-[14px] font-semibold mb-2"}>Glemini System</Text>
                            <Text className={"text-[12px] text-gray"}>{content}</Text>
                        </View>
                    </View>
                    <View>
                        <Text className={"text-gray text-[10px] mb-2"}>{moment(time).fromNow()}</Text>
                        {
                            status ==="unread" && <Text className={"text-gray text-[10px]"}>Chưa đọc</Text>
                        }
                    </View>
                </View>
            </TouchableOpacity>

        )
    } else if (type === "SYS-002") {
        return (
            <TouchableOpacity onPress={onPress}>
                <View className={`px-3 py-4 flex-row justify-between mb-4 rounded shadow-2xl}`}
                      style={{flex: 1, borderWidth: 1, borderColor: "000"}}>
                    <View className={"flex gap-3 flex-row"}>
                        <AntDesign name={"rocket1"} size={24} color={"#9f75ff"}/>
                        <View className={"max-w-[200px]"}>
                            <Text className={"text-[14px] font-semibold mb-2"}>Glemini System</Text>
                            <Text className={"text-[12px] text-gray"}>{content}</Text></View>
                    </View>
                    <View>
                        <Text className={"text-gray text-[10px] mb-2"}>{moment(time).fromNow()}</Text>
                        {
                            status ==="unread" && <Text className={"text-gray text-[10px]"}>Chưa đọc</Text>
                        }
                    </View>
                </View>
            </TouchableOpacity>
        )
    } else if (type === "SHARE-001") {
        const {avatar, name} = options;
        return (
            <View style={{flex: 1, borderWidth: 1, borderColor: "000"}}
                  className={`px-3 py-4 h-[150px] mb-4 shadow-2xl rounded"}`}>
                <View className={"flex-row justify-between"}>
                    <View className={"flex gap-3 flex-row"}>
                        <Image className={"border-2 border-gray"}
                               source={{uri: avatar}}
                               style={{
                                   width: 50,
                                   height: 50,
                                   borderRadius: 1000,
                                   borderWidth: 2,
                                   borderColor: "#eee"
                               }}/>
                        <View className={"max-w-[200px]"}>
                            <Text className={"text-[14px] font-semibold mb-2"}>{name}</Text>
                            <Text className={"text-[12px] text-gray mb-3"}>{content.replace("@@@", name)}</Text>
                            <CustomButton size={14} color={"#000"} bg={"000"} title={"View"} onPress={onPress}/>
                        </View>
                    </View>
                    <View>
                        <Text className={"text-gray text-[10px] mb-2"}>{moment(time).fromNow()}</Text>
                        {
                            status ==="unread" && <Text className={"text-gray text-[10px]"}>Chưa đọc</Text>
                        }
                    </View>
                </View>
            </View>
        )
    } else if (type === "SHARE-002") {

    } else if (type === "ROOM-001") {
        const {avatar, name, room_id} = options;
        return (
            <LinearGradient className={"px-3 py-4 h-[180px] mb-4 shadow-2xl"} style={{flex:1,borderWidth: 2, borderColor: "#eee",borderRadius:8}} start={{x:0.1,y:0.2}} colors={["#BBD2C5","#536976", "#292E49"]}>
                <View className={"flex-row justify-between"}>
                    <View className={"w-[48%]"}>
                        <View className={"mb-1 flex-row gap-2"}>
                            <Text className={"text-[14px] font-semibold"}>{name}</Text>
                            <Image className={"border-2 border-gray"}
                                   source={{uri: avatar}}
                                   style={{
                                       borderRadius: 100,
                                       width:20,
                                       borderWidth: 1,
                                       height: 20,
                                       borderColor: "#eee"
                                   }}/>
                        </View>
                        <View className={"flex flex-row gap-1"}>
                            <Text className={"text-black text-[10px]"}>{moment(time).fromNow()}</Text>
                            {
                                status ==="unread" && <Text className={"text-gray text-[10px]"}>Chưa đọc</Text>
                            }
                        </View>
                        <Text className={"text-[12px] text-black mb-3"}>{content.replace("@@@", name)}</Text>
                        <CustomButton size={12} color={"#000"} bg={"#fff"} title={"Vào phòng"} onPress={onPress}/>
                    </View>
                    <View className={"w-[48%]"}>
                        <Image className={"border-2 border-gray h-full"}
                               source={{uri: avatar}}
                               resizeMode={'contain'}
                               style={{
                                   borderRadius: 10,
                                   borderWidth: 2,
                                   borderColor: "#eee"
                               }}/>
                    </View>
                </View>
            </LinearGradient>

        )
    }

    return (
        <View className={"p-3 bg-white flex flex-row gap-2 mb-4 justify-between items-center"}>
            <View className={"flex gap-3 flex-row"}>
                <Image className={"border-2 border-gray"}
                       source={{uri: "https://imageio.forbes.com/specials-images/imageserve/5c76b7d331358e35dd2773a9/0x0.jpg?format=jpg&crop=4401,4401,x0,y0,safe&height=416&width=416&fit=bounds"}}
                       style={{width: 50, height: 50, borderRadius: 1000, borderWidth: 2, borderColor: "#eee"}}/>
                <View className={"max-w-[200px]"}>
                    <Text className={"text-[14px] font-semibold"}>Nguyen Thi A</Text>
                    <Text className={"text-[12px] text-gray"}>{content}</Text>
                    <CustomButton color={"#000"} bg={"#fff"} title={"View"} onPress={() => {
                    }}/>
                </View>
            </View>
            <Text className={"text-gray text-[12px]"}>1m ago</Text>
        </View>
    )
}
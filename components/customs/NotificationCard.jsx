import {Alert, Image, Text, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment/moment";
import AntDesign from "@expo/vector-icons/AntDesign";
import CustomButton from "@/components/customs/CustomButton";
import {LinearGradient} from "expo-linear-gradient";
import {SYSTEM_NEW_FEATURE,SYSTEM_MAINTENANCE,ROOM_REALTIME,SHARE_QUIZ_TO_CLASSROOM,SHARE_QUIZ_TO_TEACHER} from "../../utils/notificationCode";
import {convertMarkdownToText} from "@/utils";
const COUNT_LENGTH = 25;
export default function NotificationCard({type,status,content = "", time, options = {},onPress}) {
    if (type === SYSTEM_MAINTENANCE) {
        const clearMarkdown = convertMarkdownToText(content);
        const newContent = clearMarkdown.length > COUNT_LENGTH ? clearMarkdown.substring(0, COUNT_LENGTH) + "..." : clearMarkdown;
        return (
            <TouchableOpacity style={{flex:1,borderWidth: 2, borderColor: "#eee",borderRadius:8}} className={"h-[100px] shadow px-1 py-2 mb-4"}  onPress={onPress}>
                <View className={`px-3 py-4 flex-row justify-between mb-4`}>
                    <View className={"flex gap-3 flex-row"}>
                        <View>
                            <Icon name={"settings"} size={24} color={"#000"}/>
                            {status ==="unread" && <View className={"w-[10px] absolute top-0 h-[10px] pb-2 rounded-full bg-red-600 "}></View>}
                        </View>
                        <View className={"max-w-[200px]"}>
                            <Text className={"text-[14px] font-semibold mb-2"}>Glemini System</Text>
                            <Text className={"text-[12px] text-gray"}>{newContent}</Text>
                        </View>
                    </View>
                    <View>
                        <Text className={"text-gray text-[10px] mb-2"}>{moment(time).fromNow()}</Text>
                    </View>
                </View>
            </TouchableOpacity>

        )
    } else if (type === SYSTEM_NEW_FEATURE) {
        const clearMarkdown = convertMarkdownToText(content);
        const newContent = clearMarkdown.length > COUNT_LENGTH ? clearMarkdown.substring(0, COUNT_LENGTH) + "..." : clearMarkdown;
        return (
            <TouchableOpacity style={{flex:1,borderWidth: 2, borderColor: "#eee",borderRadius:8}} className={"h-[100px] shadow px-1 py-2 mb-4"}  onPress={onPress}>
                <View className={`px-3 py-4 flex-row justify-between mb-4`}
                     >
                    <View className={"flex gap-3 flex-row"}>
                        <View>
                            <AntDesign name={"rocket1"} size={24} color={"#9f75ff"}/>
                            {status ==="unread" && <View className={"w-[10px] absolute top-0 h-[10px] pb-2 rounded-full bg-red-600 "}></View>}
                        </View>
                        <View className={"max-w-[200px]"}>
                            <Text className={"text-[14px] font-semibold mb-2"}>Glemini System</Text>
                            <Text className={"text-[12px] text-gray"}>{newContent}</Text></View>
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
    } else if (type === SHARE_QUIZ_TO_TEACHER) {
        const {avatar, name} = options
        return (
            <View style={{flex:1,borderWidth: 2, borderColor: "#eee",borderRadius:8}}
                  className={`px-3 py-4 h-[150px] mb-4`}>
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
    } else if (type === SHARE_QUIZ_TO_CLASSROOM) {

    } else if (type === ROOM_REALTIME) {
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
                        <View className={"flex flex-row gap-1 mb-2"}>
                            {
                                status ==="unread" && <Text className={"text-black text-[10px] p-1 rounded bg-white"}>Chưa đọc</Text>
                            }
                            <Text className={"text-black text-[10px]"}>{moment(time).fromNow()}</Text>
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
    else if (type === "CLASSROOM-001"){
        const {avatar,classroom_name,classroom_id} = options;
        return (
            <TouchableOpacity style={{flex:1,borderWidth: 2, borderColor: "#eee",borderRadius:8}} className={"h-[100px] shadow px-1 py-2 mb-4"} onPress={onPress}>
                <View className={"flex-row gap-2"}>
                    <View>
                        <Image className={"w-[60px] h-[60px] rounded object-contain"} source={require("../../assets/images/google-classroom.png")}/>
                        {status ==="unread" && <View className={"w-[10px] absolute top-0 left-1 h-[10px] pb-2 rounded-full bg-red-600 "}></View>}
                    </View>

                    <View>
                        <Text>{`Bạn đã được tham gia vào lớp ${classroom_name}`}</Text>
                        <Text className={"text-black text-[10px]"}>{moment(time).fromNow()}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    else if (type === "CLASSROOM-002"){
        const {classroom_name,classroom_id,exercise_name,exercise_id} = options;
        return (
            <TouchableOpacity style={{flex:1,borderWidth: 2, borderColor: "#eee",borderRadius:8}} className={"h-[100px] shadow px-1 py-2 mb-4"} onPress={onPress}>
                <View className={"flex-row gap-2"}>
                    <View>
                        <Image className={"w-[60px] h-[60px] rounded object-contain"} source={require("../../assets/images/share-icon.jpg")}/>
                        {status ==="unread" && <View className={"w-[10px] absolute top-2 left-3 h-[10px] pb-2 rounded-full bg-red-600 "}></View>}
                    </View>
                    <View className={"flex-1"}>
                        <Text>{`Bạn được giao bài tập ${exercise_name} trong lớp ${classroom_name}`}</Text>
                        <Text className={"text-black text-[10px]"}>{moment(time).fromNow()}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    else if (type === "SYS-003"){
        const {logo_status} = options;
        return (
            <TouchableOpacity style={{flex:1,borderWidth: 2, borderColor: "#eee",borderRadius:8}} className={"h-[100px] shadow px-1 py-2 mb-4"} onPress={onPress}>
                <View className={"flex-row gap-2"}>
                    <View>
                        <Image className={"w-[60px] h-[60px] rounded object-contain"} src={logo_status}/>
                        {status ==="unread" && <View className={"w-[10px] absolute top-2 left-3 h-[10px] pb-2 rounded-full bg-red-600 "}></View>}
                    </View>
                    <View className={"flex-1"}>
                        <Text>{content}</Text>
                        <Text className={"text-black text-[10px]"}>{moment(time).fromNow()}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

}
import {FlatList, Image, Text, View} from "react-native";

export default function NotificationScreen(){
    const dataTemp = Array.from({length:20});
    return (
        <View className={"px-1 bg-white pt-[20px]"}>
            <FlatList data={dataTemp} renderItem={(item)=>{
                return <NotificationCard/>
            }}/>
        </View>
    )
}

function NotificationCard(){
    return (
        <View className={"p-3 bg-white flex flex-row gap-2 mb-4 justify-between items-center"}>
           <View className={"flex gap-3 flex-row"}>
               <Image className={"border-2 border-gray"} source={{uri:"https://imageio.forbes.com/specials-images/imageserve/5c76b7d331358e35dd2773a9/0x0.jpg?format=jpg&crop=4401,4401,x0,y0,safe&height=416&width=416&fit=bounds"}} style={{width:50,height:50,borderRadius:1000,borderWidth:2,borderColor:"#eee"}} />
               <View className={"max-w-[200px]"}>
                   <Text className={"text-[14px] font-semibold"}>Nguyen Thi A</Text>
                   <Text className={"text-[12px] text-gray"}>Ba tan vlog da chia se quiz ABC cho ban</Text>
               </View>
           </View>
            <Text className={"text-gray text-[12px]"}>1m ago</Text>
        </View>
    )
}
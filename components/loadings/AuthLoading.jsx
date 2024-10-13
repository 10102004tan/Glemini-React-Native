import {Image, Modal, Text, View} from "react-native";

export default function AuthLoading(){
    return (
        <Modal>
            <View className={"flex-1 h-[100%] bg-white justify-center items-center"}>
                <Image className={"w-[100px] h-[100px]"} src={"https://cdn1.iconfinder.com/data/icons/logos-and-brands-3/512/84_Dev_logo_logos-512.png"}/>
            </View>
        </Modal>
    );
}
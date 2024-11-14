import React, { useEffect, useState } from "react";
import { View, Text, Modal, TextInput, TouchableOpacity, Pressable } from "react-native";
import Button from "../customs/Button";
import Icon from 'react-native-vector-icons/AntDesign';
import { SelectList } from "react-native-dropdown-select-list";
import Toast from "react-native-toast-message-custom";

const RoomWaitingModal = ({ visible, onClose, onSubmit }) => {
    const [roomCode, setRoomCode] = useState("");
    const [userMax, setUserMax] = useState("");
    const [description, setDescription] = useState("");

    // Function to generate a random 6-character code
    useEffect(() => {
        generateRoomCode()
    }, [visible])

    const generateRoomCode = () => {
        const characters = "abcdefghjklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        setRoomCode(result);
    };

    const handleFormSubmit = () => {
        if (!roomCode || !userMax) {
            Toast.show({
                type: "warn",
                text1: 'Cảnh báo',
                text2: 'Vui lòng nhập đầy đủ thông tin',
            })
            return
        }
        onSubmit({ roomCode, userMax, description });
        setRoomCode("");
        setUserMax("");
        setDescription("");
        onClose();
    };

    const userOptions = [
        { key: 0, value: 10 },
        { key: 1, value: 25 },
        { key: 2, value: 50 },
        { key: 3, value: 100 },
        { key: 4, value: 150 },
        { key: 5, value: 200 },
        { key: 6, value: 250 },
        { key: 7, value: 300 },
    ]

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-black/30">
                <View className="bg-white rounded-lg p-6 w-11/12">
                    <Pressable onPress={onClose} className="items-end flex absolute right-5 top-5">
                        <Icon name="close" size={25} />
                    </Pressable>
                    <Text className="text-xl font-semibold mb-4 text-center">
                        Nội dung phòng
                    </Text>
                    <View className='flex-row items-center w-full'>
                        <TextInput
                            className="border p-2 rounded-xl mb-2 w-full text-blue-600 font-semibold text-center"
                            value={roomCode}
                            onChangeText={setRoomCode}
                            maxLength={6}
                            editable={false}
                        />
                        <Button
                            onPress={generateRoomCode}
                            text={<Icon name="sync" size={20} />}
                            loading={false}
                            type="fill"
                            otherStyles="p-2 rounded-lg mb-2 bg-transparent absolute top-1 right-1"
                            textStyles="text-black text-center"
                        />

                    </View>
                    <SelectList
                        data={userOptions.map((cls) => ({
                            key: cls.key,
                            value: cls.value,
                        }))}
                        save="value"
                        setSelected={setUserMax}
                        placeholder="Chọn lớp học"
                    />
                    <TextInput
                        className="border py-2 px-4 rounded-xl my-2"
                        placeholder="Mô tả phòng họp"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                    />

                    <View className='w-full flex items-center'>
                    <Button
                        onPress={handleFormSubmit}
                        text="Tạo"
                        loading={false}
                        type="fill"
                        otherStyles="bg-pink-600 rounded-md w-1/3"
                        textStyles="text-white mx-auto py-1 text-base font-bold"
                    />
                    </View>
                </View>

            </View>
        </Modal>
    );
};

export default RoomWaitingModal;

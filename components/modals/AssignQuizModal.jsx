import React, { useState } from "react";
import { View, Text, Modal, TextInput, TouchableOpacity } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useClassroomProvider } from "@/contexts/ClassroomProvider.jsx";
import Toast from "react-native-toast-message-custom";

const AssignQuizModal = ({ visible, onClose, onAssign }) => {
    const { classrooms } = useClassroomProvider();
    const [selectedClass, setSelectedClass] = useState(null);
    const [assignmentName, setAssignmentName] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [deadline, setDeadline] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [datePickerMode, setDatePickerMode] = useState("start");

    const showDatePicker = (mode) => {
        setDatePickerMode(mode);
        setDatePickerVisibility(true);
    };
    const hideDatePicker = () => setDatePickerVisibility(false);

    const handleDateConfirm = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (datePickerMode === "start") {
            if (date < today) {
                Toast.show({
                    type: 'error',
                    text1: 'Ngày bắt đầu không được ở quá khứ.'
                });
                hideDatePicker();

                return;
            }
            setStartDate(date);
            if (date > deadline) setDeadline(date);
        } else {
            if (date < startDate) {
                Toast.show({
                    type: 'error',
                    text1: "Ngày kết thúc không thể trước ngày bắt đầu."
                });
                hideDatePicker();
                return;
            } else {
                setDeadline(date);
            }

        }
        hideDatePicker();
    };

    const handleClose = () => {
        onClose()
        hideDatePicker()
    }

    const handleConfirm = () => {
        if (!selectedClass || !assignmentName) {
            Toast.show({
                type: 'warn',
                text1: "Vui lòng nhập đầy đủ thông tin!"
            });
            return;
        }
        if (startDate > deadline) {
            Toast.show({
                type: 'warn',
                text1: "Ngày bắt đầu không thể sau ngày kết thúc."
            });
            return;
        }
        onAssign({ assignmentName, selectedClass, startDate, deadline });

        setSelectedClass('');
        setAssignmentName('');
        setStartDate(new Date());
        setDeadline(new Date());
        handleClose()
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => { handleClose() }}
        >
            <View className="flex-1 justify-center items-center bg-black/30">
                <View className="bg-white rounded-lg p-6 w-4/5">
                    <Text className="text-xl font-semibold mb-4">Giao bài tập</Text>

                    <TextInput
                        placeholder="Nhập tên bài tập"
                        value={assignmentName}
                        onChangeText={setAssignmentName}
                        className="border-b border-slate-300 mb-4 p-2"
                    />

                    <Text className="text-base mb-1">Chọn lớp</Text>
                    <SelectList
                        data={classrooms.map((cls) => ({
                            key: cls._id,
                            value: cls.class_name,
                        }))}
                        setSelected={setSelectedClass}
                        placeholder="Chọn lớp học"
                    />

                    <Text className="text-base mt-4 mb-2">Ngày bắt đầu</Text>
                    <TouchableOpacity onPress={() => showDatePicker("start")} className="border-b border-slate-300 py-2 mb-4">
                        <Text className="text-slate-600">
                            {startDate ? startDate.toLocaleString() : "Chọn ngày bắt đầu"}
                        </Text>
                    </TouchableOpacity>

                    <Text className="text-base mt-4 mb-2">Ngày kết thúc</Text>
                    <TouchableOpacity onPress={() => showDatePicker("end")} className="border-b border-slate-300 py-2 mb-4">
                        <Text className="text-slate-600">
                            {deadline ? deadline.toLocaleString() : "Chọn ngày kết thúc"}
                        </Text>
                    </TouchableOpacity>

                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="datetime" // Set mode to "datetime" to enable date and time selection
                        onConfirm={handleDateConfirm}
                        onCancel={hideDatePicker}
                        date={datePickerMode === "start" ? startDate : deadline}
                    />

                    <TouchableOpacity
                        onPress={handleConfirm}
                        className="bg-blue-500 rounded-md p-3 mt-4"
                    >
                        <Text className="text-white text-center">Giao bài tập</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        handleClose()
                    }} className="mt-2">
                        <Text className="text-center text-gray-500">Đóng</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default AssignQuizModal;

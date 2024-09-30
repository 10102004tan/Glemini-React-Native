import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Wrapper from "@/components/customs/Wrapper";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import icon from "../../../../assets/images/icon.png";
import Button from "../../../../components/customs/Button.jsx";
import { Image } from "react-native";
import { useAppProvider } from "@/contexts/AppProvider";
import BottomSheet from "@/components/customs/BottomSheet";
import { MaterialIcons } from "@expo/vector-icons";
import Overlay from "@/components/customs/Overlay";
import { SelectList } from "react-native-dropdown-select-list";

const detail_quizz_collection = () => {
  //Dropdown
  const nameSchool = [
    { title: "trường Cao Đẳng Công Nghệ Thủ Đức" },
    { title: "trường Cao Đẳng Cao Thắng" },
    { title: "trường Cao Đẳng Công Nghệ TPHCM" },
    { title: "trường Cao Đẳng FPT" },
    { title: "trường Cao Đẳng Công Thương" },
    { title: "trường Cao Đẳng Du Lịch" },
  ];

  const nameClass = [
    { title: "CD15TT05" },
    { title: "CD16TT12" },
    { title: "CD17TT14" },
    { title: "CD18TT02" },
    { title: "CD19TT15" },
    { title: "CD20TT09" },
    { title: "CD21TT01" },
    { title: "CD22TT11" },
  ];

  // BottomSheet
  const { isHiddenNavigationBar, setIsHiddenNavigationBar } = useAppProvider();
  const [visibleBottomSheet, setVisibleBottomSheet] = useState(false);
  const [visibleEditBottomSheet, setVisibleEditBottomSheet] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  const OpenBottomSheet = () => {
    setIsHiddenNavigationBar(true);

    setVisibleBottomSheet(true);
  };
  const openEditBottomSheet = () => {
    setVisibleEditBottomSheet(true);
    setIsHiddenNavigationBar(true);
  };

  const handleCloseBottomSheet = () => {
    setIsHiddenNavigationBar(false);
    setVisibleBottomSheet(false);
    setVisibleEditBottomSheet(false);
  };

  return (
    <Wrapper>
      {/* Overlay */}
      {visibleBottomSheet && <Overlay onPress={handleCloseBottomSheet} />}

      {/* Bottom Sheet */}
      <BottomSheet visible={visibleBottomSheet}>
        <Button
          text={"Chỉnh sửa"}
          otherStyles={"m-2 flex-row"}
          icon={<Entypo name="edit" size={16} color="white" />}
        ></Button>
        <Button
          text={"Xóa"}
          otherStyles={"m-2 flex-row"}
          icon={<MaterialIcons name="delete" size={16} color="white" />}
        ></Button>
        <Button
          text={"Chia sẻ bài kiểm tra"}
          otherStyles={"m-2 flex-row"}
          icon={<AntDesign name="sharealt" size={16} color="white" />}
          onPress={openEditBottomSheet}
        ></Button>
      </BottomSheet>

      {/* Edit Bottom Sheet */}
      <BottomSheet visible={visibleEditBottomSheet}>
        {/* Selected của trường */}
        <View className="mb-4">
          <Text className="text-lg font-semibold m-2">Chọn trường</Text>
          <SelectList
            setSelected={(val) => setSelectedSchool(val)}
            data={nameSchool.map((item) => item.title)}
          />
        </View>

        {/* Selected của lớp */}
        <View className="mb-4">
          <Text className="text-lg font-semibold m-2">Chọn lớp</Text>
          <SelectList
            setSelected={(val) => setSelectedClass(val)}
            data={nameClass.map((item) => item.title)}
          />
        </View>

        {/* Button Hủy và Chọn */}
        <View className="flex flex-row justify-between">
          <Button text="Hủy" otherStyles="w-[45%] bg-gray-200 p-2 rounded-xl" />
          <Button
            text="Chọn"
            otherStyles="w-[50%] bg-blue-500 p-2 rounded-xl"
            textStyles="text-white"
          />
        </View>
      </BottomSheet>

      <View className="flex m-2 ">
        <View className="flex-row justify-between">
          {/* nút quay lại */}
          <TouchableOpacity>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>

          {/* nút 3 chấm */}
          <TouchableOpacity onPress={OpenBottomSheet}>
            <Entypo name="dots-three-vertical" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View className="h-[100px] w-full border border-gray rounded-xl mt-4 flex-row">
          <View className="flex justify-center items-center ml-2">
            <Image
              source={icon}
              className="w-[80px] h-[80px] rounded-xl"
            ></Image>
          </View>
          <View className="flex-col">
            <Text className="ml-4 mt-2">Tên Quizz</Text>
            <Text className="ml-4 mt-2">
              ............................................
            </Text>
            <Text className="ml-4 mt-2">.......................</Text>
          </View>
        </View>
      </View>

      <View className="w-full h-[1px] bg-gray"></View>

      <View>
        <Text className="text-gray mt-8 text-right right-4">
          100 người đã tham gia
        </Text>
      </View>

      <View className="flex m-4 ">
        <View className="w-full border border-gray rounded-xl mt-4">
          <View className="flex-row m-2">
            <View className="w-[35px] h-[35px] bg-black flex justify-center items-center rounded-md">
              <Text className="text-white">1</Text>
            </View>
            <Text className="ml-3 mt-2">Loại câu hỏi</Text>
            <Text className="ml-[150px] mt-2 text-gray ">30 giây - 1 điểm</Text>
          </View>
          <Text className="ml-2 font-bold">Đây là nội dung của câu hỏi</Text>

          <View className="flex-col ml-2 mt-8">
            <View className="flex-row">
              <View className="w-[15px] h-[15px] bg-green-500  flex justify-center items-center">
                <AntDesign name="check" size={12} color="white" />
              </View>
              <Text className="ml-2">Đáp án chính xác</Text>
            </View>

            <View className="flex-row mt-1">
              <View className="w-[15px] h-[15px] bg-red-600  flex justify-center items-center rounded-[15px]">
                <AntDesign name="close" size={12} color="white" />
              </View>
              <Text className="ml-2">Đáp án không chính xác</Text>
            </View>

            <View className="flex-row mt-1">
              <View className="w-[15px] h-[15px] bg-red-600  flex justify-center items-center rounded-[15px]">
                <AntDesign name="close" size={12} color="white" />
              </View>
              <Text className="ml-2">Đáp án không chính xác</Text>
            </View>

            <View className="flex-row mt-1">
              <View className="w-[15px] h-[15px] bg-red-600  flex justify-center items-center rounded-[15px]">
                <AntDesign name="close" size={12} color="white" />
              </View>
              <Text className="ml-2">Đáp án không chính xác</Text>
            </View>
          </View>

          <Text className="text-gray flex p-1 text-right mr-1">
            Xem giải thích
          </Text>
        </View>
      </View>
      <View className="w-full h-[1px] bg-gray mt-[320px]"></View>
      <View className="p-2">
        <Button
          text={"Tạo phòng"}
          otherStyles={"p-4"}
          textStyles={"text-center"}
        ></Button>
      </View>
    </Wrapper>
  );
};

export default detail_quizz_collection;

import {Text, TouchableOpacity, View} from "react-native";
import React from "react";

export default function SchoolItem({handlerSelectSchool,selectedSchool,item,isScrolling}) {
    const isSchoolSelected = selectedSchool.find(school => school._id === item._id);
    return (
        <TouchableOpacity onPress={()=> !isScrolling && handlerSelectSchool(item)} className={`px-2 py-3 rounded ${!isSchoolSelected ? "bg-[#eee]":"bg-amber-300"} mb-3`}>
            <Text className={"w-[100%] max-h-[40px] rounded-[10px] bg-white px-2 mb-2"}>{item.school_name.trim().replace("- ","")}</Text>
            <View className={"flex-row gap-2 items-center"}>
                {
                    item.district && item.district.district_name && (<Text className={"text-[10px] rounded-[10px] bg-gray px-2 text-white"}>{item.district.district_name}</Text>)
                }
                {
                    item.province && item.province.province_name && (<Text className={"text-[10px] rounded-[10px] bg-gray px-2 text-white"}>{item.province.province_name}</Text>)
                }

                {
                    item.governing_body && (<Text className={"text-[10px] rounded-[10px] bg-gray px-2 text-white"}>{item.governing_body}</Text>)
                }
            </View>
        </TouchableOpacity>
    )
}
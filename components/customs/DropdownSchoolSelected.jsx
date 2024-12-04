import SearchBar from "react-native-dynamic-search-bar";
import {FlatList, ScrollView, Text, TouchableOpacity, View} from "react-native";
import React, {useState} from "react";
import SchoolItem from "@/components/customs/SchoolItem";

export default function DropdownSchoolSelected({isOpenDropdownSchool,setIsOpenDropdownSchool,selectedSchool,schools,handlerSearchSchool,handlerSelectSchool,setKeyword,keyword=''}) {
    const [isScrolling, setIsScrolling] = useState(false);
    return (
        <View className={"p-2 rounded-[10px] bg-white border-amber-400 mb-2"} style={{borderColor:"#eee",borderWidth:2}}>
            {isOpenDropdownSchool && (<SearchBar value={keyword} placeholder="Search here" onBlur={handlerSearchSchool} onSearchPress={handlerSearchSchool} onClearPress={()=>setIsOpenDropdownSchool(false)} onChangeText={(text) => setKeyword(text)}/>)}

            {selectedSchool.length > 0 && !isOpenDropdownSchool ? (<TouchableOpacity onPress={()=>setIsOpenDropdownSchool(true)} className={"flex-row flex-wrap gap-2 items-center p-2 max-h-[80px] rounded-[10px]"}>
                {
                    selectedSchool.map((item,index) => (<View  key={index} onPress={() => handlerSelectSchool(item)}>
                        <Text
                            className={"text-[10px] rounded-[10px] bg-gray px-2 text-white"}>{item.school_name.trim().replace("- ", "")}</Text>
                    </View>))
                }
            </TouchableOpacity>) : (<TouchableOpacity onPress={()=>setIsOpenDropdownSchool(true)} className={"flex-row flex-wrap gap-2 items-center p-2 max-h-[80px] rounded-[10px]"}><Text>Chọn trường</Text></TouchableOpacity>)}

            {isOpenDropdownSchool &&  (<View className={"flex-row flex-wrap gap-2 items-center p-2 max-h-[80px] rounded-[10px]"}>
                {
                    selectedSchool.map((item,index) => (<TouchableOpacity  key={index} onPress={() =>handlerSelectSchool(item)}>
                        <Text
                            className={"text-[10px] rounded-[10px] bg-gray px-2 text-white"}>{item.school_name.trim().replace("- ", "")}</Text>
                    </TouchableOpacity>))
                }

            </View>)}


            {
                isOpenDropdownSchool  && ( <ScrollView nestedScrollEnabled={true}
                                                        onScrollBeginDrag={() => setIsScrolling(true)}
                                                        onScrollEndDrag={() => setIsScrolling(false)}
                                                        scrollEventThrottle={5}
                                                      style={{
                                                          height:400,
                                                          marginTop:5
                                                      }}>
                    {
                        schools.map((item,index) => {
                            return (
                                <SchoolItem isScrolling={isScrolling} key={index} handlerSelectSchool={handlerSelectSchool} selectedSchool={selectedSchool} item={item}/>
                            )
                        })
                    }
                </ScrollView>)
            }
        </View>
    );
}
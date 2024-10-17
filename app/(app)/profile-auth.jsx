import {FlatList, Image, View} from "react-native";
import {useContext, useEffect, useState} from "react";
import AccoutntStatusItem from "@/components/customs/AccountStatusItem";
import {API_VERSION,API_URL,END_POINTS} from "@/configs/api.config";
import {AuthContext} from "@/contexts/AuthContext";



export default function ProfileAuth(){
    const {userData:{accessToken,_id},teacherStatus} = useContext(AuthContext);
    const [urls,setUrls] = useState([]);
    useEffect(()=>{
        fetchUrls();
    },[]);

    //fetch urls
    const fetchUrls = async ()=>{
        try {
            const response = await fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.PROFILE_TEACHER_IMAGES}`,{
                method:"POST",
                headers:{
                    'Content-Type':'application/json',
                    'authorization':`${accessToken}`,
                    'x-client-id':`${_id}`
                },
            });

            const data = await response.json();
            if (data.statusCode === 200){
                setUrls(data.metadata.file_urls);
            }
        }catch (e) {
            console.log(e);
        }
    }



    return (
        <View className={"mt-3 mx-3"}>
            <View className={"w-[100%] p-3 rounded"}>
                <AccoutntStatusItem status={teacherStatus}/>
            </View>
            <FlatList keyExtractor={item => item} data={urls} renderItem={(item)=>{
                return (
                    <View className={"bg-white p-2 rounded mb-3 shadow"}>
                        <Image source={{uri:item.item}} style={{width:100,height:100,borderRadius:10}}/>
                    </View>
                )
            }}
            />
        </View>
    )
}

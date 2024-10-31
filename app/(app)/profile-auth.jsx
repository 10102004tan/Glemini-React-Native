import {FlatList, Image, Modal, Pressable, Text, TouchableOpacity, View} from "react-native";
import React, {useContext, useEffect, useState} from "react";
import AccoutntStatusItem from "@/components/customs/AccountStatusItem";
import {API_VERSION,API_URL,END_POINTS} from "@/configs/api.config";
import {AuthContext} from "@/contexts/AuthContext";
import {FontAwesome} from "@expo/vector-icons";
import InputImage from "@/components/customs/InputImage";
import {useAppProvider} from "@/contexts/AppProvider";
import * as ImagePicker from "expo-image-picker";
import CustomButton from "@/components/customs/CustomButton";
import Toast from "react-native-toast-message-custom";


const TIME_SHOW_TOAST = 1500;
const TYPEIMAGE = {
    IDCard: 'IDCard',
    Card: 'Card',
    Confirm: 'Confirm'
};

export default function ProfileAuth(){
    const {userData:{accessToken,_id},teacherStatus,setTeacherStatus} = useContext(AuthContext);
    const [isOpenedModal, setIsOpenedModal] = useState(false);
    const [imageCurrent, setImageCurrent] = useState('');
    const [urls,setUrls] = useState([]);
    const [imageIDCard, setImageIDCard] = useState('');
    const [imageCard, setImageCard] = useState('');
    const [imageConfirm, setImageConfirm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const {i18n} = useAppProvider();
    useEffect(()=>{
        if (teacherStatus !== "rejected"){
            fetchUrls();
        }
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

    // upload image
    const reUploadFiles = async () => {

        // validate
        if (!imageCard || !imageIDCard || !imageConfirm){
            Toast.show({
                type:'error',
                text1:'Thông báo',
                text2:'Vui lòng cung cấp đủ thông tin'
            });
            return;
        }



        const formData = new FormData();
        formData.append('images', {
            uri: imageCard.uri,
            type: `${imageCard.type}/${imageCard.name.split(".")[1]}`,
            name: imageCard.name
        });


        formData.append('images', {
            uri: imageIDCard.uri,
            type: `${imageIDCard.type}/${imageIDCard.name.split(".")[1]}`,
            name: imageIDCard.name
        });
        formData.append('images', {
            uri: imageConfirm.uri,
            type:`${imageConfirm.type}/${imageConfirm.name.split(".")[1]}`,
            name: imageConfirm.name
        });


        setIsLoading(true);
        fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.RE_UPLOAD}`,{
            method:'POST',
            headers:{
                'Content-Type':'multipart/form-data',
                'authorization':`${accessToken}`,
                'x-client-id':`${_id}`
            },
            body:formData
        }).then(response => response.json())
            .then(data => {
                if (data.statusCode ===200){
                    // set teacher status
                    setTeacherStatus("pedding");
                    setUrls(data.metadata);
                }
                setIsLoading(false);
            })
            .catch(err =>
                setIsLoading(false)
            );
    }

    const handlerLongPress = ({type,uri}) => {
        setIsOpenedModal(true);
        if (uri){
            setImageCurrent(uri);
        }

        if (type){
            if (type === TYPEIMAGE.Card){
                setImageCurrent(imageCard.uri);
            }
            else if (type === TYPEIMAGE.IDCard){
                setImageCurrent(imageIDCard.uri);
            }
            else {
                setImageCurrent(imageConfirm.uri);
            }
        }
    };

    const handlerPickImage = async (type) => {
        if (type === TYPEIMAGE.IDCard) {
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                quality: 1,
            })
            if (!result.canceled) {
                setImageIDCard({
                    uri: result.assets[0].uri,
                    type: result.assets[0].type,
                    name: result.assets[0].fileName
                });
            }
        }
        else if (type === TYPEIMAGE.Card) {
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            if (permissionResult.granted === false) {
                alert("Permission to access camera is required!");
                return;
            }
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                quality: 1,
            })

            if (!result.canceled) {
                setImageCard({
                    uri: result.assets[0].uri,
                    type: result.assets[0].type,
                    name: result.assets[0].fileName
                });
            }
        }
        else{
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                quality: 1,
            })

            if (!result.canceled) {
                setImageConfirm({
                    uri: result.assets[0].uri,
                    type: result.assets[0].type,
                    name: result.assets[0].fileName
                });
            }
        }

        console.log(imageCard,imageIDCard,imageConfirm);
    };



    return (
        <View className={"mt-3 mx-3"}>
            <View className={"w-[100%] p-3 rounded"}>
                <AccoutntStatusItem status={teacherStatus}/>

            </View>
            {
                teacherStatus === "rejected" && ( <View className={"bg-amber-200 rounded w-[100%] mb-3 p-3"} style={{height:100}}>
                    <FontAwesome name={"exclamation-circle"} size={24} color={"#f00"} />
                    <Text className={"text-gray mt-2"}>
                        Xác thực tài khoản thất bại, vui lòng cung cấp thông tin chính xác, rõ ràng
                    </Text>
                </View>)
            }

            {
                teacherStatus === "pedding" || teacherStatus === "active" ?(

            <FlatList keyExtractor={item => item} data={urls} renderItem={(item)=>{
                return (
                    <View className={"bg-white p-2 rounded mb-3 shadow flex-row items-center"}>
                        <View>
                            <Text className={"mb-2"}></Text>
                            <TouchableOpacity onPress={()=>handlerLongPress({uri:item.item})}>
                                <Image source={{uri:item.item}} style={{width:100,height:100,borderRadius:10}}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }}
            />):(
            <View>
                <InputImage onLongPress={()=>handlerLongPress({type:TYPEIMAGE.Card})} onPress={()=>{handlerPickImage(TYPEIMAGE.Card)}} desc={i18n.t("signUp.descForCard")} title={i18n.t('signUp.card')} logo={(imageCard ? imageCard.uri : 'https://cdn-icons-png.flaticon.com/512/175/175062.png')} />
                <InputImage onLongPress={()=>handlerLongPress({type:TYPEIMAGE.IDCard})} onPress={()=>{handlerPickImage(TYPEIMAGE.IDCard)}} desc={i18n.t("signUp.descForCardID")} title={i18n.t('signUp.cardID')} logo={(imageIDCard?imageIDCard.uri:'https://cdn-icons-png.flaticon.com/512/6080/6080012.png')} />
                <InputImage onLongPress={()=>handlerLongPress({type:TYPEIMAGE.Confirm})} onPress={()=>{handlerPickImage(TYPEIMAGE.Confirm)}} desc={i18n.t("signUp.descForDocument")} title={i18n.t('signUp.documentConfirm')} logo={(imageConfirm?imageConfirm.uri:'https://cdn-icons-png.freepik.com/256/888/888034.png?semt=ais_hybrid')} />
                <CustomButton disabled={isLoading} title={"Gửi yêu cầu xác thực"} onPress={reUploadFiles}/>
            </View>
            )
            }
            <Modal animationType='slide' transparent={true} visible={isOpenedModal}>
                <Pressable onPress={()=>setIsOpenedModal(false)} className="bg-[#00000097] h-[100%] flex justify-center items-center px-5">
                    <View className="w-[100%] h-[30%] bg-white p-2">
                        <Image resizeMode='contain' className="w-[100%] h-[100%]" source={{ uri: (imageCurrent ? imageCurrent : 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png') }} alt="avatar" />
                    </View>
                </Pressable>
            </Modal>
        </View>
    )
}

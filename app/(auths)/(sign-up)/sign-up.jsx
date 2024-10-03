import { View, Text, TextInput, Button, Pressable, Alert, Image, Modal } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';

import { Link, router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import CustomInput from '@/components/customs/CustomInput';
import InputImage from '@/components/customs/InputImage';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '@/contexts/AuthContext';


const TYPEIMAGE = {
    IDCard: 'IDCard',
    Card: 'Card',
    Confirm: 'Confirm'
};

const SignUpScreen = () => {

    const {signUp} = useContext(AuthContext);
    const { type } = useLocalSearchParams();
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordVerify, setShowPasswordVerify] = useState(false);
    const [password, setPassword] = useState('');
    const [fullname, setFullname] = useState('');
    const [passwordVerify, setPasswordVerify] = useState('');
    const [imageIDCard, setImageIDCard] = useState('');
    const [imageCard, setImageCard] = useState('');
    const [imageConfirm, setImageConfirm] = useState('');
    const [imageCurrent, setImageCurrent] = useState('');
    const [isOpenedModal, setIsOpenedModal] = useState(false);

    const handlerSignUp = async () => {
        // check validate
        if (!email) {
            Alert.alert('Thông báo', 'Vui lòng nhập email');
            return;
        }
        if (!password) {
            Alert.alert('Thông báo', 'Vui lòng nhập mật khẩu');
            return;
        }
        if (!fullname) {
            Alert.alert('Thông báo', 'Vui lòng nhập họ tên');
            return;
        }

        if (password !== passwordVerify) {
            Alert.alert('Thông báo', 'Mật khẩu không khớp');
            return;
        }
        // if type = teacher => check image
        if (type === "teacher") {
            if (!imageIDCard || !imageCard || !imageConfirm) {
                Alert.alert('Thông báo', 'Vui lòng cung cấp đủ ảnh');
                return;
            }
        }

        // call api
        await signUp({email, password, fullname, type})
        .then((res) => {
            if (res === 1){
                Alert.alert('Thông báo', 'Đăng ký thành công');
            }
            else{
                Alert.alert('Thông báo', 'Đăng ký thất bại');
            }
        })
        .catch((err) => {
            Alert.alert('Thông báo', 'Đăng ký thất bại');
        });
    };

    const handlerPickImage = async (type) => {
        if (type === TYPEIMAGE.IDCard) {
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                quality: 1,
            })

            if (!result.canceled) {
                setImageIDCard(result.assets[0].uri);
            }
        }
        else if (type === TYPEIMAGE.Card) {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                quality: 1,
            })

            if (!result.canceled) {
                setImageCard(result.assets[0].uri);
            }
        }
        else{
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                quality: 1,
            })

            if (!result.canceled) {
                setImageConfirm(result.assets[0].uri);
            }
        }
    };

    const handlerLongPress = (type) => {
        if (type === TYPEIMAGE.IDCard) {
            setImageCurrent(imageIDCard);
        }
        else if (type === TYPEIMAGE.Card) {
            setImageCurrent(imageCard);
        }
        else {
            setImageCurrent(imageConfirm);
        }
        setIsOpenedModal(true);
    };

    return (
        <View>
            <Text className="mt-[30px] text-[16px]">Tạo tài khoản mới</Text>
            <Text className="mt-3 text-[25px]">Bắt đầu nào</Text>
            <View className="flex flex-row mt-3">
                    <Text className='mr-2'>Đã có tài khoản ?</Text>
                    <Link href={"/sign-in"}>
                        <Text className="text-blue-500">Đăng nhập ngay</Text>
                    </Link>
                </View>
            <View className="mt-[30px]">
                <CustomInput onChangeText={setFullname} label="Họ và tên" value={fullname} />
                <CustomInput label="Email" value={email} onChangeText={setEmail} />
                <CustomInput secure={!showPassword} onChangeText={setPassword} label="Mật khẩu" value={password} />
                <CustomInput secure={!showPasswordVerify} onChangeText={setPasswordVerify} label="Nhập lại mật khẩu" value={passwordVerify} />
                {type === "teacher" && (
                    <View>
                        <InputImage onLongPress={()=>handlerLongPress(TYPEIMAGE.Card)} onPress={()=>{handlerPickImage(TYPEIMAGE.Card)}} desc={'Chúng tôi cần bạn cung cấp'} title={'Ảnh thẻ'} logo={(imageCard ? imageCard : 'https://cdn-icons-png.flaticon.com/512/175/175062.png')} />
                        <InputImage onLongPress={()=>handlerLongPress(TYPEIMAGE.IDCard)} onPress={()=>{handlerPickImage(TYPEIMAGE.IDCard)}} desc={'CCCD bắt buộc chụp trực tiếp'} title={'CCCD'} logo={(imageIDCard?imageIDCard:'https://cdn-icons-png.flaticon.com/512/6080/6080012.png')} />
                        <InputImage onLongPress={()=>handlerLongPress(TYPEIMAGE.Confirm)} onPress={()=>{handlerPickImage(TYPEIMAGE.Confirm)}} desc={'Các giấy tờ chứng minh việc bạn có giảng dạy'} title={'Giấy xác nhận'} logo={(imageConfirm?imageConfirm:'https://cdn-icons-png.freepik.com/256/888/888034.png?semt=ais_hybrid')} />
                    </View>
                )}
                <Pressable onPress={handlerSignUp}>
                    <View className=' bg-black py-3 rounded mb-5 mt-4'>
                        <Text className="text-white text-center text-[16px]">Tạo tài khoản</Text>
                    </View>
                </Pressable>
               
            </View>
                
            <Modal animationType='slide' transparent={true} visible={isOpenedModal}>
                <Pressable onPress={()=>setIsOpenedModal(false)} className="bg-[#00000097] h-[100%] flex justify-center items-center px-5">
                    <View className="w-[100%] h-[30%] bg-white p-2">
                        <Image resizeMode='contain' className="w-[100%] h-[100%]" source={{ uri: (imageCurrent ? imageCurrent : 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png') }} alt="avatar" />
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

export default SignUpScreen;




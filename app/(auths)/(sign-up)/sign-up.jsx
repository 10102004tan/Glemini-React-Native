import {View, Text, TextInput, Button, Pressable, Alert, Image, Modal, TouchableOpacity} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';

import { Link, router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import CustomInput from '@/components/customs/CustomInput';
import InputImage from '@/components/customs/InputImage';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '@/contexts/AuthContext';
import {debounce, validateEmail, validateFullname, validatePassword} from '@/utils';
import { useAppProvider } from '@/contexts/AppProvider';
import Toast from 'react-native-toast-message';
import CustomButton from "@/components/customs/CustomButton";


const TIME_SHOW_TOAST = 1500;
const TYPEIMAGE = {
    IDCard: 'IDCard',
    Card: 'Card',
    Confirm: 'Confirm'
};

const SignUpScreen = () => {
    const {i18n} = useAppProvider();
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
    const [disabled, setDisabled] = useState(false);
    const handlerSignUp = async () => {
        setDisabled(true);
        await signUp({email, password, fullname, type,images:[imageIDCard,imageCard,imageConfirm]})
            .then((message) => {
                Toast.show({
                    type: 'success',
                    text1: i18n.t('success.signUp'),
                    text2: message,
                    visibilityTime: TIME_SHOW_TOAST,
                    autoHide: true,
                });
                setDisabled(false);
            })
            .catch((error) => {
                Toast.show({
                    type: 'error',
                    text1: i18n.t('error.title'),
                    text2: error.message,
                    visibilityTime: TIME_SHOW_TOAST,
                    autoHide: true,
                });
                setDisabled(false);
            }).catch(e=>{
                setDisabled(false);
            });
    };

    const handlerPickImage = async (type) => {
        if (type === TYPEIMAGE.IDCard) {
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                quality: 1,
            })
            console.log(result.assets[0].fileName.split(".")[1]);
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
        setDisabled(true);
    };

    const handlerValidate = () => {
        if (!fullname) {
            Toast.show({
                type: 'error',
                text1: i18n.t('error.title'),
                text2: i18n.t('error.fullnameRequired'),
                visibilityTime: TIME_SHOW_TOAST,
                autoHide: true,
            });
            return false;
        }

        if (!validateFullname(fullname)) {
            Toast.show({
                type: 'error',
                text1: i18n.t('error.title'),
                text2: i18n.t('error.fullnameRequired'),
                visibilityTime: TIME_SHOW_TOAST,
                autoHide: true,
            });
            return false;
        }

        // check validate
        if (!email) {
            Toast.show({
                type: 'error',
                text1: i18n.t('error.title'),
                text2: i18n.t('error.emailRequired'),
                visibilityTime: TIME_SHOW_TOAST,
                autoHide: true,
            });
            return;
        }
        if(!validateEmail(email)){
            Toast.show({
                type: 'error',
                text2: i18n.t('error.emailInvalid'),
                visibilityTime: TIME_SHOW_TOAST,
                autoHide: true,
            });
            return false;
        }
        if (!password) {
            Toast.show({
                type: 'error',

                text2: i18n.t('error.passwordRequired'),
                visibilityTime: TIME_SHOW_TOAST,
                autoHide: true,
            });
            return false;
        }

        if (!validatePassword(password)) {
            Toast.show({
                type: 'error',
                text1: i18n.t('error.title'),
                text2: i18n.t('error.passwordInvalid'),
                visibilityTime: TIME_SHOW_TOAST,
                autoHide: true,
            });
            return false;
        }

        if (password !== passwordVerify) {
            Toast.show({
                type: 'error',
                text1: i18n.t('error.title'),
                text2: i18n.t('error.passwordNotMatch'),
                visibilityTime: TIME_SHOW_TOAST,
                autoHide: true,
            });
            return false;
        }

        // if type = teacher => check image
        if (type === "teacher") {
            if (!imageIDCard || !imageCard || !imageConfirm) {
                Toast.show({
                    type: 'error',
                    text1: i18n.t('error.title'),
                    text2: i18n.t('error.imageRequired'),
                    visibilityTime: TIME_SHOW_TOAST,
                    autoHide: true,
                });
                return false;
            }
        }

        return true;
    };

    return (
        <View>
            <Text className="mt-[30px] text-[16px]">{i18n.t('signUp.title')}</Text>
            <Text className="mt-3 text-[25px]">{i18n.t('signUp.startNow')}</Text>
            <View className="flex flex-row mt-3">
                    <Text className='mr-2'>{i18n.t('signUp.haveAccount')}</Text>
                    <Link href={"/sign-in"}>
                        <Text className="text-blue-500">{i18n.t('signUp.signInNow')}</Text>
                    </Link>
                </View>
            <View className="mt-[30px]">
                <CustomInput onChangeText={setFullname} label={i18n.t('signUp.fullname')} value={fullname} />
                <CustomInput label={i18n.t('signUp.email')} value={email} onChangeText={setEmail} />
                <CustomInput secure={!showPassword} onChangeText={setPassword} label={i18n.t('signUp.password')} value={password} />
                <CustomInput secure={!showPasswordVerify} onChangeText={setPasswordVerify} label={i18n.t('signUp.confirmPassword')} value={passwordVerify} />
                {type === "teacher" && (
                    <View>
                        <InputImage onLongPress={()=>handlerLongPress(TYPEIMAGE.Card)} onPress={()=>{handlerPickImage(TYPEIMAGE.Card)}} desc={i18n.t("signUp.descForCard")} title={i18n.t('signUp.card')} logo={(imageCard ? imageCard.uri : 'https://cdn-icons-png.flaticon.com/512/175/175062.png')} />
                        <InputImage onLongPress={()=>handlerLongPress(TYPEIMAGE.IDCard)} onPress={()=>{handlerPickImage(TYPEIMAGE.IDCard)}} desc={i18n.t("signUp.descForCardID")} title={i18n.t('signUp.cardID')} logo={(imageIDCard?imageIDCard.uri:'https://cdn-icons-png.flaticon.com/512/6080/6080012.png')} />
                        <InputImage onLongPress={()=>handlerLongPress(TYPEIMAGE.Confirm)} onPress={()=>{handlerPickImage(TYPEIMAGE.Confirm)}} desc={i18n.t("signUp.descForDocument")} title={i18n.t('signUp.documentConfirm')} logo={(imageConfirm?imageConfirm.uri:'https://cdn-icons-png.freepik.com/256/888/888034.png?semt=ais_hybrid')} />
                    </View>
                )}
                <CustomButton disabled={disabled} className={"mb-4"}  onPress={()=>handlerValidate() && handlerSignUp()} title={i18n.t('signUp.signUp')} />
            </View>
                
            <Modal animationType='slide' transparent={true} visible={isOpenedModal}>
                <Pressable onPress={()=>setIsOpenedModal(false)} className="bg-[#00000097] h-[100%] flex justify-center items-center px-5">
                    <View className="w-[100%] h-[30%] bg-white p-2">
                        <Image resizeMode='contain' className="w-[100%] h-[100%]" source={{ uri: (imageCurrent ? imageCurrent.uri : 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png') }} alt="avatar" />
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

export default SignUpScreen;




import { Alert, Keyboard, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useGlobalSearchParams } from "expo-router";
import CustomInput from "@/components/customs/CustomInput";
import { useContext, useEffect, useState } from "react";
import CustomButton from "@/components/customs/CustomButton";
import { SelectList } from "react-native-dropdown-select-list";
import { AuthContext } from "@/contexts/AuthContext";
import { API_URL, API_VERSION, END_POINTS } from "@/configs/api.config";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useAppProvider} from "@/contexts/AppProvider";

export default function ProfileEditScreen() {
    const {i18n} = useAppProvider();
    const {fetchDetailUser,userData:{accessToken,_id},userData,setUserData} = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [schoolList, setSchoolList] = useState([]);
    const [prevData, setPrevData] = useState({});

    const [data, setData] = useState({
        email: "",
        fullname: "",
    });

    useEffect(()=>{
        setIsLoading(true);
        fetchDetailUser().then((res)=>{
            setData(prevData => ({
                ...prevData,
                fullname: res.user_fullname,
                email: res.user_email,
            }));
            setPrevData({
                fullname: res.user_fullname,
                email: res.user_email,
            });
        });
        setIsLoading(false);
    },[]);

    const handleInputChange = (key, value) => {
        setData(prevData => ({
            ...prevData,
            [key]: value
        }));
    };

    const fetchListSchool = async () => {
        fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.SCHOOL_LIST}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((response) => response.json())
        .then((data) => {
            setSchoolList(data.metadata);
        })
        .catch((error) => {
            console.log(error);
        });
    };


    const handleSave = async() => {
        Keyboard.dismiss();
        //validate
        if (!data.email) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Email is required'
            })
            return;
        }

        if (!data.fullname) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Fullname is required'
            })
            return;
        }

        if (data.email === prevData.email && data.fullname === prevData.fullname) return;
        fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.PROFILE_EDIT}`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                authorization: `${accessToken}`,
                'x-client-id': _id,
            },
            body: JSON.stringify({
                email: (data.email === prevData.email) ? null : data.email,
                fullname: data.fullname,
            })
        })
        .then((response) => response.json())
        .then(async (rs) => {
            if(rs.statusCode === 200){
                // update name in context
                const dataStore = { ...userData, user_fullname:data.fullname, user_email: data.email };
                await AsyncStorage.setItem("userData", JSON.stringify(dataStore));
                setUserData(dataStore);
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Update profile successfully'
                })
            }
            else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: rs.message
                })
            }


        })
        .catch((error) => {
            console.log(error);
        });

    };
    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    return (
        <View className="mx-3 mt-3">
            <CustomInput label={i18n.t("profile.email")} onChangeText={(value)=>handleInputChange('email',value)} value={data.email.trim()} />
            <CustomInput label={i18n.t("profile.fullname")} onChangeText={(value)=>handleInputChange('fullname',value)} value={data.fullname} />
            <View className="mb-3">
                <Text>School</Text>
                {/*<SelectList*/}
                {/*    data={schoolList}*/}
                {/*    label="School"*/}
                {/*    setSelected={(key) => handleInputChange('school', key)}*/}
                {/*    />*/}
            </View>
            <CustomButton title={i18n.t("profile.save")} onPress={() => {handleSave()}} />
        </View>
    )
}


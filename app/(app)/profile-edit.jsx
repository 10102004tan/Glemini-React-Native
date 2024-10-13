import { Alert, Keyboard, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useGlobalSearchParams } from "expo-router";
import CustomInput from "@/components/customs/CustomInput";
import { useContext, useEffect, useState } from "react";
import CustomButton from "@/components/customs/CustomButton";
import { SelectList } from "react-native-dropdown-select-list";
import { AuthContext } from "@/contexts/AuthContext";
import { API_URL, API_VERSION, END_POINTS } from "@/configs/api.config";

export default function ProfileEditScreen() {

    const {fetchDetailUser,userData:{accessToken,_id}} = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [schoolList, setSchoolList] = useState([]);

    const [data, setData] = useState({
        email: "aa",
        fullname: "",
        school: "",
    });

    useEffect(()=>{
        setIsLoading(true);
        fetchDetailUser().then((res)=>{
            setData(prevData => ({
                ...prevData,
                email: res.user_email,
                fullname: res.user_fullname,
                school:1
            }));
        });
        fetchListSchool();
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
            Keyboard.dismiss();
        })
        .catch((error) => {
            console.log(error);
        });
    };


    const handleSave = async() => {
        //validate
        if (!data.email) {
            Alert.alert('Notification', 'Email is required');
            return;
        }

        if (!data.fullname) {
            Alert.alert('Notification', 'Fullname is required');
            return;
        }

        fetch(`${API_URL}${API_VERSION.V1}${END_POINTS.PROFILE_EDIT}`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                authorization: `${accessToken}`,
                'x-client-id': _id,
            },
            body: JSON.stringify(data)
        })
        .then((response) => response.json())
        .then((data) => {
            if(data.statusCode === 200){
                Alert.alert('Notification', 'Update successfully');
            }
            console.log(data);
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
            <CustomInput label="Email" onChangeText={(value)=>handleInputChange('email',value)} value={data.email} />
            <CustomInput label="Fullname" onChangeText={(value)=>handleInputChange('fullname',value)} value={data.fullname} />
            <View className="mb-3">
                <Text>School</Text>
                <SelectList
                    data={schoolList}
                    label="School"
                    setSelected={(key) => handleInputChange('school', key)}
                    />

            </View>
            <CustomButton title="Save" onPress={() => {handleSave()}} /> 
        </View>
    )
}


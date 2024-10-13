import { Redirect, Slot } from "expo-router";
import { useContext} from "react";
import {KeyboardAvoidingView, ScrollView, View} from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { useAppProvider } from "@/contexts/AppProvider";
import { FontAwesome } from "@expo/vector-icons";
import { SelectList } from "@10102004tan/react-native-select-dropdown-v2";


export default function AuthLayout() {
	const { userData } = useContext(AuthContext);
	const { handlerLanguage, language, i18n } = useAppProvider();
	const dataLanguage = [
		{
			key: 'vi',
			value: i18n.t('language.vietnamese'),
		},
		{
			key: 'en',
			value: i18n.t('language.english'),
		},
		{
			key: 'ja',
			value: i18n.t('language.japanese'),
		},
	];


    if (userData) {
        return <Redirect href={'/(home)'} />;
    }
    return (
        <View className="bg-white flex-1 h-[100%]">

            <View className="bg-white rounded-tl-[14px] rounded-[14px] px-4">
                <View className="mt-[50px] pb-3">
                    <SelectList isFixV2={true} arrowicon={<FontAwesome name="chevron-down" size={12} color={'black'} />}  defaultOption={{ key:language, value:i18n.t('language.changeLanguage') }} search={false} setSelected={(key) => {
                        handlerLanguage(key);
                    }} data={dataLanguage}/>
                </View>
                <KeyboardAvoidingView  behavior="padding" enabled>
                    <ScrollView >
                        <Slot />
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </View>
    )
}

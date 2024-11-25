import { useContext, useState } from "react";
import { Text, View, Button, TouchableOpacity, Modal } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import CardSetting from "@/components/customs/CardSetting";
import { useAppProvider } from "@/contexts/AppProvider";
import { SelectList } from "@10102004tan/react-native-select-dropdown-v2";
import { FontAwesome } from "@expo/vector-icons";
import { useQuizProvider } from "@/contexts/QuizProvider";

export default function SettingsScreen() {
   const [isOpenedModal, setIsOpenedModal] = useState(false);
   const { signOut } = useContext(AuthContext);
   const { setQuizzes } = useQuizProvider();
   const { handlerLanguage, language, i18n } = useAppProvider();

   const dataLanguage = [{
      key: 'vi', value: i18n.t('language.vietnamese')
   },
   {
      key: 'en', value: i18n.t('language.english')
   },
   {
      key: 'ja', value: i18n.t('language.japanese')
   }];
   return (
      <View className="px-2 mt-3 h-[100%]">
         <View>
            <CardSetting onPress={() => { setIsOpenedModal(true) }} title={i18n.t('language.changeLanguage')} description={i18n.t('language.edit')} isActice={true} />
         </View>
         <TouchableOpacity onPress={() => {
            signOut()
            setQuizzes([]);
         }}>
            <Text className="py-4 w-[100%] border shadow text-center">{i18n.t('logout.title')}</Text>
         </TouchableOpacity>

         <Modal animationType="slide" transparent={true} visible={isOpenedModal} >
            <TouchableOpacity onPress={() => setIsOpenedModal(false)}>
               <View className="w-[100%] h-[100%] bg-[#00000065]">
                  <View className="absolute bottom-0 py-3 bg-white w-[100%] px-3">
                     <SelectList isFixV2={true} arrowicon={<FontAwesome name="chevron-down" size={12} color={'black'} />} defaultOption={{ key: language, value: i18n.t('language.changeLanguage') }} search={false} setSelected={(key) => {
                        handlerLanguage(key);
                     }} data={dataLanguage} />
                  </View>
               </View>
            </TouchableOpacity>
         </Modal>
      </View>
   )
}

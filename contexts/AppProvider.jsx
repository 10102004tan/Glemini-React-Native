import React, {
   createContext,
   useContext,
   useEffect,
   useRef,
   useState,
} from 'react';
import { I18n } from 'i18n-js';
import en from '../languages/en.json';
import ja from '../languages/ja.json';
import vi from '../languages/vi.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
const AppContext = createContext();
import socket from '../utils/socket';

// Example about a context provider in React Native
const AppProvider = ({ children }) => {
   // Dùng cho việc chuyển đổi ngôn ngữ
   const [language, setLanguage] = useState("vi");
   const [notification, setNotification] = useState([]);
   const i18n = new I18n({
      en,
      ja,
      vi,
   });
   i18n.locale = language;
   // Dùng cho việc chuyển đổi chủ đề
   const [theme, setTheme] = useState({
      text: "#000",
      background: "#fff",
   });
   // Dùng cho việc ẩn hiện thanh điều hướng
   const [isHiddenNavigationBar, setIsHiddenNavigationBar] = useState(false);
   // Dùng cho việc cập nhật tiêu đề trang
   const [titleCurrent, setTitleCurrent] = useState("");

   useEffect(() => {
      // Lấy ngôn ngữ đã lưu trong bộ nhớ
      AsyncStorage.getItem("language").then(async (key) => {
         if (key) {
            setLanguage(key);
         }
      });
      // console.log("AppProvider");
   }, []);

   // Hàm xử lý chuyển đổi ngôn ngữ
   const handlerLanguage = async (key) => {
      await AsyncStorage.setItem("language", key);
      setLanguage(key);
   };

   //   biến dùng cho bottomsheet
   const [showBottomSheetMoreOptions, setShowBottomSheetMoreOptions] =
      useState(false);
   const [showBottomSheetSaveToLibrary, setShowBottomSheetSaveToLibrary] =
      useState(false);

   const openBottomSheetMoreOptions = () => {
      setShowBottomSheetMoreOptions(true);
   };
   const openBottomSheetSaveToLibrary = () => {
      setShowBottomSheetSaveToLibrary(true);
   };
   const closeBottomSheet = () => {
      setShowBottomSheetMoreOptions(false);
      setShowBottomSheetSaveToLibrary(false);
   };

   return (
      <AppContext.Provider
         value={{
            theme,
            setTheme,
            isHiddenNavigationBar,
            setIsHiddenNavigationBar,
            language,
            i18n,
            setLanguage,
            titleCurrent,
            setTitleCurrent,
            handlerLanguage,
            socket,
            openBottomSheetMoreOptions,
            openBottomSheetSaveToLibrary,
            closeBottomSheet,
            showBottomSheetMoreOptions,
            setShowBottomSheetMoreOptions,
            showBottomSheetSaveToLibrary,
            setShowBottomSheetSaveToLibrary,
            notification,
            setNotification,

         }}
      >
         {children}
      </AppContext.Provider>
   );
};

export default AppProvider;

export const useAppProvider = () => {
   return useContext(AppContext);
};

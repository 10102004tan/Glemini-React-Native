import React, { createContext, useContext, useRef, useState } from "react";
import { I18n } from "i18n-js";
import en from "../languages/en.json";
import ja from "../languages/ja.json";
import vi from "../languages/vi.json";
const AppContext = createContext();

// Example about a context provider in React Native
const AppProvider = ({ children }) => {
  const [apiUrl, setApiUrl] = useState("http://192.168.0.100:8000/api/v1");
  const [language, setLanguage] = useState("vi");
  const i18n = new I18n({
    en,
    ja,
    vi,
  });
  i18n.locale = language;
  const [theme, setTheme] = useState({
    // text: useColorScheme() === 'dark' ? '#fff' : '#000',
    // background: useColorScheme() === 'dark' ? '#000' : '#fff',
    text: "#000",
    background: "#fff",
  });

  const [isHiddenNavigationBar, setIsHiddenNavigationBar] = useState(false);
  const [titleCurrent, setTitleCurrent] = useState("");

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        isHiddenNavigationBar,
        setIsHiddenNavigationBar,
        apiUrl,
        language,
        i18n,
        setLanguage,
        titleCurrent,
        setTitleCurrent,
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

import {
   View,
   Text,
   TouchableOpacity,
   Animated,
   FlatList,
   Easing,
   Platform,
   UIManager,
   LayoutAnimation,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { Entypo } from '@expo/vector-icons';
import Field from './Field';
import { useAppProvider } from '@/contexts/AppProvider';

// Kích hoạt LayoutAnimation trên Android
if (
   Platform.OS === 'android' &&
   UIManager.setLayoutAnimationEnabledExperimental
) {
   UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DropDownMultipleSelect = ({
   data = [],
   selectedIds = [],
   onSelected = () => { },
   label = '',
   type = 'single',
}) => {
   const [displaySelected, setDisplaySelected] = useState('');
   const [visibleOptions, setVisibleOptions] = useState(false);
   const [search, setSearch] = useState('');
   const [filteredData, setFilteredData] = useState(data);
   const { i18n } = useAppProvider();
   // Animation state
   const animatedHeight = useRef(new Animated.Value(0)).current;

   useEffect(() => {
      const selected = data.filter((item) => selectedIds.includes(item.key));
      setDisplaySelected(selected.map((item) => i18n.t(`subjects.${item.value}`)).join(', '));
   }, [selectedIds]);

   // Hiệu ứng mở/đóng dropdown
   useEffect(() => {
      const toValue = visibleOptions ? 400 : 0; // Giá trị chiều cao cần chuyển đổi
      Animated.timing(animatedHeight, {
         toValue,
         duration: 400,
         easing: Easing.out(Easing.exp), // Easing
         useNativeDriver: false,
      }).start();
   }, [visibleOptions]);

   // Bật/tắt dropdown
   const toggleDropdown = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      if (visibleOptions) {
         setVisibleOptions(false);
      } else {
         setVisibleOptions(true);
      }
   };

   // Lọc dữ liệu theo từ khóa
   const handleSearch = (text) => {
      setSearch(text);
      const filtered = data.filter((item) =>
         item.value.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filtered);
   };

   return (
      <View className="px-4 py-3 rounded-xl border border-gray overflow-hidden">
         <View className="flex items-center justify-between flex-row">
            <TouchableOpacity onPress={toggleDropdown}>
               <Text className="max-w-[300px]">
                  {displaySelected !== '' ? displaySelected : label}
               </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleDropdown}>
               <Entypo
                  name={
                     visibleOptions
                        ? 'chevron-small-up'
                        : 'chevron-small-down'
                  }
                  size={20}
                  color="black"
               />
            </TouchableOpacity>
         </View>

         {visibleOptions && (
            <Animated.View style={[{ overflow: 'hidden' }]}>
               <Field
                  placeholder="Tìm kiếm lĩnh vực, môn học..."
                  value={search}
                  onChange={handleSearch}
                  wrapperStyles="my-4"
               />

               <FlatList
                  style={{ maxHeight: 300 }}
                  data={filteredData}
                  keyExtractor={(item) => item.key}
                  renderItem={({ item }) => (
                     <TouchableOpacity
                        onPress={() => onSelected(item.key)}
                     >
                        <View className="flex items-center justify-between flex-row mb-2">

                           <Text>{i18n.t(`subjects.${item.value}`)}</Text>

                           <Entypo
                              name={
                                 selectedIds.includes(item.key)
                                    ? 'check'
                                    : 'squared-plus'
                              }
                              size={16}
                              color={
                                 selectedIds.includes(item.key)
                                    ? 'green'
                                    : 'gray'
                              }
                           />
                        </View>
                     </TouchableOpacity>
                  )}
               />
            </Animated.View>
         )
         }
      </View >
   );
};

export default DropDownMultipleSelect;

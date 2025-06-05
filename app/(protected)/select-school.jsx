import MainLayout from '@/components/layouts/MainLayout';
import { useClassroomProvider } from '@/contexts/ClassroomProvider';
import { Feather } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { router, Stack } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';

const SelectSchool = () => {
  const [data, setData] = useState([]);
  const { fetchFilterSchool } = useClassroomProvider();
  const [searchKeyword, setSearchKeyword] = useState('');
  useEffect(() => {
    fetchFilterSchool({ keyword: '' })
      .then((res) => {
        if (res) {
          setData(res);
        } else {
          setData([]);
        }
      })
      .catch((error) => {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: 'Có lỗi xảy ra khi tải dữ liệu trường học',
          position: 'bottom',
          visibilityTime: 3000,
          autoHide: true,
        });
        setData([]);
      });
  }, []);

  const renderItem = useCallback(({ item }) => {
    return (
      <Pressable
        onPress={() => handleSelectSchool(item)}
        style={{
          paddingHorizontal: 10,
          paddingVertical: 15,
          borderBottomColor: '#eee',
          borderBottomWidth: 1,
        }}
      >
        <Text>{item.school_name.replace('- ', '').trim()}</Text>
      </Pressable>
    );
  });

  const handleSearch = useCallback(() => {
    fetchFilterSchool({ keyword: searchKeyword })
      .then((res) => {
        if (res) {
          setData(res);
        } else {
          setData([]);
        }
      })
      .catch((error) => {
        console.log('error', error);
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: 'Có lỗi xảy ra khi tìm kiếm trường học',
          position: 'bottom',
          visibilityTime: 3000,
          autoHide: true,
        });
        setData([]);
      });
  }, []);

  const handleSelectSchool = useCallback((school) => {
    router.canGoBack() && router.back();

    router.setParams({
      schoolId: school._id,
      schoolName: school.school_name,
    });
  }, []);

  const ListHeaderComponent = useCallback(() => {
    return (
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          marginBottom: 20,
          borderRadius: 30,
          borderWidth: 1,
          borderColor: '#ddd',
          paddingHorizontal: 10,
        }}
      >
        <Feather name="search" size={24} color="black" />
        <TextInput
          // value={searchKeyword}
          onChangeText={setSearchKeyword}
          keyboardType="default"
          onBlur={handleSearch}
          onSubmitEditing={handleSearch}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Tìm kiếm trường học. vd:THPT Nguyễn Huệ .."
          style={{
            height: 50,
            width: 300,
            paddingHorizontal: 10,
            backgroundColor: '#fff',
          }}
        />
      </View>
    );
  }, [searchKeyword, handleSearch]);
  return (
    <MainLayout>
      <Stack.Screen
        options={{
          headerTitle: 'Chọn trường học',
        }}
      />
      <FlashList
        data={data}
        renderItem={renderItem}
        estimatedItemSize={50}
        ListHeaderComponent={ListHeaderComponent}
      />
    </MainLayout>
  );
};
export default SelectSchool;

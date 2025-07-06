import { Button, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import MainLayout from '../layouts/MainLayout';
import { AntDesign } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import api from '@/libs/axios';
import { FlatList } from 'react-native-gesture-handler';
import CollectionItem from './CollectionItem';
import { FlashList } from '@shopify/flash-list';
import { useAuthStore } from '@/store/useAuthStore';
import { router } from 'expo-router';

const MyCollection = () => {
  const { user } = useAuthStore();
  //   const [collections, setCollections] = useState([]);
  //   const createCollection = async () => {
  //     let check = false;
  //     if (collections.length > 0) {
  //       collections.forEach((item) => {
  //         if (item.collection_name === nameCollection) {
  //           check = true;
  //           return;
  //         }
  //       });
  //     }

  //     if (check === false) {
  //       const body = {
  //         collection_name: nameCollection,
  //         user_id: user.user_id,
  //       };
  //       const path = `${API_VERSION.V1}${END_POINTS.COLLECTION_CREATE}`;
  //       const response = await api.post(path, body);
  //       const data = response.data;

  //       console.log(data);
  //       if (data.statusCode === 200) {
  //         console.log('Tạo thành công', data.metadata);
  //         setCollections([...collections, data.metadata]);
  //       } else {
  //         if (data.statusCode === 401 && data.message === 'expired') {
  //           console.log('Token expired, please login again.');
  //         }
  //       }
  //     } else {
  //       alert('Đã tồn tại tên !!!');
  //     }
  //   };

  const getAllCollections = async () => {
    const body = {
      user_id: user.user_id,
    };
    const path = `${API_VERSION.V1}${END_POINTS.COLLECTION_GETALL}`;
    const response = await api.post(path, body);
    const data = response.data;
    if (data.statusCode === 200) {
      setCollections(data.metadata);
    } else {
      if (data.statusCode === 401 && data.message === 'expired') {
        // processAccessTokenExpired();
        console.log('Token expired, please login again.');
      }
    }
  };

  useEffect(() => {
    getAllCollections();
  }, []);
  const collections = [
    {
      _id: '1',
      collection_name: 'Toán lớp 10',
    },
    {
      _id: '2',
      collection_name: 'Văn học Việt Nam',
    },
    {
      _id: '3',
      collection_name: 'Lịch sử thế giới',
    },
  ];
  return (
    <MainLayout>
      <View className="p-3">
        <Button
          icon={<AntDesign name="plus" size={16} color="white" />}
          //   onPress={OpenBottomSheet}
          title="Tạo mới"
          otherStyles={'w-1/2 justify-center p-4'}
          textStyles={'text-center text-white'}
        />
        <FlatList
          data={collections}
          onEndReachedThreshold={0.1}
          numColumns={1}
          renderItem={({ item }) => (
            <CollectionItem
              name={item.collection_name}
              count={item.quizzes ? item.quizzes.length : 0}
              onPress={() => {
                router.push({
                  pathname: '/(protected)/collection/[id]',
                  params: { id: item._id, collectionName: item.collection_name },
                });
              }}
            />
          )}
        />
      </View>
    </MainLayout>
  );
};

export default MyCollection;

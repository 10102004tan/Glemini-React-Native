import { View, Text, ScrollView, Image, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import Wrapper from '@/components/customs/Wrapper';
import { useAuthStore } from '@/store/useAuthStore';
import Toast from 'react-native-toast-message-custom';
import { API_VERSION, END_POINTS } from '@/configs/api.config';
import api from '@/libs/axios';
import Field from '@/components/customs/Field';
import RoomItem from '@/components/customs/RoomItem';
import { useAppProvider } from '@/contexts/AppProvider';

const ListRoomScreen = () => {
  const { user } = useAuthStore();
  const [rooms, setRooms] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(1);
  const LIMIT = 10;
  const [roomSearch, setRoomSearch] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const { i18n } = useAppProvider();

  const fetchRoomSearch = async () => {
    try {
      setIsFetching(true);
      setRoomSearch([]);
      const response = await api.post(`${API_VERSION.V1}${END_POINTS.ROOM_CODE}`, {
        room_code: roomCode,
      });

      const data = response.data;
      if (data.statusCode === 200) {
        setRoomSearch(data.metadata);
      }
    } catch (error) {
      console.log(error);
      setRoomSearch([]);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (roomCode) {
      // Debounce search
      const handler = setTimeout(() => {
        fetchRoomSearch();
      }, 500);

      return () => {
        clearTimeout(handler);
      };
    }
  }, [roomCode]);

  const fetchRecentCreatedRooms = async () => {
    if (isFetching) {
      return;
    }

    try {
      setIsFetching(true);
      const response = await api.post(`${API_VERSION.V1}${END_POINTS.ROOM_LIST}`, {
        user_created_id: user.user_id,
        page: page,
        limit: LIMIT,
      });
      const data = response.data;
      if (data.statusCode === 200) {
        if (data.metadata.length > 0) {
          if (page === 1) {
            setRooms(data.metadata);
          } else {
            setRooms([...rooms, ...data.metadata]);
          }
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi khi lấy danh sách phòng chơi, vui lòng thử lại sau ít phút',
          visibilityTime: 1000,
          autoHide: true,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
      // console.log(rooms.length)
    }
  };

  useEffect(() => {
    if (user) {
      fetchRecentCreatedRooms(1);
    }
  }, [user]);

  const renderFooter = () => {
    if (!isFetching) return null;
    return (
      <View style={{ padding: 10, alignItems: 'center' }}>
        <ActivityIndicator size="small" color="#000" />
      </View>
    );
  };

  return (
    <Wrapper>
      <View className="p-4">
        {/* <Text className="text-center text-lg font-semibold">Danh sách phòng chơi</Text> */}
        <Field
          placeholder={i18n.t('room_item.findRoomLabel')}
          wrapperStyles="mb-4"
          value={roomCode}
          onChange={(text) => {
            setRoomCode(text);
          }}
        />
        {roomCode !== '' ? (
          <>
            {roomSearch.length > 0 ? (
              <>
                <FlatList
                  style={{ marginBottom: 60 }}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  data={roomSearch}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => <RoomItem key={item._id} room={item} />}
                  // columnWrapperStyle={{ justifyContent: 'space-between' }}
                  columnWrapperStyle={{
                    justifyContent: 'space-between',
                    rowGap: 4,
                    columnGap: 8,
                  }}
                  numColumns={2}
                  ListFooterComponent={renderFooter}
                />
              </>
            ) : (
              <>
                {isFetching ? (
                  <Text className="text-center text-blue-500">{i18n.t('room_item.searching')}</Text>
                ) : (
                  <Text className="text-center text-red-500">{i18n.t('room_item.emptyList')}</Text>
                )}
              </>
            )}
          </>
        ) : (
          <>
            {rooms.length > 0 ? (
              <>
                <FlatList
                  onEndReachedThreshold={0.1}
                  onEndReached={() => {
                    setPage(page + 1);
                    fetchRecentCreatedRooms();
                  }}
                  style={{ marginBottom: 60 }}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  data={rooms}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => <RoomItem key={item._id} room={item} />}
                  // columnWrapperStyle={{ justifyContent: 'space-between' }}
                  columnWrapperStyle={{
                    justifyContent: 'space-between',
                    rowGap: 4,
                    columnGap: 8,
                  }}
                  numColumns={2}
                  list
                />
              </>
            ) : (
              <>
                <Text className="text-center text-red-500">{i18n.t('room_item.emptyList')}</Text>
              </>
            )}
          </>
        )}
      </View>
    </Wrapper>
  );
};

export default ListRoomScreen;

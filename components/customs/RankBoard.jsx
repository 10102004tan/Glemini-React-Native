import { useAppProvider } from '@/contexts/AppProvider';
import React, { useEffect, useState } from 'react';
import { View, Text, Animated, Image, StyleSheet, ScrollView } from 'react-native';

const RankBoard = ({ users = [], visible = false, currentUser = {}, createdUser = '' }) => {
   const [opacity] = useState(new Animated.Value(0)); // Điều chỉnh độ mờ
   const [translateY] = useState(new Animated.Value(20)); // Điều chỉnh vị trí Y (có thể dịch chuyển từ dưới lên)
   const { i18n } = useAppProvider();
   useEffect(() => {
      if (visible) {
         // Khi `visible` là true, hiệu ứng xuất hiện từ dưới lên với độ mờ dần
         Animated.parallel([
            Animated.timing(opacity, {
               toValue: 1, // Độ mờ full (hiển thị)
               duration: 500,
               useNativeDriver: true,
            }),
            Animated.timing(translateY, {
               toValue: 0, // Vị trí dịch chuyển về 0 (trở về vị trí ban đầu)
               duration: 500,
               useNativeDriver: true,
            }),
         ]).start();
      } else {
         // Khi `visible` là false, làm bảng xếp hạng mờ đi và dịch chuyển xuống dưới
         Animated.parallel([
            Animated.timing(opacity, {
               toValue: 0, // Độ mờ giảm xuống
               duration: 500,
               useNativeDriver: true,
            }),
            Animated.timing(translateY, {
               toValue: 20, // Dịch chuyển xuống dưới khi ẩn
               duration: 500,
               useNativeDriver: true,
            }),
         ]).start();
      }
   }, [visible]); // Chạy lại mỗi khi `visible` thay đổi

   return (
      <Animated.View
         style={{
            opacity,
            transform: [{ translateY }],
            position: 'absolute',
            minHeight: 300,
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 8,
            zIndex: visible ? 100 : -1, // Đặt z-index để ẩn hoặc hiện bảng xếp hạng
         }}
         className="top-[20%] left-[14px] right-[14px] bg-white"
      >
         <Text className="p-4 bg-green-500 text-white mb-5 rounded-2xl">{i18n.t('room_wait_result.rankboard')}</Text>
         <ScrollView className="max-h-[400px]" showsVerticalScrollIndicator={false}>
            {users.rank && users.rank.length > 0 &&
               users.rank.map((rank, index) => {
                  if (rank.user_id._id !== createdUser) {
                     return <View
                        style={styles.rankItem}
                        key={index}
                        className={`${currentUser && currentUser._id === rank.user_id._id && 'bg-green-200'} p-2 rounded-2xl`}
                     >
                        <Image source={{ uri: rank.user_id.user_avatar }} style={styles.avatar} />
                        <View style={styles.rankTextContainer}>
                           <Text style={styles.rankText}>{rank.user_id.user_fullname}</Text>
                           <Text style={styles.scoreText}>{rank.userScore} {i18n.t('play.single.score')}</Text>
                        </View>
                     </View>
                  }
               })}
         </ScrollView>
      </Animated.View>
   );
};

// Styles cho bảng xếp hạng
const styles = StyleSheet.create({
   rankItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
   },
   avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
      borderWidth: 2,
      borderColor: '#4CAF50',
   },
   rankTextContainer: {
      flex: 1,
   },
   rankText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
   },
   scoreText: {
      fontSize: 14,
      color: '#4CAF50',
   },
});

export default RankBoard;

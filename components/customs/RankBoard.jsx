import { useAppProvider } from '@/contexts/AppProvider';
import React, { useEffect, useState } from 'react';
import { View, Text, Animated, Image, StyleSheet, ScrollView, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';

const RankBoard = ({ users = [], visible = false, currentUser = {}, createdUser = '', onClose }) => {
  const [opacity] = useState(new Animated.Value(0));
  const [translateY] = useState(new Animated.Value(20));
  const { i18n } = useAppProvider();

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 20,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const sortedUsers = users
    .filter(user => user.user_id && user.user_id._id !== createdUser)
    .sort((a, b) => (b.userScore || 0) - (a.userScore || 0));

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [{ translateY }],
          zIndex: visible ? 100 : -1,
        },
      ]}
    >
      {/* Header */}
      <Text style={styles.title}>{i18n.t('room_wait_result.rankboard')}</Text>

      {/* Ranking List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {sortedUsers.length > 0 ? (
          sortedUsers.map((rank, index) => {
            const isCurrentUser = currentUser && currentUser.user_id === rank.user_id._id;
            const userName = rank.user_id.user_fullname || rank.user_id.fullname || 'Unknown User';
            const userAvatar = rank.user_id.user_avatar || 'https://ui-avatars.com/api/?name=User&size=128';
            const userScore = rank.userScore || rank.score || 0;

            return (
              <View
                key={index}
                style={[
                  styles.rankItem,
                  isCurrentUser && styles.currentUserRank,
                ]}
              >
                {/* Rank Position */}
                <View style={styles.rankPosition}>
                  <Text style={styles.rankNumber}>{index + 1}</Text>
                  {index === 0 && <Icon2 name="trophy" size={20} color="#facc15" />}
                  {index === 1 && <Icon2 name="trophy" size={20} color="#c0c0c0" />}
                  {index === 2 && <Icon2 name="trophy" size={20} color="#cd7f32" />}
                </View>

                {/* User Info */}
                <View style={styles.userInfo}>
                  <Image source={{ uri: userAvatar }} style={styles.avatar} />
                  <View style={styles.userDetails}>
                    <Text style={styles.userName}>{userName}</Text>
                    <Text style={styles.userDesc}>
                      <Icon name="star" size={14} color="#facc15" /> {userScore} điểm
                    </Text>
                  </View>
                </View>

                {/* Score */}
                <View style={styles.scoreContainer}>
                  <Text style={styles.scoreText}>{userScore}</Text>
                  <Text style={styles.scoreLabel}>điểm</Text>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Icon2 name="trophy-outline" size={48} color="#64748b" />
            <Text style={styles.emptyText}>Chưa có dữ liệu xếp hạng</Text>
            <Text style={styles.emptySubtext}>
              Bảng xếp hạng sẽ hiển thị sau khi có người chơi trả lời câu hỏi
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Close Button */}
      <View style={styles.closeButton}>
        <Pressable
          onPress={onClose}
          style={styles.closeButtonInner}
        >
          <Text style={styles.closeButtonText}>Đóng</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '15%',
    left: 20,
    right: 20,
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 20,
    maxHeight: '70%',
    borderWidth: 2,
    borderColor: '#38bdf8',
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 22,
    color: '#38bdf8',
    fontWeight: '800',
    marginBottom: 16,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    marginBottom: 16,
  },
  rankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  currentUserRank: {
    borderColor: '#38bdf8',
    borderWidth: 2,
    backgroundColor: '#1e3a8a',
  },
  rankPosition: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 2,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#38bdf8',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  userDesc: {
    color: '#94a3b8',
    fontSize: 12,
  },
  scoreContainer: {
    alignItems: 'center',
    marginLeft: 12,
  },
  scoreText: {
    color: '#facc15',
    fontSize: 18,
    fontWeight: '800',
  },
  scoreLabel: {
    color: '#94a3b8',
    fontSize: 10,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#64748b',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  closeButton: {
    marginTop: 8,
  },
  closeButtonInner: {
    backgroundColor: '#38bdf8',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: '#0ea5e9',
    alignItems: 'center',
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});

export default RankBoard;

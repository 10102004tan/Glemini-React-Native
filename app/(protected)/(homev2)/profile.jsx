import MainLayout from '@/components/layouts/MainLayout';
import { useAuthStore } from '@/store/useAuthStore';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

const Profile = () => {
  const { user } = useAuthStore();
  return (
    <MainLayout>
      {/* header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Link href={{ pathname: '/(protected)/settings' }} style={styles.headerSettingsLink}>
          <Ionicons name="settings" size={20} color="#AFAFAF" />
        </Link>
      </View>

      {/* wrapper profile */}
      <View style={styles.profileWrapper}>
        {/* info */}
        <View>
          <Text style={styles.profileName}>{user.fullname || user.fullname || 'User Name'}</Text>
          <Text style={styles.profileEmail}>{user.email || ''}</Text>
          <View style={styles.profileJoinedRow}>
            <AntDesign name="clockcircleo" size={16} color="#999" />
            <Text style={styles.profileJoinedText}>
              Joined:{' '}
              {new Date().toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
        </View>
        <View style={styles.profileAvatarWrapper}>
          <Image
            source={{ uri: user.user_avatar || 'https://i.imgur.com/1z5Z5zF.png' }}
            style={styles.profileAvatar}
            resizeMode="cover"
          />
          <Pressable
            style={styles.profileEditBtn}
            onPress={() => {
              router.push('/(protected)/account');
            }}
          >
            <Feather name="edit-2" size={16} color="#fff" />
          </Pressable>
          <View
          style={{
            position: 'absolute',
            bottom: -10,
            left: "50%",
            transform: [{ translateX: -50 }],
            backgroundColor: '#1cb0f6',
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 10,
            borderWidth: 3,
            borderColor: '#fff',
          }}
          >
          <Text
          style={{
            color: '#fff',
            fontSize: 10,
            fontWeight: 'bold',
            textAlign: 'center',
            textTransform: 'uppercase',
          }}
          >
            {
              user.user_role === 'teacher'
                ? 'Teacher'
                : 'Student'
            }
          </Text>
          </View>
        </View>
      </View>

      {/* section */}
      <View style={styles.sectionWrapper}>
        {/* title */}
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        {/* list */}
        <View style={styles.sectionList}></View>
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#AFAFAF',
  },
  headerSettingsLink: {
    marginRight: 10,
  },
  profileWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 20,
    borderBottomColor: '#ddd',
    borderBottomWidth: 2,
    marginBottom: 20,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  profileJoinedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  profileJoinedText: {
    fontSize: 14,
    color: '#999',
  },
  profileAvatarWrapper: {
    position: 'relative',
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginTop: 20,
  },
  profileEditBtn: {
    position: 'absolute',
    top: 20,
    right: 0,
    backgroundColor: '#1cb0f6',
    borderRadius: 50,
    padding: 6,
    borderWidth: 3,
    borderColor: '#fff',
  },
  sectionWrapper: {
    paddingBottom: 20,
    borderBottomColor: '#ddd',
    borderBottomWidth: 2,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionList: {
    height: 400,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderStyle: 'solid',
  },
});

export default Profile;

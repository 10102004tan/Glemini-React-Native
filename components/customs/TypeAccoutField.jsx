import { useAuthStore } from '@/store/useAuthStore';
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

const TypeAccountField = ({ value, ...props }) => {
  const { user } = useAuthStore();
  return (
    <View style={styles.row}>
      <Text style={styles.label}>Kiểu tài khoản</Text>
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 10,
          borderWidth: 2,
          borderColor: '#ddd',
          flex: 1,
        }}
      >
        {user.user_role === 'teacher' ||
        ['pending', 'active'].includes(user.status_teacher_verified) ? (
          <View>
            {user.status_teacher_verified === 'active' ? (
              <View>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111827' }}>
                  Giáo viên
                </Text>
                <Text style={{ fontSize: 14, color: '#4ade80', fontWeight: 'bold' }}>
                  Đã xác thực
                </Text>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                  flexWrap: 'wrap',
                }}
              >
                <View>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111827' }}>
                    Giáo viên
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 8,
                    color: '#fff',
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 10,
                    backgroundColor: '#f59e0b',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                  }}
                >
                  Đang đợi duyệt
                </Text>
                <Link href={'/(protected)/(teacher)/verify'}>
                  <Text style={{ fontSize: 14, color: '#1cb0f6', fontWeight: 'bold' }}>
                    Xem chi tiết
                  </Text>
                </Link>
              </View>
            )}
          </View>
        ) : (
          <View>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111827' }}>Học sinh</Text>
            <Link href={'/(protected)/(teacher)/plan.intro'}>
              <Text style={{ fontSize: 14, color: '#1cb0f6', fontWeight: 'bold' }}>
                Nâng cấp lên giáo viên
              </Text>
            </Link>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
    width: 100,
    flexWrap: 'wrap',
  },
});

export default TypeAccountField;

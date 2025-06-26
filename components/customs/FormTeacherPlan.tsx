import api from '@/libs/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import FieldRow from './FieldRow';
import UploadField from './UploadField';

const FormTeacherPlan = () => {
  const { user } = useAuthStore();
  const verifyTeacherHandler = async () => {
    try {
      const body = {};
      const response = await api.post('/v2/auth/teacher/create', body);
      const data = response.data;
      if (data) {
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: 'Yêu cầu xác thực đã được gửi thành công.',
        });

        // set user to verified
        useAuthStore.setState({
          user: {
            ...user,
            status_teacher_verified: 'pending',
          },
        });
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 400) {
          Toast.show({
            type: 'error',
            text1: 'Lỗi',
            text2: error.response.data.message || 'Vui lòng kiểm tra lại thông tin.',
          });
        } else if (error.response.status === 401) {
          Toast.show({
            type: 'error',
            text1: 'Lỗi',
            text2: 'Bạn không có quyền truy cập vào chức năng này.',
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Lỗi',
            text2: 'Đã có lỗi xảy ra, vui lòng thử lại sau.',
          });
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: 'Đã có lỗi xảy ra, vui lòng thử lại sau.',
        });
      }
    }
  };
  return (
    <View>
      {/* seaction */}
      <View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionNumber}>1</Text>
          <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
        </View>
        <View>
          <FieldRow
            placeholder="vd: Nguyễn Văn A"
            label="Họ và tên"
            value={user?.name || ''}
            editable={false}
          />
          <FieldRow
            placeholder="vd: giaovien@tdc.edu.vn"
            label="Email"
            value={user?.phone || ''}
            editable={false}
          />
          <FieldRow
            placeholder="vd: 0501234567"
            label="CCCD/CMND"
            value={user?.phone || ''}
            editable={false}
          />
        </View>
      </View>

      <View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionNumber}>2</Text>
          <Text style={styles.sectionTitle}>Giấy tờ yêu cầu</Text>
        </View>
        <View>
          <UploadField label="CCCD/CMND" />
          <UploadField label="Giấy xác nhận giảng dạy" />
          <UploadField label="Ảnh thẻ" />
        </View>
      </View>
      <Pressable onPress={verifyTeacherHandler} style={styles.submitBtn}>
        <Text style={styles.submitBtnText}>Gửi yêu cầu xác thực</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    marginBottom: 20,
    flexDirection: 'row',
  },
  sectionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    width: 40,
    height: 40,
    textAlign: 'center',
    lineHeight: 40,
    backgroundColor: '#58CC02',
    color: '#fff',
    borderRadius: 5,
    borderBottomWidth: 4,
    borderWidth: 2,
    borderColor: '#eee',
    borderLeftWidth: 2,
    borderRightWidth: 2,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#58CC02',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderBottomColor: '#58CC02',
    borderBottomWidth: 1,
    flex: 1,
    paddingTop: 5,
  },
  submitBtn: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
    borderBottomWidth: 4,
    shadowColor: '#000',
    borderTopWidth: 1,
    borderColor: '#58CC02',
    borderLeftWidth: 1,
    borderRightWidth: 4,
  },
  submitBtnText: {
    color: '#58CC02',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});

export default FormTeacherPlan;

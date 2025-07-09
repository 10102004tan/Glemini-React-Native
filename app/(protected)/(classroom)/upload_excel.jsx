import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { API_URL, API_VERSION, END_POINTS } from '@/configs/api.config';
import { useAuthContext } from '@/contexts/AuthContext';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import Button from '@/components/customs/Button';
import LottieView from 'lottie-react-native';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import Toast from 'react-native-toast-message-custom';
import { useAppProvider } from '@/contexts/AppProvider';
import api from '@/libs/axios';

const UploadExcelScreen = () => {
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isTemplateExist, setIsTemplateExist] = useState(false);
  const { userData, processAccessTokenExpired } = useAuthContext();
  const router = useRouter();
  const { i18n } = useAppProvider();
  const { classroomId } = useGlobalSearchParams();
  const templateFileUri = `${FileSystem.documentDirectory}template_excel.xlsx`;

  useEffect(() => {
    const checkTemplateExistence = async () => {
      const fileInfo = await FileSystem.getInfoAsync(templateFileUri);
      setIsTemplateExist(fileInfo.exists);
    };

    checkTemplateExistence();
  }, []);

  const pickExcelDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];

        const { mimeType, name, size, uri } = file;

        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
        if (size > MAX_FILE_SIZE) {
          setUploadStatus('Dung lượng tệp vượt quá giới hạn 5MB.');
          return;
        }

        const allowedMimeTypes = [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
          'application/vnd.ms-excel', // .xls
        ];

        if (allowedMimeTypes.includes(mimeType)) {
          uploadFile(file);
        } else {
          setUploadStatus('Chỉ chấp nhận các tệp Excel (.xls, .xlsx).');
          Toast.show({
            type: 'warn',
            text1: 'Cảnh báo',
            text2: `${uploadStatus}`,
          });
        }
      } else {
        setUploadStatus('Quá trình chọn tệp đã bị hủy.');
      }
    } catch (error) {
      await processAccessTokenExpired();
      setUploadStatus('Đã xảy ra lỗi khi chọn tệp.');
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Đã xảy ra lỗi khi tải lên tệp.',
      });
    }
  };

  const handleUploadSuccess = () => {
    router.back({ refresh: true });
  };

  const uploadFile = async (file) => {
    if (!file || !file.uri || !file.name || !file.mimeType) {
      setUploadStatus('Định dạng tệp không hợp lệ.');
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Định dạng tệp không hợp lệ.',
      });
      return;
    }

    try {
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');

      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: cleanFileName,
        type: file.mimeType,
      });
      formData.append('classroomId', classroomId);

      console.log(formData);
      
      // Gửi yêu cầu POST
      const response = await api.post(`${API_VERSION.V1}${END_POINTS.CLASSROOM_UPLOAD}`, formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const data = await response.data;
      if (data.statusCode === 200) {
        setUploadStatus(data.message);
        handleUploadSuccess();
        Toast.show({
          type: 'success',
          text1: i18n.t('classroom.upload.success'),
          text2: i18n.t('classroom.upload.uploadSuccess'),
        });
      } else {
        Toast.show({
          type: 'error',
          text1: i18n.t('classroom.upload.fail'),
          text2: data.message || i18n.t('classroom.upload.uploadError'),
        });
      }
    } catch (error) {
      setUploadStatus('Tải lên tệp thất bại.');
      Toast.show({
        type: 'error',
        text1: i18n.t('classroom.upload.fail'),
        text2: i18n.t('classroom.upload.notiError'),
      });
    }
  };

 const downloadAndOpenFile = async () => {
  const fileUrl = `${API_URL}${API_VERSION.V1}${END_POINTS.CLASSROOM_GET_EXCEL_TEMPLATE}`;
  const fileName = 'template_excel.xlsx';
  const fileUri = `${FileSystem.documentDirectory}${fileName}`;

  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.exists) {
      Toast.show({
        type: 'info',
        text1: i18n.t('classroom.upload.notification'),
        text2: i18n.t('classroom.upload.existFile'),
      });
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      return;
    }

    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({
        type: 'error',
        text1: i18n.t('classroom.upload.permissionFile'),
        text2: i18n.t('classroom.upload.permissionMedia'),
      });
      return;
    }

    const res = await api.get(fileUrl, {
      responseType: 'blob',
    });

    const blob = res.data;

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64 = reader.result.split(',')[1];

      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setIsTemplateExist(true);

      Toast.show({
        type: 'success',
        text1: i18n.t('classroom.upload.success'),
        text2: i18n.t('classroom.upload.downloadFileExcel'),
      });

      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
    };

    reader.readAsDataURL(blob); // chuyển blob → base64
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Lỗi tải xuống',
      text2: `${error.message}`,
    });
  }
};



  const deleteFile = async (fileUri) => {
    try {
      await FileSystem.deleteAsync(fileUri, { idempotent: true });
      setIsTemplateExist(false); // Update template existence state
      Toast.show({
        type: 'success',
        text1: i18n.t('classroom.upload.success'),
        text2: i18n.t('classroom.upload.deletedFiledExcel'),
      });
    } catch (error) {
      Toast.show({
        type: 'warn',
        text1: i18n.t('classroom.upload.fail'),
        text2: `${i18n.t('classroom.upload.errorDelFileExcel')} ${error.message}`,
      });
    }
  };

  const clearTemplatedDownload = async () => {
    await deleteFile(templateFileUri);
  };

  return (
    <View style={styles.container}>
  <ScrollView contentContainerStyle={styles.scrollContent}>
    <View style={styles.wrapper}>
      {/* Upload Box */}
      <View style={styles.uploadBox}>
        <TouchableOpacity onPress={pickExcelDocument}>
          <LottieView
            source={require('@/assets/jsons/clound-upload.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={pickExcelDocument}>
          <Text style={styles.uploadText}>
            {i18n.t('classroom.upload.textAddFile')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Download template section */}
      <View style={styles.downloadSection}>
        <Text style={styles.sectionTitle}>
          {i18n.t('classroom.upload.textDownloadFileExcel')}
        </Text>
        <View style={styles.buttonRow}>
          <Button
            onPress={() => !isTemplateExist && downloadAndOpenFile()}
            otherStyles={`p-3 bg-green-500 border border-b-2 border-green-600 ${isTemplateExist ? 'opacity-50' : ''}`}
            text={i18n.t('classroom.upload.textFieldDownloadFileExcel')}
            icon={<SimpleLineIcons name="docs" size={18} color="white" />}
            disabled={isTemplateExist}
          />
          <Button
            onPress={() => isTemplateExist && clearTemplatedDownload()}
            otherStyles={`p-3 ml-2 bg-orange-500 border border-b-2 border-orange-600 ${!isTemplateExist ? 'opacity-50' : ''}`}
            text={i18n.t('classroom.upload.textFieldDelFileExcel')}
            icon={<SimpleLineIcons name="trash" size={18} color="white" />}
            disabled={!isTemplateExist}
          />
        </View>

        {/* Table */}
        <View style={styles.templateBox}>
          <Text style={styles.templateTitle}>
            {i18n.t('classroom.upload.guildText')}
          </Text>

          {/* Table Header */}
          <View style={styles.tableRowHeader}>
            <Text style={styles.cellHeader}>full_name</Text>
            <Text style={styles.cellHeader}>email</Text>
          </View>

          {/* Example Rows */}
          <View style={styles.tableRow}>
            <Text style={styles.cell}>Nguyen Van A</Text>
            <Text style={styles.cell}>vana@gmail.com</Text>
          </View>
          <View style={[styles.tableRow, styles.rowAlt]}>
            <Text style={styles.cell}>Nguyen Van B</Text>
            <Text style={styles.cell}>vanb@gmail.com</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.cell}>Nguyen Van C</Text>
            <Text style={styles.cell}>vanc@gmail.com</Text>
          </View>

          <Text style={styles.footerNote}>
            {i18n.t('classroom.upload.guildRule')}
          </Text>
        </View>
      </View>
    </View>
  </ScrollView>
</View>


  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#FDFCFB',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadBox: {
    width: '100%',
    padding: 16,
    borderWidth: 2,
    borderColor: '#FFD93D',
    borderStyle: 'dashed',
    borderRadius: 16,
    backgroundColor: '#FFFDEB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: 200,
    height: 120,
  },
  uploadText: {
    fontWeight: '600',
    color: '#333',
    fontSize: 16,
    marginTop: 4,
  },
  downloadSection: {
    marginTop: 24,
    width: '100%',
  },
  sectionTitle: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#333',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  templateBox: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#FFF9D6',
    borderRadius: 16,
    borderWidth: 1,
    borderBottomWidth: 2,
    borderColor: '#FFD93D',
  },
  templateTitle: {
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 12,
    color: '#333',
  },
  tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: '#FFE66D',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 1,
    borderColor: '#FACC15',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#FDE047',
  },
  rowAlt: {
    backgroundColor: '#FFFBE6',
  },
  cellHeader: {
    flex: 1,
    fontWeight: 'bold',
    padding: 12,
    textAlign: 'center',
    color: '#333',
    borderRightWidth: 1,
    borderColor: '#FACC15',
  },
  cell: {
    flex: 1,
    padding: 12,
    textAlign: 'center',
    color: '#333',
    borderRightWidth: 1,
    borderColor: '#FDE047',
  },
  footerNote: {
    marginTop: 16,
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
});


export default UploadExcelScreen;

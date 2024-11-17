import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
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

const UploadExcelScreen = () => {
    const [uploadStatus, setUploadStatus] = useState(null);
    const [isTemplateExist, setIsTemplateExist] = useState(false);
    const { userData, processAccessTokenExpired } = useAuthContext();
    const router = useRouter();
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
            const path = `${API_URL}${API_VERSION.V1}${END_POINTS.CLASSROOM_UPLOAD}`;

            const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');

            const formData = new FormData();
            formData.append('file', {
                uri: file.uri,
                name: cleanFileName,
                type: file.mimeType,
            });
            formData.append('classroomId', classroomId);

            // Gửi yêu cầu POST
            const response = await fetch(path, {
                method: 'POST',
                body: formData,
                headers: {
                    'x-client-id': userData._id,
                    Authorization: userData.accessToken,
                    'Content-Type': 'multipart/form-data',
                },
            });

            const data = await response.json();
            if (data.statusCode === 200) {
                setUploadStatus(data.message);
                handleUploadSuccess();
                Toast.show({
                    type: 'success',
                    text1: 'Thành công',
                    text2: 'Tệp đã được tải lên thành công.',
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi',
                    text2: data.message || 'Tải lên tệp thất bại.',
                });
            }
        } catch (error) {
            setUploadStatus('Tải lên tệp thất bại.');
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Đã xảy ra lỗi trong quá trình tải lên tệp.',
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
                    text1: 'Thông báo',
                    text2: 'File đã tồn tại!',
                });
                await Sharing.shareAsync(fileUri, {
                    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });
                return;
            }
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Toast.show({
                    type: 'error',
                    text1: 'Quyền truy cập thất bại',
                    text2: 'Không thể truy cập Thư viện!',
                });
                return;
            }
            const downloadResult = await FileSystem.downloadAsync(fileUrl, fileUri);
            if (!downloadResult || !downloadResult.uri) {
                throw new Error('Failed to download file');
            }
            console.log('File downloaded to:', downloadResult.uri);
            const save = await Sharing.shareAsync(downloadResult.uri, { mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            if (save) {
                Sharing.openFile(downloadResult.uri);
            }
            setIsTemplateExist(true);
            Toast.show({
                type: 'success',
                text1: 'Thành công',
                text2: 'Tải tệp mẫu Excel thành công.',
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Permission Denied',
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
                text1: 'Thành công',
                text2: 'Xóa tệp mẫu Excel thành công.',
            });
        } catch (error) {
            Toast.show({
                type: 'warn',
                text1: 'Lỗi',
                text2: `Lỗi xóa file tệp: ${error.message}`,
            });
        }
    };

    const clearTemplatedDownload = async () => {
        await deleteFile(templateFileUri);
    };

    return (
        <View className='flex-1 pt-10'>
            <ScrollView className="px-4">
                <View className="flex items-center justify-center flex-1">
                    <View
                        className="w-full p-4 flex items-center justify-center rounded-2xl border-dashed "
                        style={{
                            borderWidth: 2,
                            borderColor: '#757575',
                        }}
                    >
                        <TouchableOpacity onPress={pickExcelDocument}>

                            <LottieView
                                source={require('@/assets/jsons/clound-upload.json')}
                                autoPlay
                                loop
                                style={{
                                    width: 200,
                                    height: 120,
                                }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={pickExcelDocument}>
                            <Text className="font-semibold">
                                Thêm tệp tại đây
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View className="mt-4">
                        <Text className="text-center font-semibold">
                            Tải xuống tệp Excel mẫu
                        </Text>
                        <View className="flex items-center justify-center mt-2 flex-row">
                            <Button
                                onPress={()=>{
                                    if (!isTemplateExist) {
                                        downloadAndOpenFile()
                                    }
                                }}
                                otherStyles={`p-3 ${isTemplateExist ? 'opacity-50' : ''}`}
                                text="Tải xuống mẫu (xlsx)"
                                icon={<SimpleLineIcons name="docs" size={18} color="white" />}
                                disabled={isTemplateExist}
                            />

                            <Button
                                onPress={() => {
                                    if (isTemplateExist) {
                                        clearTemplatedDownload();
                                    }
                                }}
                                otherStyles={`p-3 ml-2 ${!isTemplateExist ? 'opacity-50' : ''}`}
                                text="Xóa tệp mẫu"
                                icon={<SimpleLineIcons name="trash" size={18} color="white" />}
                                disabled={!isTemplateExist}
                            />
                        </View>

                        {/* New Section for Excel File Template */}
                        <View className="mt-6 p-4 bg-gray-100 rounded-lg">
                            <Text className="font-semibold text-center text-lg mb-2">Hướng dẫn định dạng tệp Excel</Text>

                            {/* Column Headers */}
                            <View className="flex flex-row bg-gray-200 border border-gray-300">
                                <Text className="flex-1 font-bold p-2 text-center border-r border-gray-300">full_name</Text>
                                <Text className="flex-1 font-bold p-2 text-center">email</Text>
                            </View>

                            {/* Example Rows */}
                            <View className="flex flex-row bg-white border border-gray-300">
                                <Text className="flex-1 p-2 text-center border-r border-gray-300">Nguyen Van A</Text>
                                <Text className="flex-1 p-2 text-center">vana@gmail.com</Text>
                            </View>
                            <View className="flex flex-row bg-gray-100 border border-gray-300">
                                <Text className="flex-1 p-2 text-center border-r border-gray-300">Nguyen Van B</Text>
                                <Text className="flex-1 p-2 text-center">vanb@gmail.com</Text>
                            </View>
                            <View className="flex flex-row bg-white border border-gray-300">
                                <Text className="flex-1 p-2 text-center border-r border-gray-300">Nguyen Van C</Text>
                                <Text className="flex-1 p-2 text-center">vanc@gmail.com</Text>
                            </View>

                            <Text className="mt-4 text-sm text-gray-600">
                                Đảm bảo mỗi hàng có tên đầy đủ và địa chỉ email hợp lệ.
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default UploadExcelScreen;

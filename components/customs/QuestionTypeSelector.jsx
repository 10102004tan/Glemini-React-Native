import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAppProvider } from '@/contexts/AppProvider';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const QuestionTypeSelector = ({ onSelectType, selectedType = 'single' }) => {
  const { i18n } = useAppProvider();

  const questionTypes = [
    {
      type: 'single',
      title: 'Single Choice',
      description: 'Chọn 1 đáp án đúng',
      icon: <AntDesign name="checkcircle" size={24} color="#3B82F6" />,
      color: '#3B82F6',
      bgColor: '#EFF6FF',
      borderColor: '#DBEAFE',
    },
    {
      type: 'multiple',
      title: 'Multiple Choice',
      description: 'Chọn nhiều đáp án đúng',
      icon: <MaterialIcons name="check-box" size={24} color="#10B981" />,
      color: '#10B981',
      bgColor: '#ECFDF5',
      borderColor: '#D1FAE5',
    },
    {
      type: 'fill',
      title: 'Fill in the Blank',
      description: 'Kéo thả từ vào chỗ trống',
      icon: <Entypo name="text" size={24} color="#8B5CF6" />,
      color: '#8B5CF6',
      bgColor: '#F3E8FF',
      borderColor: '#E9D5FF',
    },
    {
      type: 'order',
      title: 'Order Questions',
      description: 'Sắp xếp theo thứ tự đúng',
      icon: <FontAwesome name="sort-numeric-asc" size={24} color="#F59E0B" />,
      color: '#F59E0B',
      bgColor: '#FFFBEB',
      borderColor: '#FEF3C7',
    },
  ];

  const handleSelectType = (type) => {
    onSelectType(type);
  };

  return (
    <View className="p-4">
      <Text className="text-lg font-bold text-center mb-4 text-gray-800">Chọn loại câu hỏi</Text>

      <ScrollView showsVerticalScrollIndicator={false} className="max-h-96">
        {questionTypes.map((item, index) => (
          <TouchableOpacity
            key={item.type}
            onPress={() => handleSelectType(item.type)}
            className={`p-4 rounded-xl mb-3 border-2 ${
              selectedType === item.type ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
            }`}
            style={{
              backgroundColor: selectedType === item.type ? item.bgColor : '#FFFFFF',
              borderColor: selectedType === item.type ? item.color : '#E5E7EB',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.1,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <View className="flex-row items-center">
              <View className="mr-4">{item.icon}</View>
              <View className="flex-1">
                <Text
                  className="text-lg font-semibold mb-1"
                  style={{ color: selectedType === item.type ? item.color : '#374151' }}
                >
                  {item.title}
                </Text>
                <Text
                  className="text-sm"
                  style={{ color: selectedType === item.type ? item.color : '#6B7280' }}
                >
                  {item.description}
                </Text>
              </View>
              {selectedType === item.type && (
                <AntDesign name="checkcircle" size={20} color={item.color} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View className="mt-4 p-3 bg-blue-50 rounded-lg">
        <Text className="text-sm text-blue-800 text-center">
          💡 Tip: Mỗi loại câu hỏi có cách thức trả lời và tính điểm khác nhau
        </Text>
      </View>
    </View>
  );
};

export default QuestionTypeSelector;

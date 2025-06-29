import React from 'react';
import { View, Text } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const QuestionTypeDisplay = ({ type = 'single', size = 20, showText = true }) => {
  const getQuestionTypeInfo = (questionType) => {
    const types = {
      single: {
        title: 'Single Choice',
        shortTitle: 'Single',
        icon: <AntDesign name="checkcircle" size={size} color="#3B82F6" />,
        color: '#3B82F6',
        bgColor: '#EFF6FF',
      },
      multiple: {
        title: 'Multiple Choice',
        shortTitle: 'Multiple',
        icon: <MaterialIcons name="check-box" size={size} color="#10B981" />,
        color: '#10B981',
        bgColor: '#ECFDF5',
      },
      fill: {
        title: 'Fill in the Blank',
        shortTitle: 'Fill',
        icon: <Entypo name="text" size={size} color="#8B5CF6" />,
        color: '#8B5CF6',
        bgColor: '#F3E8FF',
      },
      order: {
        title: 'Order Questions',
        shortTitle: 'Order',
        icon: <FontAwesome name="sort-numeric-asc" size={size} color="#F59E0B" />,
        color: '#F59E0B',
        bgColor: '#FFFBEB',
      },
      match: {
        title: 'Match Questions',
        shortTitle: 'Match',
        icon: <MaterialIcons name="compare-arrows" size={size} color="#EF4444" />,
        color: '#EF4444',
        bgColor: '#FEF2F2',
      },
      // Legacy types support
      box: {
        title: 'Box Question',
        shortTitle: 'Box',
        icon: <Entypo name="text" size={size} color="#8B5CF6" />,
        color: '#8B5CF6',
        bgColor: '#F3E8FF',
      },
    };

    return types[questionType] || types.single;
  };

  const typeInfo = getQuestionTypeInfo(type);

  if (!showText) {
    return <View className="flex-row items-center">{typeInfo.icon}</View>;
  }

  return (
    <View className="flex-row items-center">
      <View className="p-2 rounded-lg mr-2" style={{ backgroundColor: typeInfo.bgColor }}>
        {typeInfo.icon}
      </View>
      <Text className="text-sm font-medium" style={{ color: typeInfo.color }}>
        {typeInfo.shortTitle}
      </Text>
    </View>
  );
};

export default QuestionTypeDisplay;

import React from 'react';
import { View, Text } from 'react-native';
import Onechoice from './Onechoice';
import MultipleChoice from './MultipleChoice';
import FillInTheBlank from './FillInTheBlank';
import OrderInput from './OrderInput';
import MatchItems from './MatchItems';

const QuestionPreview = ({ question, type = 'single', options = [], image = '' }) => {
  const renderPreview = () => {
    switch (type) {
      case 'single':
        return (
          <View className="mt-4">
            <Text className="text-white font-medium mb-3">🔘 Preview - Single Choice</Text>
            <View style={{ height: 300 }}>
              <Onechoice options={options} onClick={() => {}} image={image} preview={true} />
            </View>
          </View>
        );

      case 'multiple':
        return (
          <View className="mt-4">
            <Text className="text-white font-medium mb-3">☑️ Preview - Multiple Choice</Text>
            <View style={{ height: 300 }}>
              <MultipleChoice options={options} onClick={() => {}} image={image} preview={true} />
            </View>
          </View>
        );

      case 'fill':
        return (
          <View className="mt-4">
            <Text className="text-white font-medium mb-3">📝 Preview - Fill in the Blank</Text>
            <View style={{ height: 300 }}>
              <FillInTheBlank
                options={options}
                onClick={() => {}}
                image={image}
                question={question}
                preview={true}
              />
            </View>
          </View>
        );

      case 'order':
        return (
          <View className="mt-4">
            <Text className="text-white font-medium mb-3">🔢 Preview - Order</Text>
            <View style={{ height: 300 }}>
              <OrderInput options={options} onClick={() => {}} preview={true} />
            </View>
          </View>
        );

      case 'match':
        return (
          <View className="mt-4">
            <Text className="text-white font-medium mb-3">🔗 Preview - Match</Text>
            <View style={{ height: 300 }}>
              <MatchItems options={options} onClick={() => {}} preview={true} />
            </View>
          </View>
        );

      default:
        return (
          <View className="mt-4 p-4 bg-gray-700 rounded-xl">
            <Text className="text-gray-400 text-center">Chọn loại câu hỏi để xem preview</Text>
          </View>
        );
    }
  };

  if (!question || !options.length) {
    return (
      <View className="mt-4 p-4 bg-gray-700 rounded-xl">
        <Text className="text-gray-400 text-center">Thêm câu hỏi và đáp án để xem preview</Text>
      </View>
    );
  }

  return (
    <View className="mt-4">
      <Text className="text-white font-bold text-lg mb-2">🎯 Preview Câu Hỏi</Text>
      <View className="bg-gray-800 rounded-xl p-4">
        <Text className="text-white font-medium mb-4">{question}</Text>
        {renderPreview()}
      </View>
    </View>
  );
};

export default QuestionPreview;

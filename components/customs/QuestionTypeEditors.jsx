import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { AntDesign, Entypo } from '@expo/vector-icons';
import QuestionAnswerItem from './QuestionAnswerItem';
import { Colors } from '@/constants/Colors';

// Editor cho Single Choice và Multiple Choice
export const SingleMultipleEditor = ({
  options = [],
  questionType,
  onAddOption,
  onEditOption,
  onDeleteOption,
  maxOptions = 8,
}) => {
  return (
    <View className="mb-6">
      <Text className="font-bold text-white text-lg mb-4">
        {questionType === 'single'
          ? '🔘 Các lựa chọn (chọn 1 đúng)'
          : '☑️ Các lựa chọn (chọn nhiều đúng)'}
      </Text>

      {/* Options List */}
      <View className="bg-gray-800 rounded-xl p-4 border-2 border-gray-600">
        {options.length === 0 ? (
          <Text className="text-red-400 text-center py-4 italic">Chưa có lựa chọn nào</Text>
        ) : (
          <View className="flex flex-col space-y-3">
            {options.map((option, index) => (
              <QuestionAnswerItem
                key={`${option.id}-${index}`}
                answer={option.text}
                isCorrect={option.correct}
                color={Colors.answerColors[index]}
                onPress={() => onEditOption(option, index)}
                onDelete={() => onDeleteOption(option.id)}
              />
            ))}
          </View>
        )}

        {/* Add Option Button */}
        {options.length < maxOptions && (
          <TouchableOpacity
            className="flex flex-row items-center justify-center bg-blue-600 border-2 border-blue-500 py-3 px-4 rounded-xl mt-4"
            onPress={onAddOption}
          >
            <AntDesign name="plus" size={18} color="white" />
            <Text className="text-white ml-2 font-medium">Thêm lựa chọn</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Editor cho Fill in the Blank
export const FillInBlankEditor = ({
  options = [],
  question = '',
  onAddBlank,
  onEditBlank,
  onDeleteBlank,
}) => {
  const [newBlankText, setNewBlankText] = useState('');

  const handleAddBlank = () => {
    if (newBlankText.trim()) {
      onAddBlank(newBlankText.trim());
      setNewBlankText('');
    }
  };

  const blankCount = (question.match(/___/g) || []).length;

  return (
    <View className="mb-6">
      <Text className="font-bold text-white text-lg mb-2">📝 Điền vào chỗ trống</Text>
      <Text className="text-yellow-300 text-sm mb-4">
        💡 Sử dụng dấu ___ (3 dấu gạch dưới) để đánh dấu chỗ trống trong câu hỏi
      </Text>

      {blankCount > 0 && (
        <View className="bg-blue-900 border-2 border-blue-700 p-3 rounded-xl mb-4">
          <Text className="text-blue-200 font-medium">
            🔍 Tìm thấy {blankCount} chỗ trống trong câu hỏi
          </Text>
        </View>
      )}

      {/* Answers Section */}
      <View className="bg-gray-800 rounded-xl p-4 border-2 border-gray-600">
        <Text className="text-white font-medium mb-3">Đáp án cho các chỗ trống:</Text>

        {options.length === 0 ? (
          <Text className="text-red-400 text-center py-4 italic">Chưa có đáp án nào</Text>
        ) : (
          <View className="mb-4">
            {options.map((option, index) => {
              // Màu sắc sặc sỡ cho từng đáp án
              const colors = [
                { bg: 'bg-red-500', border: 'border-red-400', text: 'text-red-100' },
                { bg: 'bg-blue-500', border: 'border-blue-400', text: 'text-blue-100' },
                { bg: 'bg-green-500', border: 'border-green-400', text: 'text-green-100' },
                { bg: 'bg-yellow-500', border: 'border-yellow-400', text: 'text-yellow-100' },
                { bg: 'bg-purple-500', border: 'border-purple-400', text: 'text-purple-100' },
                { bg: 'bg-pink-500', border: 'border-pink-400', text: 'text-pink-100' },
                { bg: 'bg-indigo-500', border: 'border-indigo-400', text: 'text-indigo-100' },
                { bg: 'bg-teal-500', border: 'border-teal-400', text: 'text-teal-100' },
              ];
              const colorSet = colors[index % colors.length];

              return (
                <View
                  key={option.id}
                  className={`flex flex-row items-center ${colorSet.bg} ${colorSet.border} border-2 p-4 rounded-xl mb-3 shadow-sm`}
                >
                  <View className="bg-white bg-opacity-20 rounded-full px-3 py-1 mr-3">
                    <Text className="text-black font-bold text-sm">
                      #{option.position || index + 1}
                    </Text>
                  </View>
                  <Text className={`${colorSet.text} flex-1 font-medium text-base`}>
                    {option.text}
                  </Text>
                  <TouchableOpacity
                    onPress={() => onEditBlank(option, index)}
                    className="bg-white bg-opacity-20 rounded-full p-2 mr-2"
                  >
                    <Entypo name="edit" size={18} color="gray" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => onDeleteBlank(option.id)}
                    className="bg-red-600 bg-opacity-80 rounded-full p-2"
                  >
                    <AntDesign name="delete" size={18} color="white" />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}

        {/* Add new blank answer */}
        <View className="flex flex-row items-center">
          <TextInput
            className="flex-1 bg-gray-700 border-2 border-gray-600 text-white p-3 rounded-xl mr-3"
            placeholder={`Đáp án cho chỗ trống thứ ${options.length + 1}`}
            placeholderTextColor="#9CA3AF"
            value={newBlankText}
            onChangeText={setNewBlankText}
          />
          <TouchableOpacity
            className="bg-blue-600 border-2 border-blue-500 p-3 rounded-xl"
            onPress={handleAddBlank}
          >
            <AntDesign name="plus" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Editor cho Order Questions
export const OrderEditor = ({
  options = [],
  onAddItem,
  onEditItem,
  onDeleteItem,
  onReorderItems,
}) => {
  const [newItemText, setNewItemText] = useState('');

  const handleAddItem = () => {
    if (newItemText.trim()) {
      onAddItem(newItemText.trim());
      setNewItemText('');
    }
  };

  const moveItem = (fromIndex, toIndex) => {
    const newOptions = [...options];
    const item = newOptions.splice(fromIndex, 1)[0];
    newOptions.splice(toIndex, 0, item);

    // Make sure each item has proper ID structure
    const reorderedOptions = newOptions.map((option, index) => ({
      ...option,
      _id: option._id || option.id, // Ensure _id exists
      id: option.id || option._id, // Ensure id exists
      order: index + 1, // Update order
    }));

    onReorderItems(reorderedOptions);
  };

  return (
    <View className="mb-6">
      <Text className="font-bold text-white text-lg mb-2">🔢 Sắp xếp theo thứ tự</Text>
      <Text className="text-yellow-300 text-sm mb-4">
        💡 Thứ tự bạn thêm vào sẽ là thứ tự đúng. Kéo thả để thay đổi thứ tự.
      </Text>

      {/* Items Section */}
      <View className="bg-gray-800 rounded-xl p-4 border-2 border-gray-600">
        {options.length === 0 ? (
          <Text className="text-red-400 text-center py-4 italic">Chưa có mục nào</Text>
        ) : (
          <View className="mb-4">
            {options.map((option, index) => {
              // Màu sắc gradient cho thứ tự
              const colors = [
                { bg: 'bg-gradient-to-r from-red-500 to-red-600', border: 'border-red-400' },
                { bg: 'bg-gradient-to-r from-blue-500 to-blue-600', border: 'border-blue-400' },
                { bg: 'bg-gradient-to-r from-green-500 to-green-600', border: 'border-green-400' },
                {
                  bg: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
                  border: 'border-yellow-400',
                },
                {
                  bg: 'bg-gradient-to-r from-purple-500 to-purple-600',
                  border: 'border-purple-400',
                },
                { bg: 'bg-gradient-to-r from-pink-500 to-pink-600', border: 'border-pink-400' },
                {
                  bg: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
                  border: 'border-indigo-400',
                },
                { bg: 'bg-gradient-to-r from-teal-500 to-teal-600', border: 'border-teal-400' },
              ];
              const colorIndex = index % colors.length;
              const bgColors = [
                'bg-red-500',
                'bg-blue-500',
                'bg-green-500',
                'bg-yellow-500',
                'bg-purple-500',
                'bg-pink-500',
                'bg-indigo-500',
                'bg-teal-500',
              ];

              return (
                <View
                  key={option.id || option._id}
                  className={`flex flex-row items-center ${bgColors[colorIndex]} border-2 ${colors[colorIndex].border} p-4 rounded-xl mb-3 shadow-sm`}
                >
                  <View className="bg-white bg-opacity-30 rounded-full px-3 py-1 mr-3">
                    <Text className="text-black font-bold text-lg">#{index + 1}</Text>
                  </View>
                  <Text className="text-white flex-1 font-medium text-base">{option.text}</Text>

                  {/* Action buttons */}
                  <View className="flex flex-row items-center">
                    {index > 0 && (
                      <TouchableOpacity
                        onPress={() => moveItem(index, index - 1)}
                        className="bg-white bg-opacity-20 rounded-full p-2 mr-1"
                      >
                        <AntDesign name="up" size={16} color="gray" />
                      </TouchableOpacity>
                    )}

                    {index < options.length - 1 && (
                      <TouchableOpacity
                        onPress={() => moveItem(index, index + 1)}
                        className="bg-white bg-opacity-20 rounded-full p-2 mr-1"
                      >
                        <AntDesign name="down" size={16} color="gray" />
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      onPress={() => onEditItem(option, index)}
                      className="bg-white bg-opacity-20 rounded-full p-2 mr-1"
                    >
                      <Entypo name="edit" size={16} color="gray" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => onDeleteItem(option.id || option._id)}
                      className="bg-red-600 bg-opacity-80 rounded-full p-2"
                    >
                      <AntDesign name="delete" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Add new item */}
        <View className="flex flex-row items-center">
          <TextInput
            className="flex-1 bg-gray-700 border-2 border-gray-600 text-white p-3 rounded-xl mr-3"
            placeholder="Thêm mục cần sắp xếp..."
            placeholderTextColor="#9CA3AF"
            value={newItemText}
            onChangeText={setNewItemText}
          />
          <TouchableOpacity
            className="bg-blue-600 border-2 border-blue-500 p-3 rounded-xl"
            onPress={handleAddItem}
          >
            <AntDesign name="plus" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

import { createDisplayPairs } from '@/utils/matchQuestionUtils';

// Editor cho Match Questions
export const MatchEditor = ({
  options = [],
  correctAnswers = [],
  onAddPair,
  onEditPair,
  onDeletePair,
}) => {
  const [newLeftText, setNewLeftText] = useState('');
  const [newRightText, setNewRightText] = useState('');

  // Debug logging for match questions
  if (options.length > 0) {
    console.log('🔗 MatchEditor - Received options:', JSON.stringify(options, null, 2));
    console.log(
      '🔗 MatchEditor - Received correctAnswers:',
      JSON.stringify(correctAnswers, null, 2),
    );
  }

  const handleAddPair = () => {
    if (newLeftText.trim() && newRightText.trim()) {
      onAddPair({
        left: newLeftText.trim(),
        right: newRightText.trim(),
      });
      setNewLeftText('');
      setNewRightText('');
    }
  };

  // Use utility function to create display pairs
  const pairs = createDisplayPairs(options, correctAnswers);

  // Get unpaired options (options without match data)
  const unpairedOptions = options.filter((option) => !option.matchPair || option.matchPair === '');

  return (
    <View className="mb-6">
      <Text className="font-bold text-white text-lg mb-2">🔗 Nối cặp</Text>
      <Text className="text-yellow-300 text-sm mb-4">
        💡 Tạo các cặp từ/cụm từ cần nối với nhau
      </Text>

      {/* Unpaired Options Section */}
      {unpairedOptions.length > 0 && (
        <View className="bg-orange-800 bg-opacity-50 rounded-xl p-4 border-2 border-orange-600 mb-4">
          <Text className="text-orange-300 font-medium mb-2">⚠️ Options chưa có cặp:</Text>
          <View className="flex flex-row flex-wrap">
            {unpairedOptions.map((option, index) => (
              <View
                key={option.id || option._id}
                className="bg-orange-600 bg-opacity-70 px-3 py-1 rounded-lg mr-2 mb-2"
              >
                <Text className="text-white text-sm">{option.text}</Text>
              </View>
            ))}
          </View>
          <Text className="text-orange-200 text-xs mt-2 italic">
            💡 Các options này sẽ được lưu nhưng không hiển thị như cặp nối
          </Text>
        </View>
      )}

      {/* Pairs Section */}
      <View className="bg-gray-800 rounded-xl p-4 border-2 border-gray-600">
        {pairs.length === 0 ? (
          <Text className="text-red-400 text-center py-4 italic">Chưa có cặp nào</Text>
        ) : (
          <View className="mb-4">
            {pairs.map((pair, index) => {
              // Màu sắc cho từng cặp
              const colors = [
                { left: 'bg-red-500', right: 'bg-blue-500', border: 'border-purple-400' },
                { left: 'bg-green-500', right: 'bg-yellow-500', border: 'border-orange-400' },
                { left: 'bg-purple-500', right: 'bg-pink-500', border: 'border-red-400' },
                { left: 'bg-indigo-500', right: 'bg-teal-500', border: 'border-cyan-400' },
                { left: 'bg-orange-500', right: 'bg-red-500', border: 'border-pink-400' },
                { left: 'bg-cyan-500', right: 'bg-blue-500', border: 'border-indigo-400' },
              ];
              const colorSet = colors[index % colors.length];

              return (
                <View
                  key={pair.id}
                  className={`bg-gray-700 border-2 ${colorSet.border} p-4 rounded-xl mb-3 shadow-sm`}
                >
                  <View className="flex flex-row items-center justify-between mb-3">
                    <View className="bg-white bg-opacity-20 rounded-full px-3 py-1">
                      <Text className="text-black font-bold text-sm">Cặp #{index + 1}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        onDeletePair(pair.leftOptionId, pair.rightOptionId, pair.pairIndex)
                      }
                      className="bg-red-600 bg-opacity-80 rounded-full p-2"
                    >
                      <AntDesign name="delete" size={16} color="white" />
                    </TouchableOpacity>
                  </View>

                  <View className="flex flex-row items-center">
                    <View
                      className={`flex-1 ${colorSet.left} p-3 rounded-lg mr-3 border-2 border-white border-opacity-30`}
                    >
                      <Text className="text-white font-medium text-center">{pair.left}</Text>
                    </View>

                    <View className="bg-white bg-opacity-20 rounded-full p-2">
                      <AntDesign name="swap" size={16} color="gray" />
                    </View>

                    <View
                      className={`flex-1 ${colorSet.right} p-3 rounded-lg ml-3 border-2 border-white border-opacity-30`}
                    >
                      <Text className="text-white font-medium text-center">{pair.right}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Add new pair */}
        <View>
          <Text className="text-white font-medium mb-3">Thêm cặp mới:</Text>
          <View className="flex flex-row items-center mb-3">
            <TextInput
              className="flex-1 bg-gray-700 border-2 border-gray-600 text-white p-3 rounded-xl mr-2"
              placeholder="Từ bên trái..."
              placeholderTextColor="#9CA3AF"
              value={newLeftText}
              onChangeText={setNewLeftText}
            />

            <View className="bg-white bg-opacity-20 rounded-full p-2 mx-2">
              <AntDesign name="swap" size={16} color="white" />
            </View>

            <TextInput
              className="flex-1 bg-gray-700 border-2 border-gray-600 text-white p-3 rounded-xl ml-2"
              placeholder="Từ bên phải..."
              placeholderTextColor="#9CA3AF"
              value={newRightText}
              onChangeText={setNewRightText}
            />
          </View>

          <TouchableOpacity
            className="bg-green-600 border-2 border-green-500 py-3 px-4 rounded-xl"
            onPress={handleAddPair}
          >
            <Text className="text-white text-center font-medium">✨ Thêm cặp</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

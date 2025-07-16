import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Image, Animated, Easing } from 'react-native';

const FillInTheBlank = ({ options, onClick, image, question }) => {
  const countFill = question.split('_').length - 1;

  const [selectedOptions, setSelectedOptions] = useState(Array(countFill).fill(null));
  const [optionsState, setOptionsState] = useState(options);
  const [selectedBlankIndex, setSelectedBlankIndex] = useState(null);

  const fillAnimations = useRef(
    Array(countFill).fill().map(() => new Animated.Value(0))
  ).current;

  // Animate when option is selected
  useEffect(() => {
    selectedOptions.forEach((opt, i) => {
      if (opt) {
        fillAnimations[i].setValue(0);
        Animated.timing(fillAnimations[i], {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }).start();
      }
    });
  }, [selectedOptions]);

const handleToggleSelect = (option) => {
  if (selectedBlankIndex === null) return;

  const updated = [...selectedOptions];

  const previousAnswer = updated[selectedBlankIndex];
  if (previousAnswer) {
    setOptionsState((prev) => [...prev, previousAnswer]);
  }

  updated[selectedBlankIndex] = option;
  setSelectedOptions(updated);

  setOptionsState((prev) => prev.filter((item) => item.id !== option.id));

  fillAnimations[selectedBlankIndex].setValue(0);
  Animated.timing(fillAnimations[selectedBlankIndex], {
    toValue: 1,
    duration: 300,
    easing: Easing.out(Easing.ease),
    useNativeDriver: false,
  }).start();

  // ✅ Tạo mảng ID với fallback là `null` nếu chưa chọn
  const answerIds = updated.map((item) => (item ? item.id : null));
  console.log('✅ Updated answer IDs:', answerIds);

  onClick(answerIds);
};

const handleUnselect = (index) => {
  const option = selectedOptions[index];
  if (!option) return;

  const updated = [...selectedOptions];
  updated[index] = null;
  setSelectedOptions(updated);
  setOptionsState((prev) => [...prev, option]);

  fillAnimations[index].setValue(1);
  Animated.timing(fillAnimations[index], {
    toValue: 0,
    duration: 250,
    easing: Easing.out(Easing.ease),
    useNativeDriver: false,
  }).start();

  const answerIds = updated.map((item) => (item ? item.id : null));
  console.log('🧹 Updated answer IDs (after unselect):', answerIds);

  onClick(answerIds);
};


  const renderQuestionWithBlanks = () => {
    const parts = question.split('_');
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', rowGap: 20, paddingBottom: 4 }}>
        {parts.map((part, index) => {
          if (index < parts.length - 1) {
            const selected = selectedOptions[index];
            return (
              <React.Fragment key={index}>
                <Text style={{ fontSize: 16, flexShrink: 1, flexWrap: 'wrap', maxWidth: '100%', fontWeight: 600 }}>{part}</Text>
                <Pressable
                  onPress={() =>
                    selected ? handleUnselect(index) : setSelectedBlankIndex(index)
                  }
                  style={{
                    padding: selected ? 6 : 0,
                    borderRadius: selected ? 16 : 0,
                    backgroundColor: selected ? '#fff' : 'transparent',
                    shadowColor: selected ? '#000' : 'transparent',
                    borderColor: selected ?  '#e5e5e5' : 'transparent',
                    borderWidth: selected ? 2 : 0,
                    borderStyle: 'solid',
                    borderBottomWidth: selected ? 4 : 2,
                    borderColor: selectedBlankIndex === index ? '#4CAF50' : '#ccc',
                    marginHorizontal: 4,
                    minWidth: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    maxWidth: '100%',
                  }}
                >
                  <Animated.Text
                    style={{
                      fontSize: 16,
                      color: selected ? '#4CAF50' : '#000',
                      opacity: fillAnimations[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.4, 1],
                      }),
                      transform: [
                        {
                          translateY: fillAnimations[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [10, 0],
                          }),
                        },
                        {
                          scale: fillAnimations[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.8, 1],
                          }),
                        },
                      ],
                      flexShrink: 1,
                      flexWrap: 'wrap',
                      maxWidth: '100%',
                    }}
                  >
                    {selected?.text || ''}
                  </Animated.Text>
                </Pressable>
              </React.Fragment>
            );
          }
          return <Text key={index} style={{ fontSize: 16, flexShrink: 1, flexWrap: 'wrap', maxWidth: '100%', fontWeight: 600 }}>{part}</Text>;
        })}
      </View>
    );
  };

  return (
    <View style={{ marginTop: 20 }}>
      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: 150, height: 150, borderRadius: 8, marginBottom: 10 }}
        />
      )}
      {/* Phần câu hỏi có chỗ trống */}
      <View style={{ marginBottom: 16 }}>
        {renderQuestionWithBlanks()}
      </View>
      {/* Ranh giới giữa phần câu hỏi và phần chọn fill */}
      <View style={{ borderBottomWidth: 1, borderColor: '#e5e7eb', marginBottom: 18, marginHorizontal: -8 }} />
      {/* Phần chọn fill */}
      <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
        {options.map((option, idx) => {
          const isSelected = selectedOptions.some(sel => sel && sel.id === option.id);
          return (
            <Pressable
              key={option.id}
              onPress={() => !isSelected && handleToggleSelect(option)}
              disabled={isSelected}
              style={{
                padding: 8,
                borderRadius: 15,
                backgroundColor: isSelected ? '#e5e5e5' : '#fff',
                shadowColor: '#000',
                borderColor: '#e5e5e5',
                borderWidth: 2,
                borderBottomWidth: 4,
                borderStyle: 'solid',
                alignItems: 'center',
                marginBottom: 6,
                opacity: isSelected ? 0.5 : 1,
                minWidth: 100,
              }}
            >
              <Text style={{ fontSize: 16, color: isSelected ? '#e5e5e5' : '#4B4B4B', opacity: isSelected ? 0: 1, }}>{option.text}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default FillInTheBlank;

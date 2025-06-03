import React, { useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';

const FillInTheBlank = ({ options, onClick, image ,question}) => {
  const countFill = question.split("_").length - 1;
  const [selectedOptions, setSelectedOptions] = useState(Array(countFill).fill(''));
  const [optionsState, setOptionsState] = useState(options);
  const handleToggleSelect = (option) => {
    const newOptionsState = optionsState.filter((item) => item.id !== option.id);
    setOptionsState(newOptionsState);
  }

  const renderQuestionWithBlanks = () => {
    const parts = question.split('_');
    return parts.map((part, index) => {
      if (index < parts.length - 1) {
        return (
          <Text key={index} style={{ fontSize: 16, color: '#4B4B4B' }}>
            {part}
           <Pressable
           style={{
            paddingHorizontal: 20,
            backgroundColor: '#d7ffb8',
            borderRadius: 4,
            paddingVertical: 5,
           }}
           onPress={() => {
             // Handle press to select option
             console.log('Selected option at index:', index);
           }}>
             <Text >
              {selectedOptions[index] || '____'}
            </Text>
           </Pressable>
          </Text>
        );
      }
      return <Text key={index}>{part}</Text>;
    });
  }
  return (
    <View
    style={{
      marginTop: 20,
    }}
    >
      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: 150, height: 150, borderRadius: 8, marginBottom: 10 }}
        />
      )}
      <Text style={{ fontSize: 16, color: '#4B4B4B', marginBottom: 10 }}>
        {renderQuestionWithBlanks()}
      </Text>
      <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
        {optionsState.map((option, idx) => (
          <Pressable
            key={idx}
            onPress={() => handleToggleSelect(option, idx)}
            style={{
              padding: 8,
              borderRadius: 15,
              backgroundColor: '#fff',
              shadowColor: '#000',
              borderColor: '#e5e5e5',
              borderWidth: 2,
              borderBottomWidth: 4,
              borderStyle: 'solid',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 16, color: '#4B4B4B' }}>{option.text}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default FillInTheBlank;
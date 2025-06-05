import React, { useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';

const MultipleChoice = ({ options, onClick }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const handleToggleSelect = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
      {options.map((option, idx) => (
        <Pressable
          key={idx}
          onPress={() => handleToggleSelect(option)}
          style={{
            padding: 10,
            borderRadius: 8,
            backgroundColor: '#fff',
            shadowColor: '#000',
            borderColor: '#e5e5e5',
            borderWidth: 2,
            borderBottomWidth: 4,
            borderStyle: 'solid',
            width: '48%',
            alignItems: 'center',
            borderColor: selectedOptions.includes(option) ? '#4CAF50' : '#e5e5e5',
            backgroundColor: selectedOptions.includes(option) ? '#d7ffb8' : '#fff',
            height: 200,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 16, color: '#4B4B4B' }}>{option.text}</Text>
        </Pressable>
      ))}
    </View>
  );
};

export default MultipleChoice;

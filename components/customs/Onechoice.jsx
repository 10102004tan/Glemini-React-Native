import React, { useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';

const Onechoice = ({ options, onClick }) => {
  const [selected, setSelected] = useState(null);
  const handleToggleSelect = (option) => {
    if (selected === option) {
      setSelected(null);
    } else {
      setSelected(option);
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
            backgroundColor: selected && selected === option ? '#d7ffb8' : '#fff',
            shadowColor: '#000',
            borderColor: selected && selected === option ? '#4CAF50' : '#e5e5e5',
            borderWidth: 2,
            height: 200,
            borderBottomWidth: 4,
            borderStyle: 'solid',
            width: '48%',
            alignItems: 'center',
          }}
        >
          {option.image && (
            <Image
              source={{ uri: option.image }}
              style={{ width: 50, height: 50, marginBottom: 5 }}
            />
          )}
          <Text style={{ fontSize: 16, color: '#4B4B4B' }}>{option.text}</Text>
        </Pressable>
      ))}
    </View>
  );
};

export default Onechoice;

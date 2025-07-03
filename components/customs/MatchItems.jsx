import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';

const MatchItems = ({ options, onClick }) => {
  return (
    <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
      {options?.map((option, idx) => (
        <View
          key={idx}
          style={{
            padding: 10,
            borderRadius: 8,
            marginVertical: 5,
            width: '48%',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          {option.items.map((item, itemIdx) => (
            <Pressable
              key={itemIdx}
              onPress={() => onClick(item)}
              style={{
                padding: 10,
                borderRadius: 10,
                backgroundColor: '#fff',
                shadowColor: '#000',
                borderColor: '#e5e5e5',
                borderWidth: 2,
                width: '100%',
                borderBottomWidth: 4,
                borderStyle: 'solid',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 16, color: '#4B4B4B' }}>{item.text}</Text>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
};

export default MatchItems;

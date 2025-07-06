import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const CollectionItem = ({ name, count, onPress, folderColor = '#4f46e5' }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <AntDesign name="folder1" size={32} color={folderColor} style={{ marginRight: 16 }} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#222' }}>{name}</Text>
        <Text style={{ fontSize: 13, color: '#666' }}>{count} tài liệu</Text>
      </View>
      <AntDesign name="right" size={20} color="#bbb" />
    </TouchableOpacity>
  );
};

export default CollectionItem;

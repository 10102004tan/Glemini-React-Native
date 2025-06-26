import { Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

const ProfilePictureField = ({ setImage, image }) => {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0]);
    }
  };

  return (
    <View style={styles.row}>
      <Text style={styles.label}>Profile Picture</Text>
      <Pressable onPress={pickImage}>
        <Text style={styles.chooseFileBtn}>choose file</Text>
      </Pressable>
      {image && (
        <View style={{ marginLeft: 10 }}>
          <Text numberOfLines={1} style={{ maxWidth: 100, fontSize: 12 }}>
            {image.fileName || image.uri.split('/').pop()}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
    width: 100,
  },
  chooseFileBtn: {
    textTransform: 'uppercase',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1cb0f6',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderBottomWidth: 4,
    borderRightWidth: 2,
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderColor: '#e5e5e5',
  },
});

export default ProfilePictureField;

import { Pressable, Text, View, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';

const SchoolField = ({ schoolName }) => (
  <View style={styles.row}>
    <Text style={styles.label}>Trường học</Text>
    <Pressable
      onPress={() => {
        router.push({ pathname: '/(protected)/select-school' });
      }}
      style={styles.schoolPressable}
    >
      <Text style={styles.schoolText}>{schoolName ? schoolName : 'Chọn trường học'}</Text>
      <AntDesign name="caretdown" size={12} color="black" />
    </Pressable>
  </View>
);

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
  schoolPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 5,
    marginBottom: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 20,
    paddingVertical: 15,
    flex: 1,
  },
  schoolText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: 'bold',
  },
});

export default SchoolField;

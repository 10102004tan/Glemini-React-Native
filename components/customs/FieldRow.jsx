import { Text, TextInput, View, StyleSheet } from 'react-native';

const FieldRow = ({ label, value, placeholder, ...props }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      value={value}
      placeholder={placeholder}
      placeholderTextColor={'#6b7280'}
      style={styles.input}
      {...props}
    />
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
  input: {
    borderColor: '#E5E7EB',
    backgroundColor: '#f7f7f7',
    fontWeight: 'bold',
    fontSize: 16,
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    flex: 1,
    color: '#4b4b4b',
  },
});

export default FieldRow;

import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const ListSubject = ({ subjects, onSelect, selectedSubjects }) => {
  return (
    <View
      style={{
        marginBottom: 14,
        flexWrap: 'wrap',
        flexDirection: 'row',
      }}
    >
      {subjects.map((subject) => (
        <TouchableOpacity key={subject._id} onPress={() => onSelect(subject._id)}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '400',
              marginBottom: 10,
              marginRight: 15,
              paddingVertical: 5,
              paddingHorizontal: 20,
              backgroundColor: '#fff',
              width: 'auto',
              color: '#000',
              borderWidth: 1,
              borderColor: selectedSubjects.includes(subject._id) ? '#4f46e5' : '#E5E5E5',
            }}
          >
            {subject.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ListSubject;

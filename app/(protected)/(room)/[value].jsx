import { useRouter, useSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function RoomScreen() {
   const { value } = useSearchParams();

   return (
      <View>
         <Text>Welcome to Room: {value}</Text>
      </View>
   );
}

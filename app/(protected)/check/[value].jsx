import Wrapper from '@/components/customs/Wrapper';
import Lottie from '@/components/loadings/Lottie';
import { useRoomProvider } from '@/contexts/RoomProvider';
import { useGlobalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

export default function CheckScreen() {
   const { value } = useGlobalSearchParams();
   const { checkRoom } = useRoomProvider();

   useEffect(() => {
      checkRoom(value);
   }, [value]);

   return (
      <Wrapper>
         <View className="flex items-center justify-center w-full h-full">
            <Lottie
               source={require('@/assets/jsons/fly-loading.json')}
               width={300}
               height={300}
            />
         </View>
      </Wrapper>
   )
}

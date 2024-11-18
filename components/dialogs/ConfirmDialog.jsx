import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, Animated } from 'react-native';
import { styled } from 'nativewind';
import Entypo from '@expo/vector-icons/Entypo';
import { useAppProvider } from '@/contexts/AppProvider';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const ConfirmDialog = ({
   visible = false,
   onConfirm = () => { },
   onCancel = () => { },
   title = '',
   message = '',
   disableCancel = false,
}) => {
   const [showModal, setShowModal] = useState(visible);
   const { i18n } = useAppProvider();
   const scaleValue = useRef(new Animated.Value(0)).current;

   useEffect(() => {
      if (visible) {
         setShowModal(true);
         Animated.spring(scaleValue, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
         }).start();
      } else {
         Animated.timing(scaleValue, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
         }).start(() => setShowModal(false));
      }
   }, [visible, scaleValue]);

   return (
      <Modal
         transparent
         visible={showModal}
         animationType="none"
         onRequestClose={onCancel}
      >
         <StyledView className="flex-1 justify-center items-center bg-black/60">
            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
               <StyledView className="w-72 px-8 py-5 bg-white rounded-2xl items-center shadow-lg">
                  <StyledView className="text-lg font-semibold mb-3 uppercase flex items-center justify-center flex-row">
                     <StyledView className="mr-1">
                        <Entypo name="bell" size={20} color="black" />
                     </StyledView>
                     <StyledText className='uppercase font-semibold'>
                        {title}
                     </StyledText>
                  </StyledView>
                  <StyledText className="text-base text-center mb-5 font-semibold">
                     {message}
                  </StyledText>
                  <StyledView className="flex-row justify-between w-full">
                     <StyledTouchableOpacity
                        className={`flex-1 border p-3 rounded-lg items-center mr-2 ${disableCancel ? 'bg-gray-300 pointer-events-none' : 'bg-white'}`}
                        onPress={() => {
                           if (!disableCancel) {
                              onCancel();
                           }
                        }}
                     >
                        <StyledText className="text-black font-semibold">
                           {i18n.t('overview_quiz_screen.cancel')}
                        </StyledText>
                     </StyledTouchableOpacity>
                     <StyledTouchableOpacity
                        className="flex-1 bg-pink-500 border border-pink-500  p-3 rounded-lg items-center ml-2"
                        onPress={onConfirm}
                     >
                        <StyledText className="text-white font-semibold">
                           {i18n.t('overview_quiz_screen.confirm')}
                        </StyledText>
                     </StyledTouchableOpacity>
                  </StyledView>
               </StyledView>
            </Animated.View>
         </StyledView>
      </Modal>
   );
};

export default ConfirmDialog;

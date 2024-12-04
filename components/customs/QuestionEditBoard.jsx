import React, { useEffect, useState } from 'react';
import Animated, {
   useAnimatedStyle,
   useSharedValue,
   withTiming,
} from 'react-native-reanimated';
import RichTextEditor from './RichTextEditor';
import { Status } from '../../constants';
import { View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import Button from '../../components/customs/Button';
import { useQuestionProvider } from '../../contexts/QuestionProvider';
import { useAppProvider } from '@/contexts/AppProvider';


const QuestionEditBoard = ({
   content = '',
   visible = false,
   handleClose = () => { },
   type = '',
   answerEditSelected = 0,
   mutipleChoice = false,
   questionType = '',
   closeEditBoard = () => { },
}) => {
   const { i18n } = useAppProvider();
   const [isSaveData, setIsSaveData] = useState(false);
   // Tạo hiệu ứng chuyển động
   const translateY = useSharedValue(1000);

   useEffect(() => {
      if (visible) {
         translateY.value = withTiming(0, { duration: 400 });
      } else {
         translateY.value = withTiming(1000, { duration: 500 });
      }
   }, [visible]);

   const animatedStyle = useAnimatedStyle(() => {
      return {
         transform: [{ translateY: translateY.value }],
      };
   });

   const { deleteAnswer, markCorrectAnswer, checkCorrectAnswer } =
      useQuestionProvider();

   return (
      <Animated.View
         style={[animatedStyle]}
         className="rounded-2xl flex items-center justify-center max-h-[460px] absolute z-20 top-[5%]
      left-[5%] right-[50%] w-[90%] bg-white"
      >
         {/* Dùng để chỉnh sửa câu hỏi, đáp án của quiz */}
         <RichTextEditor
            questionType={questionType}
            closeEditBoard={closeEditBoard}
            isSave={isSaveData}
            setIsSaveData={setIsSaveData}
            focus={visible}
            typingType={type}
            content={content}
            selectedAnswer={answerEditSelected}
         />

         {/* Đánh dấu đáp án chính xác của bộ quiz */}
         {type === Status.quiz.ANSWER &&
            questionType !== 'box' &&
            questionType !== 'blank' && (
               <View className="flex flex-1 items-start justify-start flex-col w-full p-4">
                  <Button
                     onPress={() => {
                        markCorrectAnswer(
                           answerEditSelected,
                           mutipleChoice
                        );
                        // handleClose();
                     }}
                     otherStyles={`p-4 ${!checkCorrectAnswer(answerEditSelected) ? 'bg-green-500' : 'bg-yellow-500'}`}
                     text={
                        !checkCorrectAnswer(answerEditSelected)
                           ? i18n.t('edit_quiz_screen.markCorrectAnswer')
                           : i18n.t('edit_quiz_screen.unmarkCorrectAnswer')
                     }
                     icon={
                        <Feather
                           name="check-circle"
                           size={18}
                           color="white"
                        />
                     }
                  />
                  <Button
                     onPress={() => {
                        if (answerEditSelected !== 0) {
                           deleteAnswer(answerEditSelected);
                           handleClose();
                        }
                     }}
                     otherStyles="bg-error mt-2 justify-center p-4"
                     text={i18n.t('edit_quiz_screen.deleteAnswer')}
                     icon={
                        <Feather
                           name="trash-2"
                           size={18}
                           color="white"
                        />
                     }
                  />
               </View>
            )}
         <View className="flex flex-1 items-start justify-end flex-row w-full p-4">
            <Button
               onPress={() => {
                  setIsSaveData(true);
               }}
               otherStyles="bg-blue-500 p-4"
               text={i18n.t('edit_quiz_screen.save')}
               icon={<Feather name="save" size={18} color="white" />}
            />
         </View>
      </Animated.View>
   );
};

export default QuestionEditBoard;

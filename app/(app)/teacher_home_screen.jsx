import { View, Text, Image, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import React, { useContext, useState } from 'react';
import Wrapper from '../../components/customs/Wrapper';
import { Images } from '../../constants';
import Field from '../../components/customs/Field';
import AntDesign from '@expo/vector-icons/AntDesign';
import PressAction from '../../components/customs/PressAction';
import Ionicons from '@expo/vector-icons/Ionicons';
import BottomSheet from '../../components/customs/BottomSheet';
import { useAppProvider } from '../../contexts/AppProvider';
import { router, useRouter } from 'expo-router';
import Overlay from '../../components/customs/Overlay';
import LockFeature from '@/components/customs/LockFeature';
import { AuthContext } from '@/contexts/AuthContext';
import QuizzCreateAction from '../../components/customs/QuizCreateAction';
import { useQuizProvider } from '@/contexts/QuizProvider';
import NotificationIcon from "@/components/customs/NotificationIcon";

const TeacherHomeScreen = () => {
	const { teacherStatus,userData:{user_fullname,user_avatar,user_email},numberOfUnreadNoti } = useContext(AuthContext);
	const { setIsHiddenNavigationBar } = useAppProvider();
	const [visibleBottomSheet, setVisibleBottomSheet] = useState(false);
	const { setActionQuizType } = useQuizProvider();
	const router = useRouter();
	const handleCreateQuiz = () => {
		setIsHiddenNavigationBar(true);
		setVisibleBottomSheet(true);
	};

	const handleCloseBottomSheet = () => {
		setIsHiddenNavigationBar(false);
		setVisibleBottomSheet(false);
	};

	if (teacherStatus === 'pedding' || teacherStatus === 'rejected') {
		return <LockFeature />;
	}

	return (
		<Wrapper>
			{/* Overlay */}
			{
				<Overlay
					onPress={handleCloseBottomSheet}
					visible={visibleBottomSheet}
				/>
			}

			{/* Bottom Sheet */}
			<BottomSheet
				visible={visibleBottomSheet}
				onClose={handleCloseBottomSheet}
			>
				<View className="flex flex-col items-start justify-start">
					<Text className="text-lg">Tạo bài kiểm tra với AI</Text>
					<View className="flex items-center justify-start flex-row mt-4">
						<QuizzCreateAction
							title={'Tạo bài kiểm tra'}
							icon={
								<Ionicons
									name="documents-outline"
									size={24}
									color="black"
								/>
							}
						/>
						<QuizzCreateAction
							handlePress={() => {
								setActionQuizType('ai/prompt');
								handleCloseBottomSheet();
								router.push('/(app)/(quiz)/create_title');
							}}
							otherStyles="ml-2"
							title={'Tạo từ văn bản'}
							icon={
								<Ionicons
									name="text-outline"
									size={24}
									color="black"
								/>
							}
						/>
					</View>
					<Text className="text-lg mt-8">Tạo thủ công</Text>
					<View className="flex items-center justify-start flex-row mt-4">
						<QuizzCreateAction
							handlePress={() => {
								setActionQuizType('template');
								handleCloseBottomSheet();
								router.push('/(app)/(quiz)/create_title');
							}}
							title={'Tải lên mẫu'}
							icon={
								<Ionicons
									name="documents-outline"
									size={24}
									color="black"
								/>
							}
						/>
						<QuizzCreateAction
							handlePress={() => {
								setActionQuizType('create');
								handleCloseBottomSheet();
								router.push('(app)/(quiz)/create_title');
							}}
							otherStyles="ml-2"
							title={'Tạo bằng tay'}
							icon={
								<Ionicons
									name="hand-left-outline"
									size={24}
									color="black"
								/>
							}
						/>
					</View>
				</View>
			</BottomSheet>

         {/* Header */}
         <View className="px-4 py-6 bg-primary rounded-b-3xl">
            {/* Teacher Info */}
            <View className={"flex flex-row justify-between"}>
               <View className="flex flex-row items-center justify-start mb-3">
                  <Image
                     className={'w-[50px] h-[50px] rounded-full'}
                     src={user_avatar}
                  />
                  <View className="ml-3 max-w-[330px]">
                     <Text className="text-lg font-pmedium text-white">
                        {user_fullname}
                     </Text>
                     <Text className="text-white">{user_email}</Text>
                  </View>

				</View>
						<NotificationIcon numberOfUnreadNoti={numberOfUnreadNoti}/>
				</View>

				{/* Search */}
				<Field
					icon={<AntDesign name="search1" size={24} color="black" />}
					inputStyles="bg-white"
					placeholder={'Tìm kiếm một bài kiểm tra hoặc bài học'}
				/>

				{/* Actions */}
				<View className="flex flex-row items-center justify-between mt-6">
					<PressAction
						onPress={handleCreateQuiz}
						title={'Tạo Quiz'}
						icon={<AntDesign name="plus" size={24} color="black" />}
					/>
					<PressAction
						title={'Thư viện của tôi'}
						icon={
							<Ionicons
								name="library-outline"
								size={24}
								color="black"
							/>
						}
					/>
					<PressAction
						title={'Báo cáo'}
						icon={
							<Ionicons
								name="analytics-outline"
								size={24}
								color="black"
							/>
						}
					/>
				</View>
			</View>
		</Wrapper>
	);
};

export default TeacherHomeScreen;

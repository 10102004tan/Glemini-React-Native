import React from 'react';
import {View, Text, Modal, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Button from '../customs/Button';
import { useAuthContext } from '@/contexts/AuthContext';
import { truncateDescription } from '@/utils';
import { useAppProvider } from '@/contexts/AppProvider';
import { Images } from '@/constants';
import CustomButton from "@/components/customs/CustomButton";
import {Entypo, Ionicons} from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import {router} from "expo-router";
import {useQuizProvider} from "@/contexts/QuizProvider";
const QuizModal = ({
	visible = false,
	onClose = () => {},
	onStartQuiz = () => {},
	quiz,
}) => {
	const { userData } = useAuthContext();
	const { i18n } = useAppProvider();
	const {duplicateQuiz} = useQuizProvider();
	const handlerEditQuiz = () => {
		// hide modal
		onClose();
		router.push({
			pathname:'/(app)/(quiz)/detail_quiz',
			params:{
				id: quiz._id
			}
		});
	};
	const handlerSaveQuiz = async () => {
		// hide modal
		await duplicateQuiz(quiz._id).then((status) => {
			if (status) {
				router.push({
					pathname: '/(home)/libraly',
				});
			}
			onClose();
		}).catch(e=>console.log(e));};
	const handlerDetailQuiz = () => {
		// hide modal
		router.push({
			pathname: '/(app)/(quiz)/detail_quiz',
			params: {
				id: quiz._id,
				user_id: quiz?.user_id,
			},
		})
		onClose();
	};
	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={visible}
			onRequestClose={onClose}
		>
			<View className="flex-1 justify-center items-center bg-black/50 ">
				<View className="w-11/12 bg-white rounded-2xl overflow-hidden">
					<Image
						src={(quiz?.quiz_thumb || "https://elearningindustry.com/wp-content/uploads/2021/10/Shareable-Quizzes-In-Online-Training-7-Reasons.jpg")}
						className="w-full h-56"
						style={{ resizeMode: 'cover' }}
					/>
					<View className="items-end flex absolute right-3 top-3">
						<Button
							text={<Icon name="close" size={20} />}
							onPress={onClose}
							loading={false}
							type="fill"
							otherStyles={'bg-slate-300/70 rounded-full'}
							textStyles={'text-sm text-black'}
						/>
					</View>
					<View className="py-2">
						<View className="px-4">
							<Text className="text-xl font-bold">
								{quiz?.quiz_name}
							</Text>
							<Text className="text-sm font-medium">
								<Text>{i18n.t('student_homepage.author')}</Text>{' '}
								{quiz?.user_fullname ? quiz?.user_fullname : quiz.user?.user_fullname}
							</Text>
							<View className="flex-col mt-3 text-base">
								<Text className="text-slate-600 font-medium underline">
									{i18n.t('student_homepage.desc')}
								</Text>
								<Text>
									{quiz?.quiz_description
										? truncateDescription(
												quiz?.quiz_description,
												50
											)
										: i18n.t('student_homepage.textDesc')}
								</Text>
							</View>
						</View>
						<View className="flex flex-row p-2 w-full justify-center mt-2">
							{userData.user_type === 'teacher' ? (userData._id === quiz?.user_id) ? (
									<TouchableOpacity onPress={handlerEditQuiz} className={"flex-row p-2 rounded gap-2 items-center bg-green-400"}>
										<AntDesign name={'edit'} size={16} />
										<Text>{i18n.t("modal.btnEdit")}</Text>
									</TouchableOpacity>
								) : (
									<View className={"flex-row gap-2"}>
										<TouchableOpacity onPress={handlerSaveQuiz} className={"flex-row p-2 rounded gap-2 items-center bg-green-400"}>
											<Ionicons name={'bookmark'} size={16} />
											<Text>{i18n.t("modal.btnSave")}</Text>
										</TouchableOpacity>
										<TouchableOpacity onPress={handlerDetailQuiz} className={"flex-row p-2 rounded gap-2 items-center bg-amber-600"}>
											<Entypo name={'eye'} size={16} />
											<Text>{"Xem chi tiet"}</Text>
										</TouchableOpacity>
									</View>
								)
							: (
								<View className='flex-row items-center'>
									<Button
										text={i18n.t(
											'student_homepage.btnLuyenTap'
										)}
										loading={false}
										type="fill"
										otherStyles={'bg-pink-500 rounded-lg'}
										textStyles={'text-base text-black'}
										onPress={onStartQuiz}
									/>
								</View>
							)}
						</View>
					</View>
				</View>
			</View>
		</Modal>
	);
};

export default QuizModal;

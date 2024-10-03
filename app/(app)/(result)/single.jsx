import React from 'react';
import { View, Text, Image } from 'react-native';
import Button from '../../../components/customs/Button'; // Sử dụng Button tùy chỉnh
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
const ResultSingle = ({ correctCount, wrongCount, score, totalQuestions, handleRestart }) => {
	console.log(correctCount, wrongCount);
	
	const correctPercentage = (correctCount / totalQuestions) * 100;
    const wrongPercentage = (wrongCount / totalQuestions) * 100;


	return (
		<View className="flex-1 bg-[#1C2833] px-5 pb-4 pt-10">
			<View className="flex self-end mt-3">
				<Button
					text="Thoát"
					onPress={() => {
						console.log('Thoát');
					}}
					type="fill"
					otherStyles={'bg-[#435362] p-2'}
					textStyles={'text-sm'}
				/>
			</View>

			<View className="flex-row justify-around pt-5 ">
				<Button
					text="Chơi lại"
					onPress={handleRestart}
					type="fill"
					otherStyles={
						'bg-violet-500 py-4 px-6 border-b-4 border-b-violet-600'
					}
					textStyles={'text-lg'}
				/>
				<Button
					text="Tìm bộ mới"
					onPress={() => {
						console.log('Tìm bộ mới!!');
					}}
					type="fill"
					otherStyles={
						'bg-slate-100 p-4 border-b-4 border-b-slate-300'
					}
					textStyles={'text-black text-lg'}
				/>
			</View>

			<View className="flex-row p-5 bg-[#435362] mt-5 mx-3 rounded-lg">
				<Image
					source={{
						uri: 'https://scontent.fsgn5-14.fna.fbcdn.net/v/t39.30808-1/456537396_794061249555708_1663471177791048027_n.jpg?stp=dst-jpg_s200x200&_nc_cat=101&ccb=1-7&_nc_sid=50d2ac&_nc_eui2=AeFsVKryqdDFHD9LyKwncdC1HTmCAzypGDgdOYIDPKkYOI3clzOxlMLTwLW5KtwEY70jyPrCI5YMekhp1w_ex4Jg&_nc_ohc=eyXn5PYjLdcQ7kNvgFdsotm&_nc_ht=scontent.fsgn5-14.fna&_nc_gid=A4COVmBRgOZfuOKFOuZclAs&oh=00_AYA8zKzNfJe9vsPnpwW-eW6zhp_h2K_2lbzlpiaIImOUhw&oe=66FF40CD',
					}}
					className="w-20 h-20 rounded-full"
					style={{ resizeMode: 'cover' }}
				/>
				<View className="flex ml-5 justify-around">
					<Text className="text-lg text-slate-200">
						Tên người chơi
					</Text>
					<Text className="bg-slate-500 rounded-full text-sm px-2 text-slate-200">
						{' '}
						<Icon name="person-outline" /> Luyện tập
					</Text>
				</View>
			</View>

			<View className="flex p-5 bg-[#435362] mt-5 mx-3 rounded-lg">
				<Text className="text-slate-200 text-[15px]">Kết quả</Text>

				{/* Thanh Progress Bar */}
				<View className="flex-row h-5 mt-2">
					{/* Thanh đúng */}
					<View
						style={{
							width: `${correctPercentage}%`,
							backgroundColor: '#4CAF50', // Màu xanh lá cho đúng
							borderTopLeftRadius: 10,
							borderBottomLeftRadius: 10,
							borderTopRightRadius:
								correctPercentage === 100 ? 10 : 0,
							borderBottomRightRadius:
								correctPercentage === 100 ? 10 : 0,
						}}
					/>
					{/* Thanh sai */}
					<View
						style={{
							width: `${wrongPercentage}%`,
							backgroundColor: '#F44336', // Màu đỏ cho sai
							borderTopRightRadius: 10,
							borderBottomRightRadius: 10,
							borderTopLeftRadius:
								wrongPercentage === 100 ? 10 : 0,
							borderBottomLeftRadius:
								wrongPercentage === 100 ? 10 : 0,
						}}
					/>
				</View>

				<View className="flex flex-row justify-between mt-3">
					<Text className="text-green-500 font-semibold">
						Đúng: {correctPercentage.toFixed(0)}%
					</Text>
					<Text className="text-red-500 font-semibold">
						Sai: {wrongPercentage.toFixed(0)}%
					</Text>
				</View>
			</View>

			<View className="flex-row justify-between mx-3">
				<View className="flex-row p-3 mt-5 rounded-lg bg-[#435362] justify-between items-center">
					<View className="flex-col">
						<Text className="text-sm text-slate-200">Điểm số</Text>
						<Text className="text-xl text-slate-100 font-semibold">
							{score}
						</Text>
					</View>
					<View className="ml-5 bg-orange-400 rounded-lg p-1">
						<Icon
							name="ribbon-outline"
							size={25}
							className="text-white"
						/>
					</View>
				</View>
				<View className="flex-row p-3 mt-5 rounded-lg bg-[#435362] justify-between items-center">
					<View className="flex-col">
						<Text className="text-sm text-slate-200">
							Tổng số câu hỏi
						</Text>
						<Text className="text-xl text-slate-100 font-semibold">
							{totalQuestions}
						</Text>
					</View>
					<View className="ml-2 bg-violet-400 rounded-lg p-1">
						<Icon
							name="help-circle-outline"
							size={25}
							className="text-white"
						/>
					</View>
				</View>
			</View>

			<View className="flex-row justify-between mx-3">
				<View className="flex-row p-3 mt-5 rounded-lg bg-[#435362] justify-between items-center">
					<View className="flex-col">
						<Text className="text-sm text-slate-200">Chính xác</Text>
						<Text className="text-xl text-slate-100 font-semibold">
							{correctCount}
						</Text>
					</View>
					<View className="ml-2">
						<Icon2
							name="checkbox-marked-outline"
							size={40}
							className="text-green-500"
						/>
					</View>
				</View>
				<View className="flex-row p-3 mt-5 rounded-lg bg-[#435362] justify-between items-center">
					<View className="flex-col">
						<Text className="text-sm text-slate-200">
							Không chính xác
						</Text>
						<Text className="text-xl text-slate-100 font-semibold">
							{wrongCount}
						</Text>
					</View>
					<View className="ml-2">
						<Icon2
							name="close-box-outline"
							size={40}
							className="text-red-500"
						/>
					</View>
				</View>
			</View>

			<View className="flex self-start absolute bottom-5 left-5">
				<Button
					text="Xem lại"
					onPress={() => {
						console.log('Hiển thị bài làm');
					}}
					type="fill"
					otherStyles={'bg-[#435362] p-2'}
					textStyles={'text-white text-center text-sm'}
				/>
			</View>
		</View>
	);
};

export default ResultSingle;

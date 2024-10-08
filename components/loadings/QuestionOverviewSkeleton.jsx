import { Text, View } from 'react-native';
import React from 'react';
import SkeletonLoading from './SkeletonLoading';
const QuestionOverviewSkeleton = () => {
	return (
		<View className="p-2 rounded-2xl border border-overlay mb-2">
			<View className="flex w-full items-center justify-between flex-row">
				<SkeletonLoading styles="w-8 h-8 rounded-lg">
					<Text className="text-white"></Text>
				</SkeletonLoading>
				<SkeletonLoading styles="flex-1 ml-2 w-8 h-8 rounded-lg"></SkeletonLoading>
				<Text className="text-gray"></Text>
			</View>
			<View className="mt-2 overflow-hidden"></View>
			<SkeletonLoading styles="w-full h-6 mr-2 mb-1 mt-4 rounded-lg">
				<Text className="text-white"></Text>
			</SkeletonLoading>
			<View className="mt-4">
				{[1, 2, 3, 4].map((index) => (
					<View
						key={index}
						className="flex flex-col items-center justify-start"
					>
						<SkeletonLoading styles="w-full h-5 mb-2 rounded-lg">
							<Text className="text-white"></Text>
						</SkeletonLoading>
					</View>
				))}
			</View>
			<View className="mt-4">
				<View className="flex items-center justify-end flex-row">
					<SkeletonLoading styles="w-12 h-3 mb-2 rounded-lg">
						<Text className="text-white"></Text>
					</SkeletonLoading>
				</View>
				<View className="flex items-center justify-end flex-row">
					<SkeletonLoading styles="w-12 h-3 mb-2 rounded-lg">
						<Text className="text-white"></Text>
					</SkeletonLoading>
				</View>
			</View>
		</View>
	);
};

export default QuestionOverviewSkeleton;

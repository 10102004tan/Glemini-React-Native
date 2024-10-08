import { View, Text } from 'react-native';
import React from 'react';
import SkeletonLoading from './SkeletonLoading';

const QuizInforSkeleton = () => {
	return (
		<>
			<SkeletonLoading styles="p-4 flex-1 h-[140px] rounded-2xl"></SkeletonLoading>
			{/* Quiz infor */}
			<View className="mt-4 p-4">
				<View className="flex items-center justify-between flex-row">
					<View>
						<SkeletonLoading styles="w-full w-[200px] h-5 rounded-lg"></SkeletonLoading>
						<SkeletonLoading styles="mt-1 w-[240px] h-6 rounded-lg"></SkeletonLoading>
					</View>
					<View className="flex items-center flex-row justify-center">
						<SkeletonLoading
							styles={'w-8 h-8 rounded-xl'}
						></SkeletonLoading>
						<SkeletonLoading
							styles={'w-8 h-8 rounded-xl ml-1'}
						></SkeletonLoading>
					</View>
				</View>
			</View>
		</>
	);
};

export default QuizInforSkeleton;

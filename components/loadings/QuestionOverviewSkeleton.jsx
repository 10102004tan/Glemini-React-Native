import { View, Text } from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
const QuestionOverviewSkeleton = () => {
	return (
		<SkeletonPlaceholder>
			<View className="p-2 rounded-2xl border border-gray mb-2">
				<View className="flex w-full items-center justify-between flex-row">
					<View className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center" />
					<View className="ml-2 w-1/2 h-6" />
					<View className="w-1/4 h-6" />
				</View>
				<View className="mt-2 h-20" />
				<View className="mt-6">
					{[...Array(4)].map((_, index) => (
						<View
							key={index}
							className="flex flex-row items-center justify-start mb-2"
						>
							<View className="w-4 h-4 rounded-full mr-2" />
							<View className="w-3/4 h-6" />
						</View>
					))}
				</View>
				<View className="h-6 mt-4" />
				<View className="h-6 mt-2" />
			</View>
		</SkeletonPlaceholder>
	);
};

export default QuestionOverviewSkeleton;

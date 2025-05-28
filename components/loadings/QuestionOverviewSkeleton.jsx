import { Text, View } from 'react-native';
import React from 'react';
import SkeletonLoading from './SkeletonLoading';
const QuestionOverviewSkeleton = () => {
	return (
		<View style={{
			padding: 8,
			borderRadius: 16,
			borderWidth: 1,
			borderColor: 'rgba(0, 0, 0, 0.2)',
			marginBottom: 8
		}}>
			<View style={{
				display: 'flex',
				width: '100%',
				alignItems: 'center',
				justifyContent: 'space-between',
				flexDirection: 'row',
			}}>
				<SkeletonLoading styles={'w-3/4 h-6 rounded-lg'}>
					<Text style={{ color: 'white' }}></Text>
				</SkeletonLoading>
				<SkeletonLoading styles="flex-1 ml-2 w-8 h-8 rounded-lg"></SkeletonLoading>
				<Text style={{ color: 'gray' }}></Text>
			</View>
			<View style={{ marginTop: 8, overflow: 'hidden' }}></View>
			<SkeletonLoading styles="w-full h-6 mr-2 mb-1 mt-4 rounded-lg">
				<Text style={{ color: 'white' }}></Text>
			</SkeletonLoading>
			<View style={{ marginTop: 16 }}>
				{[1, 2, 3, 4].map((index) => (
					<View
						key={index}
						style={{ 
							display: 'flex', 
							flexDirection: 'column', 
							alignItems: 'center', 
							justifyContent: 'flex-start' 
						}}>
						<SkeletonLoading styles="w-full h-5 mb-2 rounded-lg">
							<Text style={{color: 'white'}}></Text>
						</SkeletonLoading>
					</View>
				))}
			</View>
			<View className="mt-4" style={{ marginTop: 16}}>
				<View style={{ 
					display: 'flex', 
					flexDirection: 'row', 
					justifyContent: 'space-between',
					alignItems: 'center'
					}}>
					<SkeletonLoading styles="w-12 h-3 mb-2 rounded-lg">
						<Text style={{color: 'white'}}></Text>
					</SkeletonLoading>
				</View>
				<View style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'flex-end',
					alignItems: 'center'
				}}>
					<SkeletonLoading styles="w-12 h-3 mb-2 rounded-lg">
						<Text style={{color: 'white'}}></Text>
					</SkeletonLoading>
				</View>
			</View>
		</View>
	);
};

export default QuestionOverviewSkeleton;

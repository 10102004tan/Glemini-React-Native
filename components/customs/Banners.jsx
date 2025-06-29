import React, { useContext } from 'react';
import { View, TouchableOpacity, Image, Dimensions, Text } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import BannerSkeleton from './BannerSkeleton';
import { Images } from '@/constants';

const { width } = Dimensions.get('window');
const carouselHeight = (width * 2) / 3;
const Banners = ({ bannerQuizzes, isBannerFetching,onPress}) => {
  return (
    <>
      {isBannerFetching ? (
        <BannerSkeleton/>
      ) : (
        <View className={bannerQuizzes.length > 0 ? `flex h-[${carouselHeight}px]` : `hidden`}>
          <Carousel
            loop
            width={width}
            height={carouselHeight}
            autoPlay={true}
            data={bannerQuizzes}
            mode="parallax"
            scrollAnimationDuration={2500}
            renderItem={({ item, index }) => (
              <TouchableOpacity onPress={()=> onPress(item)}>
                <View className="absolute z-10 top-5 left-5 px-3 py-1 rounded bg-blue-500/80">
                  <Text className="text-xl font-bold text-white">{index + 1}</Text>
                </View>
                <Image
                  source={item.quiz_thumb ? { uri: item.quiz_thumb } : Images.banner1}
                  className="w-full h-full rounded-2xl"
                  style={{ resizeMode: 'cover' }}
                />
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </>
  );
};

export default Banners;



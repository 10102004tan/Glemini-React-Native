import React from 'react';
import { View, TouchableOpacity, Image, Dimensions, Text, StyleSheet } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import BannerSkeleton from './BannerSkeleton';
import { Images } from '@/constants';
import ScaleTouchable from './ScaleTouchable';

const { width } = Dimensions.get('window');
const carouselHeight = (width * 2) / 3;

const Banners = ({ bannerQuizzes, isBannerFetching, onPress }) => {
  return (
    <>
      {isBannerFetching ? (
        <BannerSkeleton />
      ) : (
        <View className={bannerQuizzes.length > 0 ? `flex h-[${carouselHeight}px]` : `hidden`}>
          <Carousel
            loop
            width={width}
            height={carouselHeight}
            autoPlay
            data={bannerQuizzes}
            mode="parallax"
            scrollAnimationDuration={2500}
            renderItem={({ item, index }) => (
              <ScaleTouchable onPress={() => onPress(item)} key={item._id || index}>
                <View style={styles.cardContainer}>
                  {/* Rank indicator */}
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankText}>🏆 {index + 1}</Text>
                  </View>

                  {/* Banner image */}
                  <Image
                    source={item.quiz_thumb ? { uri: item.quiz_thumb } : Images.banner1}
                    style={styles.bannerImage}
                  />
                </View>
              </ScaleTouchable>
            )}
          />
        </View>
      )}
    </>
  );
};

export default Banners;

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 18,
    borderWidth: 3,
    borderTopWidth:6,
    borderColor: '#93C5FD',
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  bannerImage: {
    width: '100%',
    height: carouselHeight,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  rankBadge: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#93C5FD',
    borderBottomWidth: 4,
    zIndex: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  rankText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E40AF', // Blue-900
  },
});

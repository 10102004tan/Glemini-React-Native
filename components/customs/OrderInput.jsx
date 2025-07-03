import { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  LayoutAnimation,
  UIManager,
  Platform,
  Animated,
  View,
  Text,
  Pressable,
} from 'react-native';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const OrderInput = ({ options, onClick }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const animations = useRef(
    options.reduce((acc, option) => {
      acc[option.id] = new Animated.Value(0);
      return acc;
    }, {}),
  ).current;

  const isSelected = (option) => selectedOptions.some((item) => item.id === option.id);

  const handleClick = (option) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    if (isSelected(option)) {
      // Animate xuống
      Animated.spring(animations[option.id], {
        toValue: 0,
        useNativeDriver: true,
      }).start();

      setSelectedOptions((prev) => prev.filter((item) => item.id !== option.id));
    } else {
      // Animate lên
      Animated.spring(animations[option.id], {
        toValue: -60,
        useNativeDriver: true,
      }).start();

      setSelectedOptions((prev) => [...prev, option]); // vào sau, hiện sau
    }

    if (onClick) onClick(option.id);
  };

  return (
    <View style={{ padding: 20 }}>
      <View>
        <View style={styles.boxContainer}>
          {selectedOptions.map((option) => (
            <Animated.View
              key={option.id}
              style={{ transform: [{ translateY: animations[option.id] }], margin: 5 }}
            >
              <Pressable style={styles.box} onPress={() => handleClick(option)}>
                <Text style={styles.boxText}>{option.text}</Text>
              </Pressable>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* Khối chưa chọn (unselected) */}
      <View>
        <View style={styles.boxContainer}>
          {options
            .filter((option) => !isSelected(option))
            .map((option) => (
              <Animated.View
                key={option.id}
                style={{ transform: [{ translateY: animations[option.id] }], margin: 5 }}
              >
                <Pressable style={styles.box} onPress={() => handleClick(option)}>
                  <Text style={styles.boxText}>{option.text}</Text>
                </Pressable>
              </Animated.View>
            ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  boxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    minHeight: 100,
    paddingVertical: 20,
    borderTopWidth: 2,
    borderColor: '#e5e5e5',
    borderBottomWidth: 2,
  },
  box: {
    padding: 8,
    borderRadius: 15,
    backgroundColor: '#fff',
    borderColor: '#e5e5e5',
    borderWidth: 2,
    borderBottomWidth: 4,
    alignItems: 'center',
    minWidth: 60,
  },
  boxText: {
    fontSize: 16,
    color: '#4B4B4B',
  },
});

export default OrderInput;

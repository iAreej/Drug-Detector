import React, { useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const RippleButton = ({ title, navigateTo }: { title: string, navigateTo: string }) => {
  const [glowRotate] = useState(new Animated.Value(0));
  const [sparkles] = useState([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]);
  const navigation = useNavigation();

  const handlePress = () => {
    // Rotate effect
    Animated.sequence([
      Animated.timing(glowRotate, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate sparkles effect
    sparkles.forEach((sparkle, index) => {
      const randomX = Math.random() * 40 - 20; // Random horizontal position
      const randomY = Math.random() * 50 + 50; // Random vertical position

      Animated.timing(sparkle, {
        toValue: 1,
        duration: 500 + Math.random() * 500, // Random duration for each sparkle
        useNativeDriver: true,
        easing: Easing.linear,
      }).start();

      Animated.timing(sparkle, {
        toValue: 0,
        duration: 500 + Math.random() * 500,
        delay: 100, // Slight delay to make sparkles appear sequentially
        useNativeDriver: true,
        easing: Easing.linear,
      }).start();
    });

    navigation.navigate(navigateTo);
  };

  const rotateInterpolate = glowRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={handlePress}>
        <Animated.View style={[styles.button, { transform: [{ rotate: rotateInterpolate }] }]}>
          <View style={styles.iconAndText}>
            <Icon name="power" size={30} color="rgb(163, 209, 198)" style={styles.icon} />
            <Text style={styles.buttonText}>{title}</Text>
          </View>
        </Animated.View>

        {/* Sparkles */}
        <View style={styles.sparkleContainer}>
          {sparkles.map((sparkle, index) => (
            <Animated.View
              key={index}
              style={[
                styles.sparkle,
                {
                  opacity: sparkle,
                  transform: [
                    { translateX: sparkle.interpolate({ inputRange: [0, 1], outputRange: [0, Math.random() * 30 - 15] }) },
                    { translateY: sparkle.interpolate({ inputRange: [0, 1], outputRange: [0, Math.random() * 30 + 30] }) },
                  ],
                },
              ]}
            />
          ))}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'rgb(62, 131, 115)',
    borderRadius: 70,
    paddingHorizontal: 80,
    paddingVertical: 30,
    borderWidth: 2,
    borderColor: 'rgb(163, 209, 198)',
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconAndText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    color: 'rgb(163, 209, 198)',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgb(163, 209, 198)',
    textShadowRadius: 5,
  },
  sparkleContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -10,
    marginLeft: -40,
    pointerEvents: 'none',
  },
  sparkle: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: 'rgb(163, 209, 198)',
    borderRadius: 5,
  },
});

export default RippleButton;

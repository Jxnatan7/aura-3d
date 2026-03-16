import { useState, useCallback } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  withDelay,
} from "react-native-reanimated";

export const useImageTransition = () => {
  const imageOpacity = useSharedValue(1);
  const [isImageVisible, setIsImageVisible] = useState(true);

  const handleModelLoaded = useCallback(() => {
    imageOpacity.value = withDelay(
      300,
      withTiming(0, { duration: 500 }, (finished) => {
        if (finished) {
          runOnJS(setIsImageVisible)(false);
        }
      }),
    );
  }, []);

  const animatedImageStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
  }));

  return { isImageVisible, animatedImageStyle, handleModelLoaded };
};

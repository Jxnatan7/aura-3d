import { useState, useEffect, useCallback } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

export const useViewerUI = () => {
  const [uiHidden, setUiHidden] = useState(false);
  const uiOffset = useSharedValue(0);

  useEffect(() => {
    uiOffset.value = withTiming(uiHidden ? 300 : 0, {
      duration: 1500,
      easing: Easing.out(Easing.exp),
    });
  }, [uiHidden]);

  const animatedUiStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: uiOffset.value }],
  }));

  const showUi = useCallback(() => {
    if (uiHidden) {
      setUiHidden(false);
    }
  }, [uiHidden]);

  return { uiHidden, setUiHidden, animatedUiStyle, showUi };
};

import React, { useEffect } from "react";
import { Dimensions } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, G } from "react-native-svg";
import { Box, Text } from "@/components/restyle";

const { width } = Dimensions.get("window");
const CIRCLE_LENGTH = 800;
const R = CIRCLE_LENGTH / (2 * Math.PI);

const ProgressRing = () => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1500,
        easing: Easing.linear,
      }),
      -1,
    );
  }, []);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }],
    };
  });

  return (
    <Box alignItems="center" justifyContent="center" mb="xl">
      <Animated.View style={animatedStyles}>
        <Svg
          width={width * 0.7}
          height={width * 0.7}
          viewBox={`0 0 ${width} ${width}`}
        >
          <G origin={`${width / 2}, ${width / 2}`}>
            <Circle
              cx={width / 2}
              cy={width / 2}
              r={R}
              stroke="#333"
              strokeWidth={15}
              strokeOpacity={0.2}
            />
            <Circle
              cx={width / 2}
              cy={width / 2}
              r={R}
              stroke="#3DCDF3"
              strokeWidth={15}
              strokeDasharray={CIRCLE_LENGTH}
              strokeDashoffset={CIRCLE_LENGTH * 0.75}
              strokeLinecap="round"
            />
          </G>
        </Svg>
      </Animated.View>

      <Box position="absolute" alignItems="center">
        <Text
          fontFamily="MulishFontBold"
          color="gray200"
          fontSize={18}
          letterSpacing={1}
        >
          AI
        </Text>
        <Text
          fontFamily="MulishFontBold"
          color="gray200"
          fontSize={16}
          letterSpacing={1}
        >
          Gerando...
        </Text>
      </Box>
    </Box>
  );
};

export default ProgressRing;

import React, { useEffect } from "react";
import { Box, Text } from "@/src/components/restyle";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";

type ProgressBarProps = {
  progress: number;
};

const ProgressBar = ({ progress }: ProgressBarProps) => {
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: 500,
      easing: Easing.out(Easing.ease),
    });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${animatedProgress.value}%`,
    };
  });

  return (
    <Box width="100%" alignItems="center" mb="l">
      <Text
        mt="s"
        variant="header"
        fontSize={24}
        fontWeight="bold"
        color="white"
      >
        {Math.round(progress)}%
      </Text>
      <Box
        width="100%"
        height={10}
        backgroundColor="extraBlack"
        borderRadius={10}
        overflow="hidden"
      >
        <Animated.View
          style={[
            {
              height: "100%",
              backgroundColor: "#FFF",
              borderRadius: 10,
            },
            animatedStyle,
          ]}
        />
      </Box>
    </Box>
  );
};

export default ProgressBar;

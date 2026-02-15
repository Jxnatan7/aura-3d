import { Box, Text } from "@/components/restyle";
import { Dimensions } from "react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, G } from "react-native-svg";

const { width } = Dimensions.get("window");
const CIRCLE_LENGTH = 800;
const R = CIRCLE_LENGTH / (2 * Math.PI);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const ProgressRing = ({ progress }: { progress: number }) => {
  const strokeOffset = useDerivedValue(() => {
    return withTiming(CIRCLE_LENGTH - (CIRCLE_LENGTH * progress) / 100, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });
  });

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: strokeOffset.value,
  }));

  return (
    <Box alignItems="center" justifyContent="center" mb="xl">
      <Svg
        width={width * 0.7}
        height={width * 0.7}
        viewBox={`0 0 ${width} ${width}`}
      >
        <G rotation="-90" origin={`${width / 2}, ${width / 2}`}>
          <Circle
            cx={width / 2}
            cy={width / 2}
            r={R}
            stroke="#333"
            strokeWidth={15}
            strokeOpacity={0.2}
          />
          <AnimatedCircle
            cx={width / 2}
            cy={width / 2}
            r={R}
            stroke="#2ECC71"
            strokeWidth={15}
            strokeDasharray={CIRCLE_LENGTH}
            animatedProps={animatedProps}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <Box position="absolute" alignItems="center">
        <Text variant="header" fontSize={40} fontWeight="bold" color="white">
          {Math.round(progress)}%
        </Text>
        <Text variant="body" color="gray200" fontSize={12} letterSpacing={1}>
          PROCESSANDO
        </Text>
      </Box>
    </Box>
  );
};

export default ProgressRing;

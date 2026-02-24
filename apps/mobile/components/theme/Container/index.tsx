import { RestyleContainer, RestyleContainerProps } from "@/components/restyle";
import { ContainerHeader, ContainerHeaderProps } from "../ContainerHeader";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
import { useTheme } from "@shopify/restyle";
import { Theme } from "@/theme";
import { SCREEN_HEIGHT } from "@/constants";

export type ContainerProps = RestyleContainerProps & {
  hideHeader?: boolean;
  containerHeaderProps?: ContainerHeaderProps;
  containerHeaderChildren?: React.ReactNode;
  gradient?: boolean;
};

export const Container = ({
  children,
  hideHeader,
  containerHeaderProps,
  containerHeaderChildren,
  gradient,
  ...props
}: ContainerProps) => {
  const theme = useTheme<Theme>();

  const Container = () =>
    gradient ? (
      <LinearGradient
        colors={[
          theme.colors.gradientDark1,
          theme.colors.gradientDark0,
          theme.colors.gradientDark1,
        ]}
        style={[styles.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <RestyleContainer {...props}>
          {!hideHeader && (
            <ContainerHeader
              children={containerHeaderChildren}
              {...containerHeaderProps}
            />
          )}
          {children}
        </RestyleContainer>
      </LinearGradient>
    ) : (
      <RestyleContainer {...props}>
        {!hideHeader && (
          <ContainerHeader
            children={containerHeaderChildren}
            {...containerHeaderProps}
          />
        )}
        {children}
      </RestyleContainer>
    );

  return <Container />;
};

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    height: SCREEN_HEIGHT,
  },
});

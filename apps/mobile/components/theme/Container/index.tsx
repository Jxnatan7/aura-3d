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
  gradient = true,
  ...props
}: ContainerProps) => {
  const theme = useTheme<Theme>();

  const Container = () =>
    gradient ? (
      <LinearGradient
        colors={["#0D0D0D", "#1A1A2E", "#2D2B55", "#1C1C3A", "#111111"]}
        locations={[0, 0.25, 0.5, 0.75, 1]}
        style={styles.background}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
      >
        <LinearGradient
          colors={[
            "transparent",
            "rgba(24, 19, 45, 0.15)",
            "rgba(76, 76, 90, 0.08)",
            "transparent",
          ]}
          locations={[0, 0.3, 0.7, 1]}
          style={styles.background}
          start={{ x: 1, y: 0.2 }}
          end={{ x: 0, y: 0.8 }}
        />
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

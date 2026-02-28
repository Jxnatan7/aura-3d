import { RestyleContainer, RestyleContainerProps } from "@/components/restyle";
import { ContainerHeader, ContainerHeaderProps } from "../ContainerHeader";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
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
  const content = (
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

  if (gradient) {
    return (
      <LinearGradient
        colors={["#000000", "#1D133B", "#852063", "#DF456A", "#FF9955"]}
        locations={[0.15, 0.45, 0.65, 0.85, 1]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={styles.background}
      >
        {content}
      </LinearGradient>
    );
  }

  return content;
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

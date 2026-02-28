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

  // O conteúdo interno do container
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

  // Retorna com ou sem o gradiente em volta
  if (gradient) {
    return (
      <LinearGradient
        // Cores extraídas da imagem: Preto -> Roxo Escuro -> Magenta -> Rosa -> Laranja
        colors={["#000000", "#1D133B", "#852063", "#DF456A", "#FF9955"]}
        // Controla onde cada cor começa (o preto ocupa bastante espaço no topo)
        locations={[0.15, 0.45, 0.65, 0.85, 1]}
        // Direção levemente diagonal (do topo-esquerda para baixo-direita)
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

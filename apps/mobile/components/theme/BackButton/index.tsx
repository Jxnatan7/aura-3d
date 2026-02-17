import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { IconButton } from "../IconButton";
import { Theme } from "@/theme";
import { useTheme } from "@shopify/restyle";

export const BackButton = ({
  fallback,
  callback,
}: {
  fallback?: () => void;
  callback?: () => void;
}) => {
  const theme = useTheme<Theme>();
  const { canGoBack, back } = useRouter();
  return (
    <IconButton
      onPress={callback ? callback : canGoBack() ? back : fallback}
      icon={
        <MaterialIcons
          name="keyboard-arrow-left"
          size={30}
          color={theme.colors.mainText}
        />
      }
    />
  );
};

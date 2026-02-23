import { RestyleCard } from "@/components/restyle";
import { Model3D } from "@/services/Model3DService";
import { memo } from "react";
import { Platform } from "react-native";
import { ModelImage } from "../ModelImage";
import { SCREEN_WIDTH } from "@/constants";
import { formatMediaUrl } from "@/utils/formatMediaUrl";

export type ModelItemProps = {
  item: Model3D;
  index: number;
  onPress: (item: Model3D, glbUrl?: string) => void;
};

const CARD_WIDTH = Platform.select({
  web: (SCREEN_WIDTH - 56) / 6,
  default: (SCREEN_WIDTH - 56) / 2,
});

export const ModelItem = memo(
  ({ item, index, onPress }: ModelItemProps) => {
    const glbUrl = formatMediaUrl(item, "glb");
    const imageUrl = formatMediaUrl(item, "image");

    return (
      <RestyleCard
        variant="model"
        width={CARD_WIDTH}
        height={CARD_WIDTH}
        marginTop={index % 2 === 0 ? "l" : "none"}
        marginBottom="minus"
        overflow="hidden"
      >
        <ModelImage
          uri={imageUrl ?? ""}
          sharedTransitionTag={`image-${item._id}`}
          motiProps={{
            onPress: () => onPress(item, glbUrl),
          }}
        />
      </RestyleCard>
    );
  },
  (prevProps, nextProps) => prevProps.item._id === nextProps.item._id,
);

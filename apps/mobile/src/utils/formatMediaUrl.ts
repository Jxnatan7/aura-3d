import { Model3D } from "@/src/services/Model3DService";

export const HOST = process.env.EXPO_PUBLIC_MEDIA_HOSTNAME || "";

export const formatMediaUrl = (
  item: Model3D,
  type: "image" | "glb",
): string | undefined => {
  const needsHost =
    item.isStoredLocally && !item.modelUrls?.glb?.startsWith("https");

  if (type === "glb") {
    return needsHost ? `${HOST}${item.modelUrls?.glb}` : item.modelUrls?.glb;
  }

  const imageUrl = item.thumbnailUrl ?? item.imageUrl;
  return needsHost ? `${HOST}${imageUrl}` : imageUrl;
};

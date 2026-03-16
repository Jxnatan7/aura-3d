import { Container } from "@/src/components/theme/Container";
import Model from "@/src/components/theme/Model";
import { ModelViewer } from "@/src/components/theme/MovelViewer";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function ModelView() {
  const { push } = useRouter();

  const { glb, fbx, obj, usdz, name, id, imageUrl } = useLocalSearchParams<{
    id: string;
    name: string;
    glb?: string;
    fbx?: string;
    obj?: string;
    usdz?: string;
    imageUrl?: string;
  }>();

  const modelFormats = { glb, fbx, obj, usdz };

  return (
    <Container
      variant="screen"
      gradient
      containerHeaderProps={{ backButtonFallback: () => push("/") }}
    >
      <ModelViewer
        id={id}
        name={name}
        formats={modelFormats}
        imageUrl={imageUrl}
        sharedTransitionTag={`image-${id}`}
      >
        <Model url={glb} />
      </ModelViewer>
    </Container>
  );
}

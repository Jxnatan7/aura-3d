import { Container } from "@/components/theme/Container";
import Model from "@/components/theme/Model";
import { ModelViewer } from "@/components/theme/MovelViewer";

import { useLocalSearchParams, useRouter } from "expo-router";

export default function ModelView() {
  const { push } = useRouter();

  const { glb, fbx, obj, usdz, name, id } = useLocalSearchParams<{
    id: string;
    name: string;
    glb?: string;
    fbx?: string;
    obj?: string;
    usdz?: string;
  }>();

  const modelFormats = { glb, fbx, obj, usdz };

  return (
    <Container
      variant="screen"
      containerHeaderProps={{ backButtonFallback: () => push("/") }}
    >
      <ModelViewer id={id} name={name} formats={modelFormats}>
        <Model url={glb} />
      </ModelViewer>
    </Container>
  );
}

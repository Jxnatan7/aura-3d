import { useGLTF } from "@react-three/drei/native";
import { Asset } from "expo-asset";
import { useEffect } from "react";

export default function Model({
  url,
  onLoad,
}: {
  url?: string;
  onLoad?: () => void;
}) {
  const { scene } = useGLTF(url || "") as any;

  useEffect(() => {
    if (url) {
      Asset.fromModule(url).downloadAsync();
      useGLTF.preload(url);
    }
  }, [url]);

  useEffect(() => {
    if (onLoad) {
      requestAnimationFrame(() => {
        onLoad();
      });
    }
  }, [onLoad]);

  return <primitive object={scene} />;
}

import { useGLTF } from "@react-three/drei/native";
import { Asset } from "expo-asset";
import { useEffect } from "react";

export default function Model({ url }: { url?: string }) {
  const { scene } = useGLTF(url || "") as any;

  useEffect(() => {
    if (url) {
      Asset.fromModule(url).downloadAsync();
      useGLTF.preload(url);
    }
  }, [url]);

  return <primitive object={scene} />;
}

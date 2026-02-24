import { useFrame, useThree } from "@react-three/fiber/native";
import * as THREE from "three";

export const CameraZoom = ({ zoom }: { zoom: number }) => {
  const { camera } = useThree();
  useFrame(() => {
    camera.zoom = THREE.MathUtils.lerp(camera.zoom, zoom, 0.1);
    camera.updateProjectionMatrix();
  });
  return null;
};

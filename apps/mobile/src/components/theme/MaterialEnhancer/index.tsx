import React from "react";
import { useThree } from "@react-three/fiber/native";
import * as THREE from "three";

export const GL_CONFIG = {
  powerPreference: "high-performance",
  antialias: true,
  stencil: false,
  depth: true,
  alpha: true,
  preserveDrawingBuffer: true,
} as const;

export const MaterialEnhancer = () => {
  const { scene } = useThree();

  React.useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        child.material.envMapIntensity = 2.5;

        if (child.material.metalness !== undefined) {
          child.material.roughness = Math.max(
            0.1,
            child.material.roughness * 0.8,
          );
        }

        if (child.material.color) {
          const hsl = { h: 0, s: 0, l: 0 };
          child.material.color.getHSL(hsl);
          child.material.color.setHSL(hsl.h, Math.min(1.0, hsl.s * 1.5), hsl.l);
        }

        child.material.needsUpdate = true;
      }
    });
  }, [scene]);

  return null;
};

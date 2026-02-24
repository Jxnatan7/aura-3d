import { useRef } from "react";
import { ViewerController } from "../../../hooks/useViewerController";
import { useFrame } from "@react-three/fiber/native";
import { Platform } from "react-native";

export type InteractiveStageProps = {
  controller: ViewerController;
  children: React.ReactNode;
};

const ROTATION_SPEED = Platform.OS === "web" ? 0.005 : 0.01;

export const InteractiveStage = ({
  controller,
  children,
}: InteractiveStageProps) => {
  const groupRef = useRef<any>(null);
  const { rotationRef, buttonDirection, isInteracting, config } = controller;

  useFrame(() => {
    if (!groupRef.current) return;

    const isMovingByButton =
      buttonDirection.current.x !== 0 || buttonDirection.current.y !== 0;

    if (config.autoRotate && !isInteracting.current && !isMovingByButton) {
      rotationRef.current.y += ROTATION_SPEED;
    }

    rotationRef.current.x += buttonDirection.current.x;
    rotationRef.current.y += buttonDirection.current.y;

    groupRef.current.rotation.x +=
      (rotationRef.current.x - groupRef.current.rotation.x) * 0.1;
    groupRef.current.rotation.y +=
      (rotationRef.current.y - groupRef.current.rotation.y) * 0.1;
  });

  return <group ref={groupRef}>{children}</group>;
};

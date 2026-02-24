import { useRef, useState, useMemo } from "react";
import { Gesture } from "react-native-gesture-handler";
import { runOnJS } from "react-native-worklets";

export type Vec2 = { x: number; y: number };

export type ViewerController = {
  rotationRef: React.MutableRefObject<Vec2>;
  buttonDirection: React.MutableRefObject<Vec2>;
  isInteracting: React.MutableRefObject<boolean>;
  gestures: any;
  setDirection: (x: number, y: number) => void;
  resetRotation: () => void;
  config: {
    autoRotate: boolean;
    rotationSensitivity: number;
  };
  adjustZoom: (delta: number) => void;
  zoom: number;
};

export type UseViewerControllerProps = {
  initialRotation?: [number, number];
  rotationSensitivity?: number;
  autoRotate?: boolean;
  initialZoom?: number;
};

export const useViewerController = ({
  initialRotation = [0, 0],
  rotationSensitivity = 0.005,
  autoRotate = true,
  initialZoom = 1,
}: UseViewerControllerProps): ViewerController => {
  const rotationRef = useRef<Vec2>({
    x: initialRotation[0],
    y: initialRotation[1],
  });
  const buttonDirection = useRef<Vec2>({ x: 0, y: 0 });
  const isInteracting = useRef(false);

  const lastTranslation = useRef<Vec2>({ x: 0, y: 0 });

  const [zoom, setZoom] = useState(initialZoom);
  const baseZoom = useRef(initialZoom);

  const setDirection = (x: number, y: number) => {
    buttonDirection.current = { x, y };
  };

  const resetRotation = () => {
    buttonDirection.current = { x: 0, y: 0 };
    rotationRef.current = { x: initialRotation[0], y: initialRotation[1] };
  };

  const adjustZoom = (delta: number) => {
    setZoom((prev) => {
      const newZoom = Math.max(0.5, Math.min(prev + delta, 4));
      baseZoom.current = newZoom;
      return newZoom;
    });
  };

  const updateZoom = (scale: number) => {
    let newZoom = baseZoom.current * scale;
    newZoom = Math.max(0.5, Math.min(newZoom, 4));
    setZoom(newZoom);
  };

  const endZoom = () => {
    baseZoom.current = zoom;
  };

  const startPan = () => {
    isInteracting.current = true;
    buttonDirection.current = { x: 0, y: 0 };
    lastTranslation.current = { x: 0, y: 0 };
  };

  const updatePan = (transX: number, transY: number) => {
    const sensitivity = rotationSensitivity * 2;

    const deltaX = transX - lastTranslation.current.x;
    const deltaY = transY - lastTranslation.current.y;

    rotationRef.current.y += deltaX * sensitivity;
    rotationRef.current.x += deltaY * sensitivity;

    lastTranslation.current = { x: transX, y: transY };
  };

  const endPan = () => {
    isInteracting.current = false;
  };

  const gestures = useMemo(() => {
    const pinch = Gesture.Pinch()
      .onUpdate((e) => {
        runOnJS(updateZoom)(e.scale);
      })
      .onEnd(() => {
        runOnJS(endZoom)();
      });

    const pan = Gesture.Pan()
      .minDistance(1)
      .onStart(() => {
        runOnJS(startPan)();
      })
      .onUpdate((e) => {
        runOnJS(updatePan)(e.translationX, e.translationY);
      })
      .onEnd(() => {
        runOnJS(endPan)();
      });

    return Gesture.Simultaneous(pan, pinch);
  }, [zoom, rotationSensitivity]);

  return {
    rotationRef,
    buttonDirection,
    isInteracting,
    gestures,
    setDirection,
    resetRotation,
    config: { autoRotate, rotationSensitivity },
    zoom,
    adjustZoom,
  };
};

import { useEffect } from "react";
import { useModelStore } from "@/src/stores/modelStore";

export const useFakeProgress = (realProgress: number = 0) => {
  const fakeProgress = useModelStore((state) => state.fakeProgress);

  useEffect(() => {
    if (realProgress > fakeProgress) {
      useModelStore.getState().setFakeProgress(realProgress);
    }

    if (realProgress >= 100) return;

    const maxFakeProgress = realProgress >= 50 ? 99 : 49;

    const timer = setInterval(() => {
      const currentFake = useModelStore.getState().fakeProgress;

      if (currentFake >= maxFakeProgress) return;

      const step = Math.floor(Math.random() * 2) + 1;
      useModelStore
        .getState()
        .setFakeProgress(Math.min(currentFake + step, maxFakeProgress));
    }, 1500);

    return () => clearInterval(timer);
  }, [realProgress, fakeProgress]);

  return fakeProgress;
};

import { useState, useEffect } from "react";

export const useFakeProgress = (realProgress: number = 0) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    setDisplayProgress((prev) => Math.max(prev, realProgress));

    if (realProgress >= 100) return;
    const maxFakeProgress = realProgress >= 50 ? 99 : 49;

    const timer = setInterval(() => {
      setDisplayProgress((prev) => {
        if (prev >= maxFakeProgress) return prev;
        const step = Math.floor(Math.random() * 2) + 1;
        return Math.min(prev + step, maxFakeProgress);
      });
    }, 1500);

    return () => clearInterval(timer);
  }, [realProgress]);

  return displayProgress;
};

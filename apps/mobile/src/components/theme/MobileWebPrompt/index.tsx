import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import { GlassAlertModal } from "../GlassAlertModal";

export function MobileWebPrompt() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "web") return;

    const hasDismissed = sessionStorage.getItem("dismissedAppPrompt");
    if (hasDismissed) return;

    const userAgent = window.navigator.userAgent || window.navigator.vendor;
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent,
      );

    if (isMobile) {
      setIsVisible(true);
    }
  }, []);

  const handleCancel = () => {
    setIsVisible(false);
    if (Platform.OS === "web") {
      sessionStorage.setItem("dismissedAppPrompt", "true");
    }
  };

  const handleConfirm = () => {
    window.location.href = "exp://h9uq2gi-jxnatan-8081.exp.direct";
    setIsVisible(false);
  };

  if (!isVisible || Platform.OS !== "web") return null;

  return (
    <GlassAlertModal
      visible={isVisible}
      title="Abrir no Aplicativo?"
      message="Para uma experiência mais rápida e fluida, continue no nosso aplicativo nativo."
      cancelText="Cancelar"
      confirmText="Abrir App"
      onCancel={handleCancel}
      onConfirm={handleConfirm}
    />
  );
}

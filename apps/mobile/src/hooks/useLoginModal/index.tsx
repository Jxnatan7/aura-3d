import { useState } from "react";
import { useRouter } from "expo-router";
import { GlassAlertModal } from "@/src/components/theme/GlassAlertModal";

const useLoginModal = (
  message: string = "Para executar essa mudança, você precisa estar autenticado.",
) => {
  const { push } = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  const showModal = () => setIsVisible(true);
  const hideModal = () => setIsVisible(false);

  const handleConfirm = () => {
    hideModal();
    push("/(tabs)/auth");
  };

  const LoginAlertComponent = () => (
    <GlassAlertModal
      visible={isVisible}
      title="Fazer login"
      message={message}
      onCancel={hideModal}
      onConfirm={handleConfirm}
    />
  );

  return {
    showModal,
    LoginAlertComponent,
  };
};

export default useLoginModal;

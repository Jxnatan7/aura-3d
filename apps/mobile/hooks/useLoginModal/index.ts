import { useRouter } from "expo-router";
import { Alert } from "react-native";

const useLoginModal = (
  message: string = "Para executar essa mudança, você precisa estar autenticado.",
) => {
  const { push } = useRouter();
  const showModal = () =>
    Alert.alert("Fazer login", message, [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Entrar",
        onPress: () => push("/login"),
      },
    ]);

  return {
    showModal,
  };
};

export default useLoginModal;

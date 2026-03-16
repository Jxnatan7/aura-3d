import { Feather } from "@expo/vector-icons";
import { IconButton } from "../IconButton";
import { useLogout } from "@/src/hooks/useLogout";

export function LogoutButton() {
  return (
    <IconButton
      width={40}
      height={40}
      glass={false}
      onPress={useLogout()}
      icon={<Feather name="log-out" size={24} color="#fff" />}
    />
  );
}

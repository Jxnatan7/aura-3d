import { useAuthStore } from "@/src/stores/authStore";

export function useLogout() {
  const { logout } = useAuthStore();
  return () => {
    logout();
  };
}

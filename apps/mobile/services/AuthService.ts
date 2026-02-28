import axiosClient from "@/api/axiosClient";
import { User } from "@/stores/authStore";

export type LoginResponse = {
  token: string;
  user: User;
};

export type RegisterResponse = {
  token: string;
  user: User;
};

export const AuthService = {
  login: async (phone: string, password: string) => {
    const { data } = await axiosClient.post<LoginResponse>("/auth/login", {
      phone,
      password,
    });
    return data;
  },
  googleLogin: async (accessToken: string) => {
    const { data } = await axiosClient.post<LoginResponse>("/auth/google", {
      accessToken,
    });
    return data;
  },

  register: async ({
    name,
    email,
    phone,
    password,
  }: {
    name: string;
    email?: string;
    phone: string;
    password: string;
  }) => {
    const { data } = await axiosClient.post<RegisterResponse>(
      "/auth/register",
      {
        name,
        email,
        password,
        phone,
      },
    );
    return data;
  },
};

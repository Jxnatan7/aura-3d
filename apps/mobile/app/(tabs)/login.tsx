import React from "react";
import { useRouter } from "expo-router";
import { Container } from "@/components/theme/Container";
import { Text } from "@/components/restyle";
import { useAuthActions, useUser } from "@/contexts/AuthProvider";

export default function Login() {
  const user = useUser();
  const { replace, push } = useRouter();
  const { login } = useAuthActions();

  const onSubmit = (values: any, { setFieldError }: any) => {
    const cleanPhone = values.phone.replace(/\D/g, "");

    try {
      login(cleanPhone, values.password).then(() => {
        replace("/");
      });
    } catch (err: any) {
      const message = "Erro ao realizar login.";
      setFieldError("password", message);
    }
  };

  if (user) {
    replace("/");
  }

  return (
    <Container variant="screen" hideHeader>
      <Text variant="containerHeader" mt="xxxl">
        Faça o seu Login
      </Text>
    </Container>
  );
}

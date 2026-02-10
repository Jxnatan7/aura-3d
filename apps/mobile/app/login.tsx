import React from "react";
import { useRouter } from "expo-router";
import { Container } from "@/components/theme/Container";
import { Text } from "@/components/restyle";
import Button from "@/components/theme/Button";
import { Form, FormTextInput, FormButton } from "@/components/theme/Form";
import { loginFormValidation } from "@/utils/schemaValidation";
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
    <Container
      variant="screen"
      containerHeaderProps={{ backButtonFallback: () => push("/") }}
    >
      <Text variant="containerHeader" mt="xxxl">
        Faça o seu Login
      </Text>

      <Form
        initialValues={{ phone: "", password: "" }}
        validate={loginFormValidation}
        onSubmit={onSubmit}
        containerProps={{ marginTop: "xxl" }}
      >
        <FormTextInput
          name="phone"
          marginTop="m"
          label="Telefone"
          placeholder="Telefone"
          keyboardType="numeric"
          autoCapitalize="none"
          mask="phone"
          containerProps={{ marginTop: "m", paddingHorizontal: "m" }}
        />

        <FormTextInput
          name="password"
          placeholder="*********"
          label="Senha"
          secureTextEntry
          containerProps={{ marginTop: "m", paddingHorizontal: "m" }}
        />
        <FormButton variant="primary" text="Continuar" marginTop="xxxl" />
      </Form>
      <Button
        alignSelf="center"
        variant="secondary"
        text="Criar Conta"
        marginTop="s"
        onPress={() => push("/register")}
      />
    </Container>
  );
}

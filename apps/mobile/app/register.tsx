import React from "react";
import { Text } from "@/src/components/restyle";
import { Container } from "@/src/components/theme/Container";
import { useRouter } from "expo-router";
import { Form, FormTextInput, FormButton } from "@/src/components/theme/Form";
import { registerFormValidation } from "@/src/utils/schemaValidation";
import { useAuthActions, useUser } from "@/src/contexts/AuthProvider";

export default function Register() {
  const user = useUser();
  const { replace, push } = useRouter();
  const { register } = useAuthActions();

  const onSubmit = async (
    values: { name: string; email: string; password: string; phone: string },
    { setSubmitting, setFieldError }: any,
  ) => {
    setSubmitting(true);

    const cleanPhone = values.phone.replace(/\D/g, "");

    try {
      await register({
        name: values.name,
        phone: cleanPhone,
        email: values.email,
        password: values.password,
      });

      replace("/");
    } catch (err: any) {
      const message = "Erro ao realizar cadastro. Verifique suas credenciais.";
      setFieldError("password", message);
    } finally {
      setSubmitting(false);
    }
  };

  if (user) {
    replace("/");
  }

  return (
    <Container
      variant="screen"
      containerHeaderProps={{ backButtonFallback: () => push("/login") }}
    >
      <Text variant="header" mt="xxxl">
        Crie a sua conta
      </Text>

      <Form
        initialValues={{ name: "", email: "", password: "", phone: "" }}
        validate={registerFormValidation}
        onSubmit={onSubmit}
      >
        <FormTextInput
          name="name"
          autoFocus
          marginTop="xl"
          placeholder="Nome"
          autoCapitalize="none"
        />

        <FormTextInput
          name="phone"
          marginTop="m"
          placeholder="Telefone"
          keyboardType="numeric"
          autoCapitalize="none"
          mask="phone"
        />

        <FormTextInput
          name="password"
          marginTop="m"
          placeholder="Senha"
          secureTextEntry
        />

        <FormButton variant="primary" text="Continuar" marginTop="xxxl" />
      </Form>
    </Container>
  );
}

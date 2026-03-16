import React from "react";
import { Formik, FormikConfig, FormikValues, useFormikContext } from "formik";
import { Box, BoxProps, Text } from "@/src/components/restyle";
import { TextInput } from "@/src/components/theme/TextInput";
import Button from "@/src/components/theme/Button";
import { maskPhone } from "@/src/utils/masks";

type FormProps<T extends FormikValues> = FormikConfig<T> & {
  children: React.ReactNode;
  containerProps?: BoxProps;
};

export function Form<T extends FormikValues>({
  children,
  containerProps,
  ...props
}: FormProps<T>) {
  return (
    <Formik {...props}>
      {() => (
        <Box width="100%" alignItems="center" {...containerProps}>
          {children}
        </Box>
      )}
    </Formik>
  );
}

type FormInputProps = React.ComponentProps<typeof TextInput> & {
  name: string;
  mask?: "phone";
};

export function FormTextInput({
  name,
  mask,
  onChangeText,
  ...rest
}: FormInputProps) {
  const { setFieldValue, handleBlur, values, errors, touched, isSubmitting } =
    useFormikContext<any>();

  const errorMessage =
    touched[name] && errors[name] ? (errors[name] as string) : null;

  const handleChangeText = (text: string) => {
    let formattedText = text;

    if (mask === "phone") {
      formattedText = maskPhone(text);
    }

    setFieldValue(name, formattedText);

    if (onChangeText) {
      onChangeText(formattedText);
    }
  };

  return (
    <>
      <TextInput
        value={values[name]}
        onChangeText={handleChangeText}
        onBlur={handleBlur(name)}
        editable={!isSubmitting}
        {...rest}
      />
      {errorMessage && (
        <Text
          maxWidth={450}
          mt="s"
          variant="label-error"
          color="error"
          paddingHorizontal="m"
        >
          {errorMessage}
        </Text>
      )}
    </>
  );
}

type FormSubmitProps = React.ComponentProps<typeof Button> & {
  text: string;
};

export function FormButton({
  text,
  disabled,
  variant = "primary",
  ...rest
}: FormSubmitProps) {
  const { handleSubmit, isSubmitting } = useFormikContext();

  return (
    <Button
      variant={variant}
      text={text}
      onPress={() => handleSubmit()}
      disabled={isSubmitting || disabled}
      {...rest}
    />
  );
}

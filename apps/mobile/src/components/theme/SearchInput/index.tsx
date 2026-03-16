import { TextInput, TextInputProps } from "../TextInput";
import Feather from "@expo/vector-icons/Feather";
import theme from "@/theme";

export type SearchInputProps = TextInputProps & {
  hideIcon?: boolean;
  iconProps?: any;
};

const Icon = ({ ...props }) => (
  <Feather
    name="search"
    size={24}
    color={theme.colors.inputIconLight}
    {...props}
  />
);

export const SearchInput = ({
  hideIcon = false,
  iconProps,
  ...props
}: SearchInputProps) => {
  return (
    <TextInput
      placeholder="Pesquisar"
      icon={!hideIcon && <Icon {...iconProps} />}
      {...props}
    />
  );
};

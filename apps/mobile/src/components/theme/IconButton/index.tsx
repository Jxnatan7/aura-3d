import Button, { ButtonProps } from "../Button";

export type IconButtonProps = {
  icon: React.ReactNode;
} & ButtonProps;

export const IconButton = ({ icon, ...props }: IconButtonProps) => {
  return (
    <Button variant="icon" {...props}>
      {icon}
    </Button>
  );
};

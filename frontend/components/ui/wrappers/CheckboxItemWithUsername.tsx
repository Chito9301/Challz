import * as React from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";

export interface CheckboxItemWithUsernameProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem> {
  username?: string; // prop personalizada
}

const CheckboxItemWithUsername = React.forwardRef<
  HTMLDivElement,
  CheckboxItemWithUsernameProps
>((props, ref) => {
  const { username, ...restProps } = props;

  // Puedes usar `username` internamente para lógica, estilos o efectos si quieres
  // Ejemplo: console.log("Username en CheckboxItem:", username);

  return <ContextMenuPrimitive.CheckboxItem ref={ref} {...restProps} />;
});

CheckboxItemWithUsername.displayName = "CheckboxItemWithUsername";

export default CheckboxItemWithUsername;

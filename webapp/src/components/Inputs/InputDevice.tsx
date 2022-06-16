import { FC } from "react";
import { useHADeviceRegistry } from "haService";
import {
  InputAutoComplete,
  InputAutoCompletePropsBase,
} from "./InputAutoComplete";

export type InputDeviceProps = InputAutoCompletePropsBase;

export const InputDevice: FC<InputDeviceProps> = (props) => {
  // state
  const dr = useHADeviceRegistry();

  return (
    <InputAutoComplete
      {...props}
      label={props.label ?? "Device ID"}
      getID={dr.getID}
      getLabel={dr.getLabel}
      options={dr.getOptions()}
    />
  );
};

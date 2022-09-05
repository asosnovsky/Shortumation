import { FC } from "react";
import { useHADeviceRegistry } from "services/haService";
import { useLang } from "services/lang";
import {
  InputAutoComplete,
  InputAutoCompletePropsBase,
} from "./InputAutoComplete";

export type InputDeviceProps = InputAutoCompletePropsBase;

export const InputDevice: FC<InputDeviceProps> = (props) => {
  // state
  const lang = useLang();
  const dr = useHADeviceRegistry();
  return (
    <InputAutoComplete
      {...props}
      label={props.label ?? lang.get("DEVICE")}
      getID={dr.getID}
      getLabel={dr.getLabel}
      options={dr.getOptions()}
    />
  );
};

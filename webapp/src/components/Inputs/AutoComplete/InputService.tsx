import { FC } from "react";
import { useHAServices } from "haService";
import {
  InputAutoComplete,
  InputAutoCompletePropsBase,
} from "./InputAutoComplete";
import { prettyName } from "utils/formatting";
import { useLang } from "lang";

export type InputServiceProps = InputAutoCompletePropsBase & {
  multiple?: false;
};

export const InputService: FC<InputServiceProps> = (props) => {
  const services = useHAServices();
  const lang = useLang();
  return (
    <InputAutoComplete
      {...props}
      label={props.label ?? lang.get("SERVICE")}
      options={services.getOptions()}
      getID={services.getID}
      getLabel={services.getLabel}
      groupBy={(opt) => (typeof opt !== "string" ? prettyName(opt.domain) : "")}
    />
  );
};

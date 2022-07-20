import { FC } from "react";
import {
  InputAutoComplete,
  InputAutoCompletePropsBase,
} from "./InputAutoComplete";
import { useHAAreas } from "haService/AreaRegistry";

export type InputAreaProps = InputAutoCompletePropsBase & {
  restrictToDomain?: string[];
  restrictedIntegrations?: string[];
};

export const InputArea: FC<InputAreaProps> = (props) => {
  // state
  const areas = useHAAreas();
  return (
    <InputAutoComplete
      {...props}
      label={props.label ?? "Area"}
      getID={areas.getID}
      getLabel={areas.getLabel}
      options={areas.getOptions()}
      onlyShowLabel
    />
  );
};

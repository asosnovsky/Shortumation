import { FC } from "react";
import {
  InputAutoComplete,
  InputAutoCompletePropsBase,
} from "./InputAutoComplete";
import { useHAAreas } from "haService/AreaRegistry";

export type InputAreaProps = InputAutoCompletePropsBase & {
  restrictToDomain?: string[];
};

export const InputArea: FC<InputAreaProps> = (props) => {
  // state
  const areas = useHAAreas();
  return (
    <InputAutoComplete
      {...props}
      validateOption={(v) => areas.validateOptions(v, props.restrictToDomain)}
      options={areas.getOptions(props.restrictToDomain)}
      getID={areas.getID}
      getLabel={areas.getLabel}
      onlyShowLabel
    />
  );
};

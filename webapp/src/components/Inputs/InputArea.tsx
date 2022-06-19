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
  console.log(areas);
  return (
    <InputAutoComplete
      {...props}
      validateOption={(v) => areas.validateOptions(v)}
      options={areas.getOptions()}
      getID={areas.getID}
      getLabel={areas.getLabel}
      onlyShowLabel
    />
  );
};

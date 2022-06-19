import { FC } from "react";
import { useHAEntities } from "haService/HAEntities";
import {
  InputAutoComplete,
  InputAutoCompletePropsBase,
} from "./InputAutoComplete";
import { prettyName } from "utils/formatting";

export type InputEntityProps = InputAutoCompletePropsBase & {
  restrictToDomain?: string[];
  restrictedIntegrations?: string[];
  preSelectedEntityIds?: string[];
};

export const InputEntity: FC<InputEntityProps> = (props) => {
  // state
  const entities = useHAEntities();
  let options = entities.getOptions(
    props.restrictToDomain,
    props.restrictedIntegrations
  );
  if (props.preSelectedEntityIds) {
    options = options.filter((opt) =>
      props.preSelectedEntityIds?.includes(entities.getID(opt))
    );
  }
  const validateOptions = (v: string[]): null | string[] => {
    const errors: string[] = [];
    if (props.preSelectedEntityIds) {
      v.forEach((eid) => {
        if (!props.preSelectedEntityIds?.includes(eid)) {
          errors.push(`"${eid}" is not a valid selection`);
        }
      });
    }
    errors.concat(
      entities.validateOptions(
        v,
        props.restrictToDomain,
        props.restrictedIntegrations
      ) ?? []
    );
    if (errors.length > 0) {
      return errors;
    }
    return null;
  };
  return (
    <InputAutoComplete
      {...props}
      validateOption={validateOptions}
      options={options}
      getID={entities.getID}
      getLabel={entities.getLabel}
      groupBy={(opt) => (typeof opt !== "string" ? prettyName(opt.domain) : "")}
    />
  );
};

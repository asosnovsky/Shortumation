import { FC } from "react";
import { useHAEntities } from 'haService';
import { InputAutoComplete, InputAutoCompletePropsBase } from './InputAutoComplete';
import { prettyName } from "utils/formatting";

export type InputEntityProps = InputAutoCompletePropsBase & {
    restrictToDomain?: string[],
}

export const InputEntity: FC<InputEntityProps> = props => {
    // state
    const entities = useHAEntities();
    return <InputAutoComplete
        {...props}
        validateOption={v => entities.validateOptions(v, props.restrictToDomain)}
        options={entities.getOptions(props.restrictToDomain)}
        getID={entities.getID}
        getLabel={entities.getLabel}
        groupBy={opt => (typeof opt !== 'string') ? prettyName(opt.domain) : ''}
    />
}


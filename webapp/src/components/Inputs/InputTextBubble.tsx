import { FC, useState } from "react";
import InputText from "./InputText";
import { useInputBubblesStyles } from "./styles";

export interface Props {
  label: string;
  textBoxFor?: string;
  value: string | string[];
  onChange: (v: string[]) => void;
  additionalTooltipFilters?: Record<string, string>;
}
export default function InputTextBubble({
  value = "",
  label,
  textBoxFor,
  onChange,
  additionalTooltipFilters = {},
}: Props) {
  const { classes } = useInputBubblesStyles({});
  let selected: string[];
  if (typeof value === 'string') {
    selected = [value]
  } else {
    selected = value
  }
  const [text, setText] = useState('');
  const addNew = () => {
    if (text) {
      onChange([text].concat(selected))
      setText("")
    }
  };

  return <InputText
    label={label}
    value={text}
    textBoxFor={textBoxFor}
    onChange={t => setText(t)}
    onEnter={() => addNew()}
    additionalTooltipFilters={additionalTooltipFilters}
  >
    <div className={classes.bubbles}>
      {selected.map((s, i) => <div className={classes.bubble} onClick={() => onChange([
        ...selected.slice(0, i),
        ...selected.slice(i + 1),
      ])}>
        {s}
        <span className={classes.deleteIcon}>X</span>
      </div>)}
    </div>
    <button className={classes.addBtn} onClick={() => addNew()}>+</button>
  </InputText>
}

export const InputEntity: FC<{
  value: string | string[];
  onChange: (v: string[]) => void;
}> = ({
  value,
  onChange,
}) => <InputTextBubble
      value={value}
      onChange={onChange}
      label="Entity ID"
      textBoxFor="entity_id"
    />

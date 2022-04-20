import { ArrowIcon } from "components/Icons";
import InputWrapper from "./InputWrapper";
import { useInputMultiSelectStyles } from "./styles";
import { useState } from 'react';


export interface Props<T extends string> {
  label: string;
  selected: Array<number>;
  options: readonly T[];
  onChange: (i: Array<number>) => void;
  max?: number;
  id?: string;
  className?: string;
}
export default function InputMultiSelect<T extends string>({
  selected = [], options, onChange, label, max,
  ...selattr
}: Props<T>) {
  // state
  const [open, setOpen] = useState(false);

  // alias
  const maxedOut = max ? selected.length >= max : false;
  const toggle = () => setOpen(!open);

  // style
  const { classes } = useInputMultiSelectStyles({
    open,
    selected,
    maxedOut,
  });


  return <div className={classes.root}>
    <div className={classes.input} onClick={toggle}>
      <label>{label}</label>
      <span className={classes.numberSelected}>{selected.length}</span>
      <ArrowIcon color="white" className={classes.arrow} />
      <div className={classes.optionsWrapper}>
        {options.map((v, i) => {
          const selectedCount = selected.indexOf(i);
          const isSelected = selectedCount > -1;
          return <div
            key={i}
            className={[classes.option, isSelected ? 'selected' : 'unselected'].join(' ')}
            onClick={() => {
              if (!isSelected) {
                if (!maxedOut) {
                  onChange([...selected, i])
                }
              } else {
                onChange(
                  selected.slice(0, selectedCount).concat(selected.slice(selectedCount + 1))
                )
              }
            }}
          >
            <span>{v}</span>
            <span>{selectedCount}</span>
          </div>
        })}
      </div>
    </div>
  </div>
}

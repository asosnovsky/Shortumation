import { ArrowIcon } from "components/Icons";
import { useInputMultiSelectStyles } from "./styles";
import { useState } from "react";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import { useSnackbar } from "notistack";

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
  selected = [],
  options,
  onChange,
  label,
  max = 3,
}: Props<T>) {
  // alias
  const snackbr = useSnackbar();
  return (
    <Autocomplete
      multiple
      options={options}
      value={selected.map((i) => options[i])}
      onChange={(_, newValues: T[] = []) => {
        if (newValues.length > max) {
          snackbr.enqueueSnackbar("Can only select up to 3 tags", {
            variant: "warning",
            autoHideDuration: 1500,
          });
        }
        onChange(
          newValues
            .map((v) => options.indexOf(v))
            .filter((v) => v > -1)
            .slice(0, max)
        );
      }}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={<CheckBoxOutlineBlankIcon />}
            checkedIcon={<CheckBoxIcon />}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option}
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params} label={label} variant="filled" />
      )}
    />
  );
  // style
  // const { classes } = useInputMultiSelectStyles({
  //   open,
  //   selected,
  //   maxedOut,
  // });

  // return <div className={classes.root}>
  //   <div className={classes.input} onClick={toggle}>
  //     <label>{label}</label>
  //     <span className={classes.numberSelected}>{selected.length}</span>
  //     <ArrowIcon color="white" className={classes.arrow} />
  //     <div className={classes.optionsWrapper}>
  //       {options.map((v, i) => {
  //         const selectedCount = selected.indexOf(i);
  //         const isSelected = selectedCount > -1;
  //         return <div
  //           key={i}
  //           title={(maxedOut && !isSelected) ? `Maximum allowed to select is ${max}.` : isSelected ? `Unselect ${v}` : `Select ${v}`}
  //           className={[classes.option, isSelected ? 'selected' : 'unselected'].join(' ')}
  //           onClick={() => {
  //             if (!isSelected) {
  //               if (!maxedOut) {
  //                 onChange([...selected, i])
  //               }
  //             } else {
  //               onChange(
  //                 selected.slice(0, selectedCount).concat(selected.slice(selectedCount + 1))
  //               )
  //             }
  //           }}
  //         >
  //           <span>{v}</span>
  //           <span>{selectedCount}</span>
  //         </div>
  //       })}
  //     </div>
  //   </div>
  // </div>
}

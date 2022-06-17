import "./InputAutoComplete.css";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import { Badge } from "@mui/material";
import { SearchItem } from "./extras";
import { ReactNode } from "react";
import { prettyName } from "utils/formatting";

export type BaseOption<T = {}> = {
  id: string;
  label: string;
} & T;
export type Option<T = {}> = string | BaseOption<T>;
export type InputAutoCompleteProps<T extends Option<any>> = {
  validateOption?: (v: string[]) => string[] | null;
  groupBy?: (opt: T) => string;
  options: T[];
  getLabel?: (opt: T) => string;
  getID?: (opt: T) => string;
  helperText?: string;
  endAdornment?: ReactNode;
  required?: boolean;
  onlyShowLabel?: boolean;
} & InputAutoCompletePropsBase;
export type InputAutoCompletePropsBase = {
  label?: string;
  className?: string;
} & (
  | {
      value: string | null;
      multiple?: false;
      onChange: (v: string | null) => void;
    }
  | {
      value: string | string[];
      multiple: true;
      onChange: (v: string[]) => void;
    }
);

export function computeSimilarity(
  text: string,
  optId: string,
  optLabel: string
) {
  let similarityScore = 0;
  const lowCaseId = optId.toLocaleLowerCase();
  const lowCaseLabel = optLabel.toLocaleLowerCase();
  for (const segment of text.toLocaleLowerCase().split(" ")) {
    if (lowCaseId.includes(segment)) {
      similarityScore += lowCaseId.length / lowCaseId.length;
    }
    if (lowCaseLabel.includes(segment)) {
      similarityScore += lowCaseLabel.length / lowCaseLabel.length;
    }
  }
  return similarityScore;
}

export function InputAutoComplete<T extends Option>(
  props: InputAutoCompleteProps<T>
) {
  // aliases
  const getID = (opt: T): string => {
    if (props.getID) {
      return props.getID(opt);
    }
    if (typeof opt === "string") {
      return opt;
    }
    return opt.id;
  };
  const getLabel = (opt: T): string => {
    if (props.getLabel) {
      return props.getLabel(opt);
    }
    if (typeof opt === "string") {
      return opt;
    }
    return opt.label;
  };
  // processing of inputs
  const value = Array.isArray(props.value)
    ? props.value
    : !!props.value
    ? [props.value]
    : [];
  const errors = props.validateOption ? props.validateOption(value) : null;
  const options = props.options
    .filter((opt) => !value.includes(getID(opt)))
    .sort((a, b) => {
      return getID(a) > getID(b) ? 1 : -1;
    });

  // processing of errors
  let helperText = props.helperText ?? <></>;
  let error: boolean = false;
  if (errors !== null) {
    error = true;
    if (errors.length > 0) {
      helperText = (
        <Badge
          className="input-autocomplete--errors"
          badgeContent={errors.length}
          color="error"
        >
          <ul title={errors.join(", and")}>
            {errors.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </Badge>
      );
    }
  }
  // events
  const onChange = (_e: any, v: any) => {
    const cleanValue: string[] =
      v === null
        ? []
        : Array.isArray(v)
        ? v.map((opt) => {
            if (typeof opt === "string") {
              return opt;
            }
            return opt.id;
          })
        : [v];
    if (props.multiple) {
      props.onChange(cleanValue);
    } else {
      props.onChange(cleanValue[cleanValue.length - 1]);
    }
  };
  return (
    <Autocomplete
      className={["input-autocomplete", props.className ?? ""].join(" ")}
      multiple={true}
      freeSolo
      value={value}
      options={options}
      onChange={onChange}
      getOptionLabel={getLabel as any}
      filterOptions={(opts, s) => {
        const searchTerm = s.inputValue;
        if (!searchTerm) {
          return opts;
        }
        return opts
          .map((opt) => {
            return {
              opt,
              similarityScore: computeSimilarity(
                searchTerm,
                getID(opt),
                getLabel(opt)
              ),
            };
          })
          .filter((opt) => opt.similarityScore > 0)
          .sort((a, b) => {
            return a.similarityScore < b.similarityScore ? 1 : -1;
          })
          .map(({ opt }) => opt);
      }}
      groupBy={props.groupBy}
      renderOption={(listProps, option, { inputValue }) => {
        const label = getLabel(option);
        const id = getID(option);

        return (
          <>
            <SearchItem
              key={label + id}
              listProps={listProps}
              id={id}
              label={label}
              searchTerm={inputValue}
              onlyShowLabel={props.onlyShowLabel}
            />
          </>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="filled"
          required={props.required}
          label={props.label ?? "Entity ID"}
          helperText={helperText}
          error={error}
        />
      )}
      renderTags={(tagValue, getTagProps) => {
        const inner = (
          <div className="input-autocomplete--tags">
            {tagValue.map((option, index) => {
              const label = getLabel(option);
              const id = getID(option);
              const tagProps = getTagProps({ index });
              tagProps.className += " input-autocomplete--chip";
              return (
                <Chip
                  size="medium"
                  label={
                    <>
                      {id === label ? (
                        <span>{prettyName(label)}</span>
                      ) : (
                        <b>{label}</b>
                      )}
                      {id !== label && !props.onlyShowLabel && (
                        <small>{id}</small>
                      )}
                    </>
                  }
                  {...tagProps}
                />
              );
            })}
          </div>
        );
        if (props.multiple) {
          return (
            <Badge badgeContent={tagValue.length} color="info">
              {inner}
            </Badge>
          );
        } else {
          return inner;
        }
      }}
    />
  );
}

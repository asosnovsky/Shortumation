import "./ServiceEditorField.css";
import { FC } from "react";
import { ServiceEditorOption } from "./options";
import InputText from "components/Inputs/InputText";
import InputNumber from "components/Inputs/InputNumber";
import { IconButton } from "@mui/material";
import { RemoveCircle } from "@mui/icons-material";
import { InputAutoComplete, Option } from "components/Inputs/InputAutoComplete";
import { prettyName } from "utils/formatting";

export type ServiceEditorFieldProps = {
  option: ServiceEditorOption;
  value: any;
  onChange: (v: any) => void;
  onRemove?: () => void;
};
export const ServiceEditorField: FC<ServiceEditorFieldProps> = ({
  option,
  value,
  onChange,
  onRemove,
}) => {
  const description = option.data.description ?? "";
  const isRequired = !onRemove;
  const label = option.label;
  let example = "";
  const removeIcon = !onRemove ? (
    <></>
  ) : (
    <IconButton className="service-editor--field--remove" onClick={onRemove}>
      <RemoveCircle />
    </IconButton>
  );
  example = option.data.example ? `Example: ${option.data.example}` : "";
  if (option.data.selector?.number) {
    return (
      <InputNumber
        className="service-editor--field"
        label={label}
        value={value ?? option.data.default}
        min={option.data.selector.number.min}
        max={option.data.selector.number.max}
        step={option.data.selector.number.step}
        unit={option.data.selector.number.unit_of_measurement}
        onChange={onChange}
        required={isRequired}
        placeholder={example}
      />
    );
  }
  if (option.data.selector?.select) {
    return (
      <InputAutoComplete
        className="service-editor--field"
        label={label}
        value={value}
        onChange={onChange}
        endAdornment={removeIcon}
        required={isRequired}
        options={option.data.selector.select.options.map<Option>((opt) => {
          if (typeof opt === "string") {
            return {
              id: opt,
              label: prettyName(opt),
            };
          }
          return {
            id: opt.value,
            label: opt.label,
          };
        })}
        getLabel={(opt) => {
          if (typeof opt === "string") {
            return prettyName(opt);
          }
          return opt.label;
        }}
        onlyShowLabel
      />
    );
  }
  return (
    <InputText
      className="service-editor--field"
      label={label}
      title={description}
      helperText={description}
      value={value ?? option.data.default}
      onChange={onChange}
      placeholder={example}
      required={isRequired}
      endAdornment={removeIcon}
    />
  );
};

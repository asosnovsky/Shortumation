import "./ServiceEditorField.css";
import { FC } from "react";
import { ServiceEditorOption } from "./options";
import InputText from "components/Inputs/InputText";
import InputNumber from "components/Inputs/InputNumber";
import { IconButton } from "@mui/material";
import { RemoveCircle } from "@mui/icons-material";
import { InputAutoComplete, Option } from "components/Inputs/InputAutoComplete";
import { prettyName } from "utils/formatting";
import InputBoolean from "components/Inputs/InputBoolean";
import { SelectorNumber, SelectorText } from "haService/fieldTypes";
import InputYaml from "components/Inputs/InputYaml";

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
    <IconButton
      className="service-editor--field--remove"
      onClick={onRemove}
      title={`Remove ${label}`}
    >
      <RemoveCircle />
    </IconButton>
  );
  example = option.data.example ? `Example: ${option.data.example}` : "";
  const prop = {
    className: "service-editor--field",
    label,
    title: description,
    helperText: (
      <div className="service-editor--field--description">{description}</div>
    ),
    value: value ?? option.data.default,
    onChange: onChange,
    required: isRequired,
    placeholder: example,
    endAdornment: removeIcon,
  };
  if (option.data.selector) {
    if ("number" in option.data.selector) {
      const options: Partial<SelectorNumber> =
        option.data.selector.number ?? {};
      return (
        <InputNumber
          {...prop}
          min={options.min}
          max={options.max}
          step={options.step}
        />
      );
    }
    if (option.data.selector?.select) {
      return (
        <InputAutoComplete
          {...prop}
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
    } else if ("text" in option.data.selector) {
      const options: Partial<SelectorText> = option.data.selector.text ?? {};
      return <InputText {...prop} multiline={options.multiline} />;
    } else if ("boolean" in option.data.selector) {
      return <InputBoolean {...prop} />;
    } else if ("object" in option.data.selector) {
      return <InputYaml {...prop} />;
    }
  }
  return <InputText {...prop} />;
};

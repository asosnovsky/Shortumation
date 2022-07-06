import "./ServiceEditorField.css";
import { FC, useRef } from "react";
import { ServiceEditorOption } from "./options";
import InputText from "components/Inputs/InputText";
import InputNumber from "components/Inputs/InputNumber";
import { RemoveCircle } from "@mui/icons-material";
import { InputAutoComplete, Option } from "components/Inputs/InputAutoComplete";
import { prettyName } from "utils/formatting";
import InputBoolean from "components/Inputs/InputBoolean";
import { SelectorNumber, SelectorText } from "haService/fieldTypes";
import InputYaml from "components/Inputs/InputYaml";
import { useSnackbar } from "notistack";
import { InputEntity } from "components/Inputs/InputEntities";
import { ButtonIcon } from "components/Icons/ButtonIcons";

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
  const snackr = useSnackbar();
  const msgRef = useRef<Record<string, boolean>>({});
  const description = option.data.description ?? "";
  const isRequired = !onRemove;
  const label = option.label;
  let example = "";
  const removeIcon = !onRemove ? (
    <></>
  ) : (
    <ButtonIcon
      className="service-editor--field--remove"
      onClick={onRemove}
      title={`Remove ${label}`}
      icon={<RemoveCircle color="secondary" />}
    />
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
    } else if ("entity" in option.data.selector) {
      const options = option.data.selector.entity ?? {};
      return (
        <InputEntity
          {...prop}
          multiple={false}
          restrictToDomain={options.domain ? [options.domain] : undefined}
          restrictedIntegrations={
            options.integration ? [options.integration] : undefined
          }
        />
      );
    }
  }
  if (option.data.selector) {
    if (!msgRef.current[JSON.stringify(option.data.selector)]) {
      msgRef.current[JSON.stringify(option.data.selector)] = true;
      snackr.enqueueSnackbar(
        <span>
          "{JSON.stringify(Object.keys(option.data.selector))}" is of a
          unimplemented! <br />
          Please report this to the maintainers.{" "}
          <b>For now, we leave you with a generic textbox!</b> <br />
          DEBUG="{JSON.stringify(option.data.selector)}"
        </span>,
        {
          variant: "warning",
          persist: true,
        }
      );
    }
  }
  return <InputText {...prop} />;
};

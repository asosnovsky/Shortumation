import "./InputDeviceCapabilties.css";
import { HaFormSchema } from "haService/types";
import { useSnackbar } from "notistack";
import { useRef } from "react";
import { prettyName } from "utils/formatting";
import { InputAutoComplete, Option } from "./InputAutoComplete";
import InputBoolean from "components/Inputs/Base/InputBoolean";
import { InputTime } from "../Base/InputTime";
import InputNumber from "components/Inputs/Base/InputNumber";
import InputText from "components/Inputs/Base/InputText";

export type InputDeviceCapabiltiesProps<T extends Record<string, any>> = {
  defn: HaFormSchema[];
  state: T;
  setState: (s: T) => void;
};
export function InputDeviceCapabilties<T extends Record<string, any>>(
  props: InputDeviceCapabiltiesProps<T>
) {
  const snackr = useSnackbar();
  const msgRef = useRef<Record<string, boolean>>({});
  return (
    <div className="input-device-caps">
      {props.defn.map((def, i) => {
        const prop = {
          key: String(i),
          className: "input-device-cap",
          label:
            prettyName(def.name) +
            " " +
            (JSON.stringify(def.description) ?? ""),
          required: def.required,
          placeholder: def.default,
          value: props.state[def.name],
          onChange: (v: any) =>
            props.setState({
              ...props.state,
              [def.name]: v,
            }),
        };
        if (def.type === "boolean") {
          return <InputBoolean {...prop} />;
        } else if (def.type === "string") {
          return <InputText {...prop} />;
        } else if (def.type === "integer") {
          return (
            <InputNumber
              {...prop}
              step={1}
              max={def.valueMax}
              min={def.valueMin}
            />
          );
        } else if (def.type === "float") {
          return <InputNumber {...prop} step={0.01} />;
        } else if (def.type === "constant") {
          return (
            <InputText {...prop} value={def.value ?? props.state[def.name]} />
          );
        } else if (def.type === "positive_time_period_dict") {
          return <InputTime {...prop} />;
        } else if (def.type === "select") {
          return (
            <InputAutoComplete
              {...prop}
              multiple={false}
              options={def.options.map(([value, label]) => ({
                id: value,
                label: prettyName(label),
              }))}
            />
          );
        } else if (def.type === "multi_select") {
          let options: Option[] = [];
          if (Array.isArray(def.options)) {
            options = def.options.map((opt) =>
              Array.isArray(opt)
                ? {
                    id: opt[0],
                    label: prettyName(opt[1]),
                  }
                : {
                    id: opt,
                    label: prettyName(opt),
                  }
            );
          } else {
            options = Object.entries(def.options).map(([id, label]) => ({
              id,
              label: prettyName(label),
            }));
          }
          return (
            <InputAutoComplete {...prop} multiple={true} options={options} />
          );
        }
        if (!msgRef.current[def.name + def.type]) {
          msgRef.current[def.name + def.type] = true;
          snackr.enqueueSnackbar(
            <span>
              "{def.name}" is of a unimplemented type "{def.type}"! <br />
              Please report this to the maintainers.{" "}
              <b>For now, we leave you with a generic textbox!</b> <br />
              DEBUG="{JSON.stringify(def)}"
            </span>,
            {
              variant: "warning",
              persist: true,
            }
          );
        }
        return (
          <>
            <InputText {...prop} />
          </>
        );
      })}
    </div>
  );
}

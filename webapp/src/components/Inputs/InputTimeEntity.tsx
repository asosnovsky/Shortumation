import "./InputTimeEntity.css";

import { FC, ReactNode } from "react";

import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import MoreTimeOutlinedIcon from "@mui/icons-material/MoreTimeOutlined";

import { ButtonIcon } from "components/Icons/ButtonIcons";
import {
  convertObjectToAutomationTimeString,
  isAutomationTimeString24Hours,
} from "utils/time";
import { InputEntity } from "./InputEntities";
import { InputTime } from "./InputTime";

export type InputTimeEntityProps = {
  value: string;
  onChange: (v: string) => void;
  className?: string;
};
export const InputTimeEntity: FC<InputTimeEntityProps> = ({
  value,
  onChange,
  className = "",
}) => {
  const is24Hour = isAutomationTimeString24Hours(value);
  let editor: ReactNode;
  if (is24Hour) {
    editor = (
      <InputTime
        label=""
        value={value ?? "00:00:00"}
        restrictEmpty
        onChange={(t) =>
          onChange(t ? convertObjectToAutomationTimeString(t) : "00:00:00")
        }
      />
    );
  } else {
    editor = (
      <InputEntity
        label="Time Entity"
        restrictMode="or"
        restrictedDeviceClass={["timestamp"]}
        restrictToDomain={["input_datetime"]}
        value={value}
        multiple={false}
        onChange={(t) => onChange(t ?? "")}
      />
    );
  }

  return (
    <div className={"input-time-entity " + className}>
      {editor}{" "}
      <ButtonIcon
        icon={is24Hour ? <AccessTimeOutlinedIcon /> : <MoreTimeOutlinedIcon />}
        onClick={() => {
          if (is24Hour) {
            onChange("");
          } else {
            onChange("00:00:00");
          }
        }}
      />
    </div>
  );
};

import "./InputTime.css";
import { useState, useEffect, FC } from "react";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { AutomationTime, AutomationTimeObject } from "types/automations/common";
import {
  convertAutomationTimeToTimeObject,
  convertObjectToAutomationTimeString,
  convertAutomationTimeToTimeString,
} from "utils/time";
import { prettyName } from "utils/formatting";
import { ButtonIcon } from "components/Icons/ButtonIcons";

// constants
const fields: Array<keyof AutomationTimeObject> = [
  "hours",
  "minutes",
  "seconds",
  "milliseconds",
];
export interface Props {
  label: string;
  value?: AutomationTime;
  onChange: (v?: AutomationTimeObject) => void;
  className?: string;
}
export const InputTime: FC<Props> = (props) => {
  // state
  const [disabled, setDisabled] = useState(!props.value);
  const [displayValue, setDisplayValue] = useState(
    convertAutomationTimeToTimeObject(props.value)
  );

  // process display input
  const updateOne = (k: keyof AutomationTimeObject) => (v: string) => {
    if (Number(v) < 0) {
      setDisplayValue({
        ...displayValue,
        [k]: 0,
      });
    } else if (k === "hours") {
      setDisplayValue({
        ...displayValue,
        [k]: Number(v),
      });
    } else if (k === "minutes") {
      let minutes = Number(v);
      let { hours = 0 } = displayValue;
      if (minutes > 59) {
        const additonalHours = Math.floor(minutes / 60);
        hours += additonalHours;
        minutes = minutes - additonalHours * 60;
      }
      setDisplayValue({
        ...displayValue,
        minutes,
        hours,
      });
    } else if (k === "seconds") {
      let seconds = Number(v);
      let { hours = 0, minutes = 0 } = displayValue;
      if (seconds > 59) {
        const additonalHours = Math.floor(seconds / (60 * 60));
        hours += additonalHours;
        seconds = seconds - additonalHours * 60;
      }
      if (seconds > 59) {
        const additionalMinutes = Math.floor(seconds / 60);
        minutes += additionalMinutes;
        seconds = seconds - additionalMinutes * 60;
      }
      setDisplayValue({
        ...displayValue,
        minutes,
        hours,
        seconds,
      });
    } else if (k === "milliseconds") {
      let milliseconds = Number(v);
      let { hours = 0, minutes = 0, seconds = 0 } = displayValue;
      if (milliseconds > 1000) {
        const additonalHours = Math.floor(milliseconds / (60 * 60 * 1000));
        hours += additonalHours;
        milliseconds = milliseconds - additonalHours * 60 * 60 * 1000;
      }
      if (milliseconds > 1000) {
        const additionalMinutes = Math.floor(milliseconds / (60 * 1000));
        minutes += additionalMinutes;
        milliseconds = milliseconds - additionalMinutes * 60 * 1000;
      }
      if (milliseconds > 1000) {
        const additionalSeconds = Math.floor(milliseconds / 1000);
        seconds += additionalSeconds;
        milliseconds = milliseconds - additionalSeconds * 1000;
      }
      setDisplayValue({
        ...displayValue,
        minutes,
        hours,
        seconds,
        milliseconds,
      });
    }
  };

  // effect
  useEffect(() => {
    if (disabled && !props.value) {
      return;
    }
    if (disabled) {
      props.onChange(undefined);
    } else {
      const pVal = convertAutomationTimeToTimeString(props.value);
      const cVal = convertObjectToAutomationTimeString(displayValue);
      if (pVal !== cVal) {
        props.onChange(displayValue);
      }
    }
    // eslint-disable-next-line
  }, [disabled, displayValue]);

  return (
    <div className={["input-time", props.className ?? ""].join(" ")}>
      {/* <InputLabel >{props.label}</InputLabel> */}
      <div className="input-time--inner">
        {fields.map((name) => (
          <TextField
            key={name}
            variant="filled"
            label={prettyName(name)}
            defaultValue="00"
            InputProps={{
              disabled,
              type: "number",
              title: prettyName(name),
            }}
            value={displayValue[name] ?? 0}
            onChange={(e) => updateOne(name)(e.target.value)}
          />
        ))}
        <ButtonIcon
          onClick={() => setDisabled(!disabled)}
          icon={disabled ? <EditIcon /> : <CloseIcon />}
        />
      </div>
    </div>
  );
};

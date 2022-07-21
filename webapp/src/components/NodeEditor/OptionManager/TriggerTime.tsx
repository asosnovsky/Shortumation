import "./TriggerTime.css";

import HelpOutlinedIcon from "@mui/icons-material/HelpOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import MoreTimeOutlinedIcon from "@mui/icons-material/MoreTimeOutlined";

import { OptionManager } from "./OptionManager";
import {
  AutomationTriggerTime,
  AutomationTriggerExactTime,
  AutomationTriggerTimePattern,
} from "types/automations/triggers";
import { InputTime } from "components/Inputs/InputTime";
import {
  convertObjectToAutomationTimeString,
  isAutomationTimeString24Hours,
} from "utils/time";
import InputText from "components/Inputs/InputText";
import { FC } from "react";
import { InputList } from "components/Inputs/InputList";
import { InputEntity } from "components/Inputs/InputEntities";
import { Button } from "components/Inputs/Button";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { ButtonIcon } from "components/Icons/ButtonIcons";

export const TriggerTime: OptionManager<AutomationTriggerTime> = {
  defaultState: () => ({
    platform: "time",
    at: "00:00:00",
  }),
  isReady: () => true,
  Component: ({ state, setState }) => {
    const [showHelp, setHelp] = useState(false);
    const setTimeType = (t: AutomationTriggerTime["platform"]) => {
      if (t === "time") {
        setState({
          platform: "time",
          at: ["00:00:00"],
        });
      } else {
        setState({
          platform: "time_pattern",
        });
      }
    };
    return (
      <>
        <div className="trigger-time--help">
          <InputList
            className="trigger-time--mode-selection"
            label="Mode"
            current={state.platform}
            onChange={setTimeType}
            options={["time", "time_pattern"]}
          />
          {state.platform === "time_pattern" && (
            <>
              <Button onClick={() => setHelp(!showHelp)}>
                <HelpOutlinedIcon /> Help
              </Button>
            </>
          )}
          {state.platform === "time_pattern" && showHelp && (
            <div className="text">
              You can prefix the value with a "/" to match whenever the value is
              divisible by that number. You can specify "*" to match any value.{" "}
              <a
                href="https://www.home-assistant.io/docs/automation/trigger/#time-pattern-trigger"
                target="_blank"
              >
                More Info.
              </a>
            </div>
          )}
        </div>
        {state.platform === "time_pattern" ? (
          <TriggerTimePattern state={state as any} setState={setState} />
        ) : (
          <TriggerExactTime state={state as any} setState={setState} />
        )}
      </>
    );
  },
};

export const TriggerExactTime: FC<{
  state: AutomationTriggerExactTime;
  setState: (t: AutomationTriggerExactTime) => void;
}> = ({ state, setState }) => {
  const times = Array.isArray(state.at) ? state.at : [state.at];
  const update = (t: string, i: number) =>
    setState({
      ...state,
      at: [...times.slice(0, i), t, ...times.slice(i + 1)],
    });
  const add = () =>
    setState({
      ...state,
      at: [...times, "00:00:00"],
    });
  return (
    <div className="trigger-time--exact">
      {times.map((v, i) => {
        let editor: JSX.Element;
        const is24Hour = isAutomationTimeString24Hours(v);
        if (is24Hour) {
          editor = (
            <InputTime
              key={`${i}-editor`}
              label={`#${i + 1} - At`}
              value={v ?? "00:00:00"}
              restrictEmpty
              onChange={(_at) =>
                update(
                  _at ? convertObjectToAutomationTimeString(_at) : "00:00:00",
                  i
                )
              }
            />
          );
        } else {
          editor = (
            <InputEntity
              key={`${i}-editor`}
              label="Time Entity"
              restrictMode="or"
              restrictedDeviceClass={["timestamp"]}
              restrictToDomain={["input_datetime"]}
              value={v}
              multiple={false}
              onChange={(_at) => update(_at ?? "", i)}
            />
          );
        }
        return (
          <div className="trigger-time--exact--option">
            {editor}{" "}
            <ButtonIcon
              icon={
                is24Hour ? <AccessTimeOutlinedIcon /> : <MoreTimeOutlinedIcon />
              }
              onClick={() => {
                if (is24Hour) {
                  update("", i);
                } else {
                  update("00:00:00", i);
                }
              }}
            />
          </div>
        );
      })}
      <Button onClick={add} className="add">
        <AddIcon />
      </Button>
    </div>
  );
};

export const TriggerTimePattern: FC<{
  state: AutomationTriggerTimePattern;
  setState: (t: AutomationTriggerTimePattern) => void;
}> = ({ state, setState }) => {
  return (
    <div className="trigger-time--pattern">
      <InputText
        label="Hours"
        value={state.hours ?? ""}
        onChange={(hours) =>
          setState({
            ...state,
            hours,
          })
        }
      />
      <InputText
        label="Minutes"
        value={state.minutes ?? ""}
        onChange={(minutes) =>
          setState({
            ...state,
            minutes,
          })
        }
      />
      <InputText
        label="Seconds"
        value={state.seconds ?? ""}
        onChange={(seconds) =>
          setState({
            ...state,
            seconds,
          })
        }
      />
    </div>
  );
};

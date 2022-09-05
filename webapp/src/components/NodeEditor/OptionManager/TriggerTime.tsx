import "./TriggerTime.css";

import HelpOutlinedIcon from "@mui/icons-material/HelpOutlined";

import { OptionManager } from "./OptionManager";
import {
  AutomationTriggerTime,
  AutomationTriggerExactTime,
  AutomationTriggerTimePattern,
} from "types/automations/triggers";
import InputText from "components/Inputs/Base/InputText";
import { FC } from "react";
import { InputList } from "components/Inputs/InputList";
import { Button } from "components/Inputs/Buttons/Button";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { InputTimeEntity } from "components/Inputs/AutoComplete/InputTimeEntity";
import { useLang } from "services/lang";

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
                rel="noreferrer"
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
        return (
          <InputTimeEntity
            key={i}
            className="trigger-time--exact--option"
            value={v ?? ""}
            onChange={(t) => update(t, i)}
          />
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
  const lang = useLang();
  return (
    <div className="trigger-time--pattern">
      <InputText
        label={lang.get("TIME_UNITS_HOURS")}
        value={state.hours ?? ""}
        onChange={(hours) =>
          setState({
            ...state,
            hours,
          })
        }
      />
      <InputText
        label={lang.get("TIME_UNITS_MINUTES")}
        value={state.minutes ?? ""}
        onChange={(minutes) =>
          setState({
            ...state,
            minutes,
          })
        }
      />
      <InputText
        label={lang.get("TIME_UNITS_SECONDS")}
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

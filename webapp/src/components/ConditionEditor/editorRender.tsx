import { FC, useState } from "react";
import {
  AutomationCondition,
  DeviceCondition,
  LogicCondition,
  NumericCondition,
  StateCondition,
  TemplateCondition,
  TimeCondition,
  TriggerCondition,
  ZoneCondition,
} from "types/automations/conditions";
import InputNumber from "components/Inputs/InputNumber";
import InputText from "components/Inputs/InputText";
import { InputEntity } from "components/Inputs/InputEntities";
import {
  ConditionNodeBase,
  ConditionNodeBaseViewMode,
} from "./ConditionNodeBase";
import { genUpdateMethods } from "./nestedUpdater";
import { InputTime } from "components/Inputs/InputTime";
import InputYaml from "components/Inputs/InputYaml";
import { HAService } from "haService";
import { DeviceEditor } from "components/DeviceEditor";
import { ButtonIcon } from "components/Icons/ButtonIcons";
import AddIcon from "@mui/icons-material/Add";
import { getEntityDomains } from "utils/automations";
import { InputAutoComplete } from "components/Inputs/InputAutoComplete";
import { InputTimeEntity } from "components/Inputs/InputTimeEntity";
import { prettyName } from "utils/formatting";
import { InputList } from "components/Inputs/InputList";
import { Button } from "components/Inputs/Button";
import { RemoveCircle } from "@mui/icons-material";

interface Editor<C extends AutomationCondition>
  extends FC<{
    condition: C;
    onChange: (condition: C) => void;
    ha: HAService;
    initialViewMode: ConditionNodeBaseViewMode;
  }> {}

export const getEditor = (condition: AutomationCondition): Editor<any> => {
  switch (condition.condition) {
    case "template":
      return TemplateEditor;
    case "and":
      return LogicViewer;
    case "or":
      return LogicViewer;
    case "not":
      return LogicViewer;
    case "device":
      return DeviceConditionEditor;
    case "numeric_state":
      return NumericStateEditor;
    case "state":
      return StateEditor;
    case "time":
      return TimeEditor;
    case "trigger":
      return TriggerEditor;
    case "zone":
      return ZoneEditor;
    default:
      return () => <div>Not Ready</div>;
  }
};

export const TemplateEditor: Editor<TemplateCondition> = ({
  onChange,
  condition,
}) => {
  return (
    <>
      <InputYaml
        label="Template"
        value={condition.value_template}
        onChange={(value_template) =>
          onChange({
            ...condition,
            value_template,
          })
        }
      />
    </>
  );
};

export const DeviceConditionEditor: Editor<DeviceCondition> = ({
  onChange,
  condition,
  ha: {
    deviceExtras: { useDeviceConditionCapalities, useDeviceConditions },
  },
}) => {
  return (
    <DeviceEditor
      type="condition"
      state={condition}
      setState={(data) =>
        onChange({
          condition: "device",
          ...data,
        } as any)
      }
      options={useDeviceConditions(
        condition.device_id
          ? {
              deviceId: condition.device_id,
            }
          : undefined
      )}
      caps={useDeviceConditionCapalities(condition as any)}
    />
  );
};

export const NumericStateEditor: Editor<NumericCondition> = ({
  onChange,
  condition,
}) => {
  return (
    <>
      <InputEntity
        value={condition.entity_id}
        multiple
        onChange={(entity_id) =>
          onChange({
            ...condition,
            entity_id,
          })
        }
      />
      <InputText
        label="Attribute"
        value={condition.attribute ?? ""}
        onChange={(attribute) =>
          onChange({
            ...condition,
            attribute,
          })
        }
      />
      <InputNumber
        label="Above"
        value={condition.above ? Number(condition.above) : undefined}
        onChange={(above) =>
          onChange({
            ...condition,
            above: above ? String(above) : undefined,
          })
        }
      />
      <InputNumber
        label="Below"
        value={condition.below ? Number(condition.below) : undefined}
        onChange={(below) =>
          onChange({
            ...condition,
            below: below ? String(below) : undefined,
          })
        }
      />
      <InputYaml
        label="Template"
        value={condition.value_template ?? ""}
        onChange={(value_template) =>
          onChange({
            ...condition,
            value_template,
          })
        }
      />
    </>
  );
};

export const LogicViewer: Editor<LogicCondition> = ({
  condition,
  onChange,
  initialViewMode,
}) => {
  return (
    <>
      {condition.conditions.map((c, i) => {
        return (
          <ConditionNodeBase
            key={i}
            condition={c}
            {...genUpdateMethods(condition, onChange)(i)}
            disableDelete={false}
            initialViewMode={initialViewMode}
          />
        );
      })}
      <div className="condition-node--logic-viewer--add">
        <ButtonIcon
          icon={<AddIcon />}
          onClick={() =>
            onChange({
              condition: condition.condition,
              conditions: [
                ...(condition.conditions ?? []),
                {
                  condition: "device",
                  device_id: "",
                  domain: "",
                  type: "",
                },
              ],
            })
          }
        />
      </div>
    </>
  );
};

export const StateEditor: Editor<StateCondition> = ({
  onChange,
  condition,
  ha,
}) => {
  const restrictToDomain =
    !condition.entity_id || condition.entity_id.length === 0
      ? undefined
      : getEntityDomains(condition.entity_id);

  return (
    <>
      <InputEntity
        restrictToDomain={restrictToDomain}
        value={condition.entity_id}
        multiple
        onChange={(entity_id) =>
          onChange({
            ...condition,
            entity_id,
          })
        }
      />
      <InputAutoComplete
        label="Attribute"
        value={condition.attribute ?? ""}
        options={ha.entities.getAttributes(condition.entity_id)}
        multiple={false}
        onChange={(attribute) =>
          onChange({
            ...condition,
            attribute: attribute ?? undefined,
          })
        }
      />
      <InputText
        label="State"
        value={String(condition.state)}
        placeholder={ha.entities
          .getStates(condition.entity_id, condition.attribute)
          .join(" or ")}
        onChange={(state) =>
          onChange({
            ...condition,
            state,
          })
        }
      />
      <InputTime
        label="For"
        value={condition.for}
        onChange={(_for) =>
          onChange({
            ...condition,
            for: _for,
          })
        }
      />
    </>
  );
};

type TimeEditorShows = "after" | "before" | "weekday";
export const TimeEditor: Editor<TimeCondition> = ({ onChange, condition }) => {
  const [shows, setShows] = useState<TimeEditorShows[]>(
    Object.keys(condition).filter((k) =>
      ["after", "before", "weekday"].includes(k)
    ) as any
  );
  return (
    <div className="condition-node--time-editor">
      {shows.map((show) => {
        if (show === "after" || show === "before") {
          return (
            <div className="condition-node--time-editor--ba" key={show}>
              <b className="label">{prettyName(show)}</b>
              <InputTimeEntity
                value={condition[show] ?? ""}
                onChange={(v) =>
                  onChange({
                    ...condition,
                    [show]: v,
                  })
                }
              />
              <Button
                className="remove"
                onClick={() => {
                  setShows(shows.filter((k) => k !== show));
                  const upd = { ...condition };
                  delete upd[show];
                  onChange({ ...upd });
                }}
              >
                <RemoveCircle />
              </Button>
            </div>
          );
        } else {
          return (
            <div>
              <InputAutoComplete
                label="Weekday"
                value={condition.weekday ?? []}
                multiple={true}
                getID={(opt) => opt}
                getLabel={(opt) => {
                  return {
                    mon: "Monday",
                    tue: "Tuesday",
                    wed: "Wednesday",
                    thu: "Thursday",
                    fri: "Friday",
                    sat: "Saturday",
                    sun: "Sunday",
                  }[opt];
                }}
                onChange={(weekday: any) =>
                  onChange({
                    ...condition,
                    weekday: weekday ?? [],
                  })
                }
                options={["mon", "tue", "wed", "thu", "fri", "sat", "sun"]}
              />
            </div>
          );
        }
      })}
      {shows.length < 3 && (
        <InputList
          className="condition-node--time-editor--new"
          label="Option"
          options={["after", "before", "weekday"].filter(
            (k: any) => !shows.includes(k)
          )}
          onChange={(k: any) => {
            setShows(shows.concat([k]));
          }}
        />
      )}
    </div>
  );
};

export const TriggerEditor: Editor<TriggerCondition> = ({
  onChange,
  condition,
}) => {
  return (
    <>
      <InputText
        label="Trigger ID"
        value={condition.id}
        onChange={(id) =>
          onChange({
            ...condition,
            id,
          })
        }
      />
    </>
  );
};

export const ZoneEditor: Editor<ZoneCondition> = ({ onChange, condition }) => {
  return (
    <>
      <InputEntity
        label="Zone"
        value={condition.zone ?? []}
        multiple
        onChange={(zone) =>
          onChange({
            ...condition,
            zone: zone ?? [],
          })
        }
        restrictToDomain={["zone"]}
      />
      <InputEntity
        label="Entity with Location"
        value={condition.entity_id}
        multiple
        onChange={(entity_id) =>
          onChange({
            ...condition,
            entity_id,
          })
        }
        restrictToDomain={["person", "device_tracker"]}
      />
    </>
  );
};

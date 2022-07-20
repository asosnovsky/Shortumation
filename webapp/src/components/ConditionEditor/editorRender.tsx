import { FC } from "react";
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
      <InputText
        label="State"
        value={String(condition.state)}
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

export const TimeEditor: Editor<TimeCondition> = ({ onChange, condition }) => {
  return (
    <>
      <InputTime
        label="After"
        value={condition.after}
        onChange={(after) =>
          onChange({
            ...condition,
            after,
          })
        }
      />
      <InputTime
        label="Before"
        value={condition.before}
        onChange={(before) =>
          onChange({
            ...condition,
            before,
          })
        }
      />
      <b>Weekday not support for no, use yaml for now</b> {condition.weekday}
    </>
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

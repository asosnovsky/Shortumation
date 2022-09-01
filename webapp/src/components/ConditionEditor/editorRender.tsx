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
import InputNumber from "components/Inputs/Base/InputNumber";
import InputText from "components/Inputs/Base/InputText";
import { InputEntity } from "components/Inputs/AutoComplete/InputEntities";
import {
  ConditionNodeBase,
  ConditionNodeBaseViewMode,
} from "./ConditionNodeBase";
import { genUpdateMethods } from "./nestedUpdater";
import { InputTime } from "components/Inputs/Base/InputTime";
import InputYaml from "components/Inputs/Base/InputYaml";
import { HAService } from "haService";
import { DeviceEditor } from "components/DeviceEditor";
import { ButtonIcon } from "components/Icons/ButtonIcons";
import AddIcon from "@mui/icons-material/Add";
import { getEntityDomains } from "utils/automations";
import { InputAutoComplete } from "components/Inputs/AutoComplete/InputAutoComplete";
import { InputTimeEntity } from "components/Inputs/AutoComplete/InputTimeEntity";
import { prettyName } from "utils/formatting";
import { InputList } from "components/Inputs/InputList";
import { Button } from "components/Inputs/Buttons/Button";
import { RemoveCircle } from "@mui/icons-material";
import { LangStore } from "lang";

interface Editor<C extends AutomationCondition>
  extends FC<{
    condition: C;
    onChange: (condition: C) => void;
    ha: HAService;
    initialViewMode: ConditionNodeBaseViewMode;
    langStore: LangStore;
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
  langStore,
}) => {
  return (
    <>
      <InputYaml
        label={langStore.get("TEMPLATE")}
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
  langStore,
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
        label={langStore.get("ATTRIBUTE")}
        value={condition.attribute ?? ""}
        onChange={(attribute) =>
          onChange({
            ...condition,
            attribute,
          })
        }
      />
      <InputNumber
        label={langStore.get("ABOVE")}
        value={condition.above ? Number(condition.above) : undefined}
        onChange={(above) =>
          onChange({
            ...condition,
            above: above ? String(above) : undefined,
          })
        }
      />
      <InputNumber
        label={langStore.get("BELOW")}
        value={condition.below ? Number(condition.below) : undefined}
        onChange={(below) =>
          onChange({
            ...condition,
            below: below ? String(below) : undefined,
          })
        }
      />
      <InputYaml
        label={langStore.get("TEMPLATE")}
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
  langStore,
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
        label={langStore.get("ATTRIBUTE")}
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
        label={langStore.get("STATE")}
        value={String(condition.state)}
        placeholder={ha.entities
          .getStates(condition.entity_id, condition.attribute)
          .join(` ${langStore.get("OR").toLowerCase()} `)}
        onChange={(state) =>
          onChange({
            ...condition,
            state,
          })
        }
      />
      <InputTime
        label={langStore.get("FOR")}
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
export const TimeEditor: Editor<TimeCondition> = ({
  onChange,
  condition,
  langStore,
}) => {
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
            <div className="condition-node--time-editor--ba" key={show}>
              <b className="label">{prettyName(show)}</b>
              <InputAutoComplete
                className="condition-node--time-editor--weekday"
                label={langStore.get("WEEKDAY")}
                value={condition.weekday ?? []}
                multiple={true}
                getID={(opt) => opt}
                getLabel={(opt) => {
                  return {
                    mon: langStore.get("DAY_mon"),
                    tue: langStore.get("DAY_tue"),
                    wed: langStore.get("DAY_wed"),
                    thu: langStore.get("DAY_thu"),
                    fri: langStore.get("DAY_fri"),
                    sat: langStore.get("DAY_sat"),
                    sun: langStore.get("DAY_sun"),
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
        }
      })}
      {shows.length < 3 && (
        <InputList
          className="condition-node--time-editor--new"
          label={langStore.get("OPTION")}
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
  langStore,
}) => {
  return (
    <>
      <InputText
        label={langStore.get("TRIGGER_ID")}
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

export const ZoneEditor: Editor<ZoneCondition> = ({
  onChange,
  condition,
  langStore,
}) => {
  return (
    <>
      <InputEntity
        label={langStore.get("ZONE")}
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
        label={langStore.get("ENTITY_WITH_LOCATION")}
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

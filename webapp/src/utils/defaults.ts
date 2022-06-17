import {
  AutomationCondition,
  LogicCondition,
  NumericCondition,
  StateCondition,
  TemplateCondition,
  TimeCondition,
  TriggerCondition,
  ZoneCondition,
} from "types/automations/conditions";
import { AutomationData } from "types/automations";

export const getConditionDefaultValues = (
  condition: AutomationCondition["condition"]
): AutomationCondition => {
  if (condition === "or" || condition === "and" || condition === "not") {
    return {
      condition,
      conditions: [],
    } as LogicCondition;
  } else if (condition === "template") {
    return {
      condition,
      value_template: "",
    } as TemplateCondition;
  } else if (condition === "numeric_state") {
    return {
      condition,
      entity_id: [],
    } as NumericCondition;
  } else if (condition === "state") {
    return {
      condition,
      entity_id: [],
      state: [],
    } as StateCondition;
  } else if (condition === "time") {
    return {
      condition,
    } as TimeCondition;
  } else if (condition === "trigger") {
    return {
      condition,
      id: "",
    } as TriggerCondition;
  } else if (condition === "zone") {
    return {
      condition,
      zone: "",
      entity_id: [],
      state: [],
    } as ZoneCondition;
  } else if (condition === "device") {
    return {
      condition,
      device_id: "",
      domain: "",
      type: "",
    };
  }
  return {
    condition,
  } as any;
};

export const defaultAutomation = (id: string): AutomationData => ({
  metadata: {
    id,
    alias: "New Automation",
    description: "",
    mode: "single",
  },
  tags: {},
  trigger: [],
  sequence: [],
  condition: [],
});

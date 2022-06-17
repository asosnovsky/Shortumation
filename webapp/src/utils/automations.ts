import * as v from "types/validators";
import {
  AutomationNode,
  AutomationNodeMapping,
  AutomationNodeSubtype,
  AutomationNodeTypes,
} from "types/automations";
import { AutomationTrigger, TriggerType } from "types/automations/triggers";
import { MiniFailure } from "types/validators/helper";
import { getFailures } from "../types/validators/helper";
import { ActionType } from "types/automations/actions";
import { ConditionType } from "types/automations/conditions";
import * as st from "superstruct";

export const getNodeTypeAndValidate = (
  node: AutomationNode,
  allowedTypes: AutomationNodeTypes[]
) => {
  const nodeType = getNodeType(node);
  if (allowedTypes.includes(nodeType)) {
    return nodeType;
  }
  throw new Error(
    `Detected '${nodeType}' but expected one of {${allowedTypes}}`
  );
};

export const getNodeType = (node: AutomationNode): AutomationNodeTypes => {
  if ("condition" in node) {
    return "condition";
  } else if ("platform" in node) {
    return "trigger";
  } else {
    return "action";
  }
};

export const getSubTypeList = <T extends AutomationNodeTypes>(
  nodeType: T
): AutomationNodeSubtype<T>[] => {
  switch (nodeType) {
    case "action":
      return ["service", "repeat", "wait", "device", "choose"] as any;
    case "condition":
      return [
        "or",
        "and",
        "not",
        "numeric_state",
        "state",
        "template",
        "time",
        "trigger",
        "zone",
      ] as any;
    case "trigger":
      return [
        "event",
        "homeassistant",
        "mqtt",
        "numeric_state",
        "state",
        "tag",
        "template",
        "time",
        "time_pattern",
        "webhook",
        "zone",
        "device",
      ] as any;
    default:
      return [];
  }
};

export const makeDefault = (
  nodeType: keyof AutomationNodeMapping
): AutomationNode => {
  switch (nodeType) {
    case "action":
      return {
        data: {},
        service: "",
        target: {},
      };
    case "condition":
      return {
        condition: "and",
        conditions: [],
      };
    default:
      return {
        platform: "device",
        device_id: "",
        domain: "",
        type: "",
        subtype: "",
      } as AutomationTrigger;
  }
};

export const getNodeSubType = <T extends AutomationNodeTypes>(
  node: AutomationNode<T>
): AutomationNodeSubtype<T> => {
  if ("condition" in node) {
    return node.condition as any;
  } else if ("platform" in node) {
    return node.platform as any;
  } else if ("service" in node) {
    return "service" as any;
  } else if ("repeat" in node) {
    return "repeat" as any;
  } else if ("wait_template" in node || "wait_for_trigger" in node) {
    return "wait" as any;
  } else if ("event" in node) {
    return "event" as any;
  } else if ("device_id" in node) {
    return "device" as any;
  } else if ("choose" in node) {
    return "choose" as any;
  } else if ("delay" in node) {
    return "wait" as any;
  } else {
    throw new Error("Invalid node type!");
  }
};

const TriggerValidators: Record<TriggerType, any> = {
  homeassistant: v.triggers.AutomationTriggerHA,
  device: v.triggers.AutomationTriggerDevice,
  event: v.triggers.AutomationTriggerEvent,
  mqtt: v.triggers.AutomationTriggerMQTT,
  numeric_state: v.triggers.AutomationTriggerNumericState,
  state: v.triggers.AutomationTriggerState,
  tag: v.triggers.AutomationTriggerTag,
  template: v.triggers.AutomationTriggerTemplate,
  time: v.triggers.AutomationTriggerTime,
  time_pattern: v.triggers.AutomationTriggerTimePattern,
  webhook: v.triggers.AutomationTriggerWebhook,
  zone: v.triggers.AutomationTriggerZone,
};

const ActionValidators: Record<ActionType, any> = {
  choose: v.actions.ChooseAction,
  device: v.actions.DeviceAction,
  event: v.actions.FireEventAction,
  repeat: v.actions.RepeatAction,
  service: v.actions.ServiceAction,
  wait: st.union([v.actions.DelayAction, v.actions.WaitAction]),
};

const ConditionValidators: Record<ConditionType, any> = {
  and: v.conditions.LogicCondition,
  or: v.conditions.LogicCondition,
  not: v.conditions.LogicCondition,
  numeric_state: v.conditions.NumericCondition,
  state: v.conditions.StateCondition,
  template: v.conditions.TemplateCondition,
  time: v.conditions.TimeCondition,
  trigger: v.conditions.TriggerCondition,
  zone: v.conditions.ZoneCondition,
};

const AllValidators: Record<AutomationNodeTypes, any> = {
  action: ActionValidators,
  condition: ConditionValidators,
  trigger: TriggerValidators,
};

export const validateNode = (
  node: AutomationNode,
  allowedNodeTypes: AutomationNodeTypes[] = []
): MiniFailure[] | null => {
  let nodeType = getNodeType(node);
  let errors: MiniFailure[] = [];
  if (allowedNodeTypes.length > 0 && !allowedNodeTypes.includes(nodeType)) {
    errors.push({
      message: [
        `Got node of type "${nodeType}" but expected one of {${allowedNodeTypes}}`,
      ],
      path: "",
    });
    nodeType = allowedNodeTypes[0];
  }
  let nodeSubType: null | AutomationNodeSubtype = null;
  try {
    nodeSubType = getNodeSubType(node);
  } catch (err) {
    errors.push({ message: [`Failed to identifiy subtype`], path: "" });
  }
  if (nodeSubType) {
    const failures = getFailures(node, AllValidators[nodeType][nodeSubType]);
    if (failures) {
      errors = errors.concat(failures);
    }
  }
  if (errors.length > 0) {
    return errors;
  } else {
    return null;
  }
};

export const getEntityDomains = (entityIds: string | string[]): string[] => {
  if (typeof entityIds === "string") {
    return [entityIds.toLowerCase().split(".")[0] ?? ""];
  } else {
    const all = new Set<string>();
    entityIds.forEach((eid) =>
      getEntityDomains(eid).forEach((domain) => all.add(domain))
    );
    return Array.from(all.keys());
  }
};

export const binaryStateDomains = [
  "binary_sensor",
  "switch",
  "light",
  "automation",
  "input_boolean",
  "script",
];

export const entityDomainsAreBinary = (domains: string[]): boolean => {
  if (domains.length === 1) {
    return binaryStateDomains.includes(domains[0]);
  } else {
    for (const domain of domains) {
      if (!entityDomainsAreBinary([domain])) {
        return false;
      }
    }
    return true;
  }
};

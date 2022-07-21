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
import {
  ConditionType,
  AutomationCondition,
} from "types/automations/conditions";
import * as st from "superstruct";
import { ScriptConditionField } from "types/automations/common";

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

export const getSubTypeList = <T extends AutomationNodeTypes>(nodeType: T) => {
  switch (nodeType) {
    case "action":
      return [
        "service",
        "repeat",
        "wait",
        "device",
        "stop",
        "choose",
        "parallel",
      ] as AutomationNodeSubtype<"action">[];
    case "condition":
      return [
        "or",
        "and",
        "not",
        "state",
        "device",
        "numeric_state",
        "template",
        "time",
        "trigger",
        "zone",
      ] as AutomationNodeSubtype<"condition">[];
    case "trigger":
      return [
        "device",
        "state",
        "numeric_state",
        "time",
        "zone",
        "event",
        "homeassistant",
        "mqtt",
        "tag",
        "template",
        "webhook",
      ] as AutomationNodeSubtype<"trigger">[];
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

export const getNodeSubType = <
  T extends AutomationNodeTypes,
  II extends boolean = false
>(
  node: AutomationNode<T>,
  ignoreInvalid: II = false as II
): II extends false
  ? AutomationNodeSubtype<T>
  : AutomationNodeSubtype<T> | "" => {
  if ("condition" in node) {
    return node.condition as any;
  } else if ("platform" in node) {
    if (node.platform === "time_pattern") {
      return "time" as any;
    }
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
  } else if ("choose" in node || "if" in node) {
    return "choose" as any;
  } else if ("delay" in node) {
    return "wait" as any;
  } else if ("stop" in node) {
    return "stop" as any;
  } else if ("parallel" in node) {
    return "parallel" as any;
  } else if (!ignoreInvalid) {
    throw new Error("Invalid node type!");
  }
  return "" as any;
};

export const TriggerValidators: Record<TriggerType, any> = {
  homeassistant: v.triggers.AutomationTriggerHA,
  device: v.triggers.AutomationTriggerDevice,
  event: v.triggers.AutomationTriggerEvent,
  mqtt: v.triggers.AutomationTriggerMQTT,
  numeric_state: v.triggers.AutomationTriggerNumericState,
  state: v.triggers.AutomationTriggerState,
  tag: v.triggers.AutomationTriggerTag,
  template: v.triggers.AutomationTriggerTemplate,
  time: v.triggers.AutomationTriggerTime,
  webhook: v.triggers.AutomationTriggerWebhook,
  zone: v.triggers.AutomationTriggerZone,
};

export const ActionValidators: Record<ActionType, any> = {
  parallel: v.actions.ParallelAction,
  choose: v.actions.ChooseAction,
  device: v.actions.DeviceAction,
  event: v.actions.FireEventAction,
  repeat: v.actions.RepeatAction,
  service: v.actions.ServiceAction,
  stop: v.actions.StopAction,
  wait: st.union([v.actions.DelayAction, v.actions.WaitAction]),
};

export const ConditionValidators: Record<ConditionType, any> = {
  and: v.conditions.LogicCondition,
  or: v.conditions.LogicCondition,
  not: v.conditions.LogicCondition,
  device: v.conditions.DeviceCondition,
  numeric_state: v.conditions.NumericCondition,
  state: v.conditions.StateCondition,
  template: v.conditions.TemplateCondition,
  time: v.conditions.TimeCondition,
  trigger: v.conditions.TriggerCondition,
  zone: v.conditions.ZoneCondition,
};

export const AllValidators: Record<AutomationNodeTypes, any> = {
  action: ActionValidators,
  condition: ConditionValidators,
  trigger: TriggerValidators,
};

export const validateNode = (
  node: AutomationNode,
  allowedNodeTypes: AutomationNodeTypes[] = []
): MiniFailure[] | null => {
  if (typeof node !== "object") {
    return [
      {
        message: [
          `Expected an object but got type of "${typeof node}" = ${JSON.stringify(
            node
          )}`,
        ],
        path: "$",
      },
    ];
  }
  let nodeType = getNodeType(node);
  let errors: MiniFailure[] = [];
  if (allowedNodeTypes.length > 0 && !allowedNodeTypes.includes(nodeType)) {
    errors.push({
      message: [
        `Got node of type "${nodeType}" but expected one of {${allowedNodeTypes}}`,
      ],
      path: "$",
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
    const validator = AllValidators[nodeType][nodeSubType];
    if (!validator) {
      return errors.concat([
        {
          message: [`"${nodeSubType}" is not a known type for ${nodeType}`],
          path: "$",
        },
      ]);
    }
    const failures = getFailures(node, validator);
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

export const convertScriptConditionFieldToAutomationConditions = (
  field: ScriptConditionField | undefined
): AutomationCondition[] => {
  if (!field) {
    return [];
  } else if (typeof field === "string") {
    return [{ condition: "template", value_template: field }];
  } else {
    return field;
  }
};

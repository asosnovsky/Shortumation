import * as st from "superstruct";
import {
  AutomationDeviceState,
  AutomationTime,
  EntityId,
  DayOfWeek,
} from "./common";

export const AutomationConditionNodeBase = st.type({
  enabled: st.optional(st.boolean()),
});
export const LogicCondition = st.assign(
  AutomationConditionNodeBase,
  st.type({
    condition: st.enums(["and", "or", "not"]),
    conditions: st.array(st.object()),
  })
);
export const NumericCondition = st.assign(
  AutomationConditionNodeBase,
  st.type({
    condition: st.literal("numeric_state"),
    entity_id: EntityId,
    above: st.optional(st.string()),
    below: st.optional(st.string()),
    attribute: st.optional(st.string()),
    value_template: st.optional(st.string()),
  })
);
export const StateCondition = st.assign(
  AutomationConditionNodeBase,
  st.type({
    condition: st.literal("state"),
    entity_id: EntityId,
    state: st.union([st.array(st.string()), st.string()]),
    for: st.optional(AutomationTime),
    attribute: st.optional(st.string()),
  })
);
export const DeviceCondition = st.assign(
  AutomationConditionNodeBase,
  st.type({
    condition: st.literal("device"),
  }),
  AutomationDeviceState
);
export const TemplateCondition = st.assign(
  AutomationConditionNodeBase,
  st.type({
    condition: st.literal("template"),
    value_template: st.string(),
  })
);
export const TriggerCondition = st.assign(
  AutomationConditionNodeBase,
  st.type({
    condition: st.literal("trigger"),
    id: st.string(),
  })
);
export const TimeCondition = st.assign(
  AutomationConditionNodeBase,
  st.type({
    condition: st.literal("time"),
    after: st.optional(AutomationTime),
    before: st.optional(AutomationTime),
    weekday: st.optional(st.union([DayOfWeek, st.array(DayOfWeek)])),
  })
);
export const ZoneCondition = st.assign(
  AutomationConditionNodeBase,
  st.type({
    condition: st.literal("zone"),
    entity_id: EntityId,
    zone: st.union([st.array(st.string()), st.string()]),
  })
);

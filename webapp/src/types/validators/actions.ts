import * as st from "superstruct";
import {
  AutomationDeviceState,
  AutomationTime,
  ScriptConditionField,
} from "./common";
import { AutomationTrigger } from "./triggers";

export const AutomationActionNodeBase = st.type({
  alias: st.optional(st.string()),
  variables: st.optional(st.record(st.string(), st.any())),
  enabled: st.optional(st.boolean()),
});

export const ServiceAction = st.intersection([
  AutomationActionNodeBase,
  st.type({
    data: st.any(),
    target: st.any(),
    service: st.string(),
  }),
]);

export const RepeatAction = st.intersection([
  AutomationActionNodeBase,
  st.type({
    repeat: st.object({
      count: st.optional(st.number()),
      while: st.optional(ScriptConditionField),
      until: st.optional(ScriptConditionField),
      sequence: st.array(st.object()),
    }),
  }),
]);

export const WaitAction = st.intersection([
  AutomationActionNodeBase,
  st.type({
    timeout: st.optional(AutomationTime),
    continue_on_timeout: st.optional(st.boolean()),
    wait_template: st.optional(st.string()),
    wait_for_trigger: st.optional(st.array(AutomationTrigger)),
  }),
]);

export const DelayAction = st.intersection([
  AutomationActionNodeBase,
  st.type({
    delay: AutomationTime,
  }),
]);

export const FireEventAction = st.intersection([
  AutomationActionNodeBase,
  st.type({
    event: st.string(),
    event_data: st.any(),
  }),
]);

export const DeviceAction = st.assign(
  AutomationActionNodeBase,
  st.partial(AutomationDeviceState)
);

export const StopAction = st.assign(
  AutomationActionNodeBase,
  st.type({
    stop: st.string(),
  })
);

export const ChooseAction = st.intersection([
  AutomationActionNodeBase,
  st.type({
    choose: st.array(
      st.type({
        conditions: st.array(st.object()),
        sequence: st.array(st.object()),
      })
    ),
    default: st.optional(st.array(st.object())),
  }),
]);

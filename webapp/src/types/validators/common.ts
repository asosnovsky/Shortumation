import * as st from "superstruct";

export const EntityId = st.union([st.string(), st.array(st.string())]);
export const AutomationTimeString = st.refine(
  st.string(),
  "TimeString",
  (v, c) => {
    // https://www.home-assistant.io/docs/automation/trigger/#time-string
    const bits: string[] = v.split(":");
    if (bits.length !== 2 && bits.length !== 3) {
      return {
        branch: c.branch,
        message:
          "Time string should be either in the form 'HH:MM' or 'HH:MM:SS' as specified in https://www.home-assistant.io/docs/automation/trigger/#time-string",
        path: c.path,
      };
    }
    for (let i = 0; i < bits.length; i++) {
      const b = bits[i];
      const num = Number(b);
      if (Number.isInteger(num)) {
        let max = 23;
        if (i > 0) {
          max = 59;
        }
        if (num < 0 || num > max) {
          return {
            branch: c.branch,
            message: `Time string should contain only positive numbers between 0-${max} as specified in https://www.home-assistant.io/docs/automation/trigger/#time-string`,
            path: c.path.concat(bits.slice(0, i)).concat([`<<${b}>>`]),
          };
        }
      } else {
        return {
          branch: c.branch,
          message: `Time string should contain only positive numbers as specified in https://www.home-assistant.io/docs/automation/trigger/#time-string`,
          path: c.path.concat(bits.slice(0, i)).concat([`<<${b}>>`]),
        };
      }
    }
    return true;
  }
);
export const AutomationTimeObject = st.object({
  hours: st.optional(st.number()),
  minutes: st.optional(st.number()),
  seconds: st.optional(st.number()),
  milliseconds: st.optional(st.number()),
});
export const AutomationTime = st.union([st.string(), AutomationTimeObject]);
export const AutomationDeviceState = st.type({
  subtype: st.optional(st.string()),
  entity_id: st.optional(st.string()),
  type: st.string(),
  device_id: st.string(),
  domain: st.string(),
});
export const DayOfWeek = st.enums([
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
]);

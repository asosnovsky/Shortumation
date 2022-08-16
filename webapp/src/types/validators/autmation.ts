import * as st from "superstruct";

export const AutomationData = st.object({
  id: st.string(),
  alias: st.optional(st.string()),
  description: st.optional(st.string()),
  trigger_variables: st.optional(
    st.nullable(st.record(st.string(), st.string()))
  ),
  mode: st.enums(["single", "restart", "queued", "parallel"]),
  trigger: st.array(st.object()),
  condition: st.array(st.object()),
  action: st.array(st.object()),
  tags: st.record(st.string(), st.string()),
});

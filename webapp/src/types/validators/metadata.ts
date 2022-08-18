import * as st from "superstruct";

export const AutomationMetadata = st.object({
  id: st.string(),
  alias: st.optional(st.string()),
  description: st.optional(st.string()),
  trigger_variables: st.optional(
    st.nullable(st.record(st.string(), st.string()))
  ),
  mode: st.enums(["single", "restart", "queued", "parallel"]),
});

export const AutomationShortumationMetadata = st.object({
  source_file: st.string(),
  source_file_type: st.string(),
  configuration_key: st.string(),
});

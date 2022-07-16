import { AutomationNodeSubtype } from "types/automations";

const subtypeDescMap: Partial<Record<AutomationNodeSubtype, string>> = {
  choose: "create conditional if/else statements",
  parallel: "run multiple nodes at the same time",
  stop: "stop the automation with a status code",
  wait: "wait based on a condition",
  repeat: "repeat a sequence until or while some conditions are met",
  device: "device related actions",
  service: "call a service",
};

export const getNodeSubTypeDescription = (
  nst: AutomationNodeSubtype
): string => {
  return subtypeDescMap[nst] ?? "";
};

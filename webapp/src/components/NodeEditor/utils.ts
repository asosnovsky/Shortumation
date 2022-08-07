import { AutomationNodeSubtype } from "types/automations";

const subtypeDescMap: Partial<Record<AutomationNodeSubtype, string>> = {
  choose: "create conditional if/else statements",
  parallel: "run multiple nodes at the same time",
  stop: "stop the automation with a status code",
  wait: "wait based on a condition",
  repeat: "repeat a sequence until or while some conditions are met",
  device: "device related actions",
  service: "call a service",
  event: "Fires when an event is being received.",
  homeassistant: "Fires when Home Assistant starts up or shuts down.",
  mqtt: "Fires when a specific message is received on given MQTT topic.",
  sun: "Fires when the sun is setting or rising.",
  numeric_state:
    "Fires when the numeric value of an entity's state or attribute changes.",
  state: "Fires when an entity's state or attribute changes",
  template: "Evaluate a custom template",
  time: "Specify a certain time to run",
  webhook:
    "Webhook trigger fires when a web request is made to the webhook endpoint",
  zone: "Specify when an entity enters or leaves a zone",
  tag: "Fires when a tag is scanned.",
  calendar: "Fires when a Calendar event starts or ends.",
};

export const getNodeSubTypeDescription = (
  nst: AutomationNodeSubtype
): string => {
  return subtypeDescMap[nst] ?? "";
};

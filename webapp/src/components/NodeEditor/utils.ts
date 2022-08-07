import { AutomationNodeSubtype } from "types/automations";

const subtypeDescMap: Partial<Record<AutomationNodeSubtype, string>> = {
  choose: "create conditional if/else statements",
  parallel: "run multiple nodes at the same time",
  stop: "stop the automation with a status code",
  scene: "activate a scene.",
  wait: "wait based on a condition",
  repeat: "repeat a sequence until or while some conditions are met",
  device: "device related actions",
  service: "call a service",
  event: "fires when an event is being received.",
  homeassistant: "fires when Home Assistant starts up or shuts down.",
  mqtt: "fires when a specific message is received on given MQTT topic.",
  sun: "fires when the sun is setting or rising.",
  numeric_state:
    "fires when the numeric value of an entity's state or attribute changes.",
  state: "fires when an entity's state or attribute changes",
  template: "evaluate a custom template",
  time: "specify a certain time to run",
  webhook:
    "webhook trigger fires when a web request is made to the webhook endpoint",
  zone: "specify when an entity enters or leaves a zone",
  tag: "fires when a tag is scanned.",
  calendar: "fires when a Calendar event starts or ends.",
};

export const getNodeSubTypeDescription = (
  nst: AutomationNodeSubtype
): string => {
  return subtypeDescMap[nst] ?? "";
};

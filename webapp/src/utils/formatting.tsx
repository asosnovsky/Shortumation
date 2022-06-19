import { AutomationNode, AutomationNodeTypes } from "types/automations";
import AltRouteOutlinedIcon from "@mui/icons-material/AltRouteOutlined";
import { ReactNode } from "react";
import {
  AutomationDeviceState,
  AutomationTime,
} from "types/automations/common";

export interface Namer {
  getEntityName(entity_id: string | string[], maxEntities?: number): string;
  getDeviceName(device_id: string): string;
  getServiceName(service: string): string;
}

export const convertTimeToString = (t: AutomationTime) => {
  if (typeof t === "string") {
    return t;
  } else {
    const { hours = 0, minutes = 0, seconds = 0, milliseconds = 0 } = t;
    return [hours, minutes, seconds, milliseconds]
      .map((n) => String(n).padStart(2, "0"))
      .join(":");
  }
};
export const getDescriptionFromAutomationNode = <
  N extends AutomationNodeTypes,
  AllowJS extends true | false
>(
  node: AutomationNode<N>,
  namer: Namer,
  allowJs: AllowJS
): AllowJS extends true ? ReactNode : string => {
  if ("alias" in node && node.alias) {
    return node.alias;
  }

  if ("platform" in node) {
    if (node.id) {
      return node.id ?? "";
    }
    if (node.platform === "time") {
      return node.at;
    }
    if (node.platform === "homeassistant") {
      if (node.event === "start") {
        return "HA is starting";
      } else {
        return "HA is shutting down";
      }
    }
    if (node.platform === "tag") {
      return `Tag = ${node.tag_id}`;
    }
    if (node.platform === "state") {
      let out = "";
      if (typeof node.entity_id === "string") {
        out = namer.getEntityName(node.entity_id);
      } else {
        out = namer.getEntityName(node.entity_id[0]) + " and more";
      }
      if (node.from) {
        out += ` from ${node.from}`;
      }
      if (node.to) {
        out += ` to ${node.to}`;
      }
      return out;
    }
    if (node.platform === "device") {
      return getDescriptionForDeviceType(node as any, namer, true);
    }
    return node.platform;
  }
  if ("condition" in node) {
    if (
      node.condition === "and" ||
      node.condition === "or" ||
      node.condition === "not"
    ) {
      return "Logic";
    } else {
      switch (node.condition) {
        case "numeric_state":
          if (node.entity_id) {
            const center =
              Array.isArray(node.entity_id) && node.entity_id.length > 1
                ? "..."
                : namer.getEntityName(node.entity_id);
            if (node.above) {
              if (node.below) {
                return `${node.above} < ${center} < ${node.below}`;
              }
              return `${center} > ${node.above}`;
            }
            if (node.below) {
              return `${center} < ${node.below}`;
            }
            return `${center}?>?<`;
          }
          return "Numeric State Condition";
        case "state":
          return `${namer.getEntityName(node.entity_id)} is '${node.state}'`;
        case "template":
          return node.value_template;
        case "device":
          return getDescriptionForDeviceType(node, namer, true);
        case "trigger":
          return node.id;
        default:
          return JSON.stringify(node);
      }
    }
  }
  if ("service" in node) {
    return namer.getServiceName(node.service);
  }
  if ("repeat" in node) {
    return "Repeat " + node.repeat.count;
  }
  if ("delay" in node) {
    return `Wait for ${convertTimeToString(node.delay)}`;
  }
  if ("wait_template" in node) {
    let out = "Wait on " + node.wait_template;
    if (node.timeout) {
      out += " for " + convertTimeToString(node.timeout);
    }
    return out;
  }
  if ("event" in node) {
    return `Trigger ${node.event}`;
  }
  if ("device_id" in node) {
    return getDescriptionForDeviceType(node as any, namer, false);
  }
  if ("choose" in node) {
    if (allowJs) {
      return (
        <AltRouteOutlinedIcon
          style={{
            transform: "rotate(90deg)",
          }}
          color="secondary"
        />
      ) as any;
    }
    return "Switch (choose)";
  }
  return "n/a";
};

const getDescriptionForDeviceType = (
  node: AutomationDeviceState,
  namer: Namer,
  actionToEnd: boolean = false
) => {
  let out = "";
  let actionPort = "";
  if (node.type) {
    actionPort += `${prettyName(node.type ?? "")} `;
  }
  if (node.subtype) {
    actionPort += node.subtype;
  }
  actionPort = actionPort.trim();
  if (node.entity_id) {
    out += namer.getEntityName(node.entity_id);
  } else if (node.device_id) {
    out += namer.getDeviceName(node.device_id);
  }
  out = out.trim();
  if (actionToEnd) {
    return out + " " + actionPort;
  }
  return actionPort + " " + out;
};

export const prettyName = (n: string) => {
  const clean = n.replaceAll(/[.\-_]/g, " ");
  return clean
    .split(" ")
    .map((x) => x.slice(0, 1).toUpperCase() + x.slice(1))
    .join(" ");
};

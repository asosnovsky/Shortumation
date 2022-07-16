import { AutomationNode, AutomationNodeTypes } from "types/automations";
import AltRouteOutlinedIcon from "@mui/icons-material/AltRouteOutlined";
import { ReactNode } from "react";
import {
  AutomationDeviceState,
  AutomationTime,
  DayOfWeek,
} from "types/automations/common";
import { AutomationTriggerZone } from "types/automations/triggers";
import StopIcon from "@mui/icons-material/PanToolOutlined";
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
    if (node.platform === "zone") {
      return getDescriptionForZoneType(node as any, namer);
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
      if (node.conditions.length === 0) {
        return `None`;
      }
      const childConditions = node.conditions.map((c) =>
        getDescriptionFromAutomationNode(c, namer, allowJs)
      );
      return childConditions.join(` ${node.condition} `).trim() ?? "None";
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
        case "time":
          const before = node.before
            ? `before ${convertTimeToString(node.before)}`
            : "";
          const after = node.after
            ? `after ${convertTimeToString(node.after)}`
            : "";
          const weekday = node.weekday
            ? `on ${getDescriptionForWeekDay(node.weekday, "or")}`
            : "";
          return [before, after, weekday].filter((x) => x).join(", ");
        default:
          return JSON.stringify(node);
      }
    }
  }
  if ("service" in node) {
    return namer.getServiceName(node.service);
  }
  if ("repeat" in node) {
    const repeatNode = node.repeat;
    if ("count" in repeatNode) {
      return `Repeat ${repeatNode.count}`;
    }
    if ("while" in repeatNode) {
      return `Repeat While`;
    }
    return "Repeat Until";
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
  if ("choose" in node || "if" in node) {
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
  if ("stop" in node) {
    if (allowJs) {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5em",
          }}
        >
          <span>{node.stop}</span>
          <StopIcon />
        </div>
      ) as any;
    }
    return `Stopping due to ${node.stop}`;
  }
  if ("parallel" in node) {
    return "Parallel";
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

const getDescriptionForZoneType = (
  node: AutomationTriggerZone,
  namer: Namer
) => {
  let out = "";
  let actionPort = "";
  if (node.event) {
    actionPort += node.event + " ";
  }
  if (node.zone) {
    actionPort += prettyName(namer.getEntityName(node.zone));
  }
  actionPort = actionPort.trim();
  if (node.entity_id) {
    out += namer.getEntityName(node.entity_id);
  }
  out = out.trim();
  return out + " " + actionPort;
};

export const getDescriptionForWeekDay = (
  n: DayOfWeek | DayOfWeek[],
  acc = "and"
): string => {
  if (typeof n === "string") {
    return n;
  } else {
    let allWeekends = true;
    let allWeekdays = true;
    for (const d of n) {
      if (!["mon", "tue", "wed", "thu", "fri"].includes(d)) {
        allWeekdays = false;
      } else {
        allWeekends = false;
      }
      if (!allWeekdays && !allWeekends) {
        break;
      }
    }
    if (allWeekends) {
      return "weekends";
    } else if (allWeekdays) {
      return "weekdays";
    }
    return n.join(` ${acc.trim()} `);
  }
};

export const prettyName = (n: string) => {
  const clean = n.replaceAll(/[.\-_]/g, " ");
  return clean
    .split(" ")
    .map((x) => x.slice(0, 1).toUpperCase() + x.slice(1))
    .join(" ");
};

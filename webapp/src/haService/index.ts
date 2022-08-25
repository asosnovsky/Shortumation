import { servicesColl } from "home-assistant-js-websocket";
import { Namer } from "utils/formatting";
import {
  deviceRegistryColl,
  entityRegistryColl,
} from "./additionalCollections";
import { DeviceRegistryItem, HASendMessage } from "./types";
import { useHassCollection } from "./useHassCollection";
import { useHAConnection } from "./connection";
import { useSnackbar } from "notistack";
import { TypedHassService } from "./fieldTypes";
import { Option } from "components/Inputs/AutoComplete/InputAutoComplete";
import { getDeviceExtraWsCalls } from "./extras";
import { useHAEntities } from "./HAEntities";

export type ServiceOption = Option<{
  domain: string;
  action: string;
  description: string;
  data: TypedHassService;
}>;
export type HAServicesState = ReturnType<typeof useHAServices>;
export const useHAServices = () => {
  const services = useHassCollection(servicesColl);
  const methods = {
    getOption(name: string): TypedHassService | null {
      if (!services.ready) {
        return null;
      }
      try {
        const [domain, action] = name.split(".");
        return {
          name:
            services.collection[domain][action].name ?? `${domain}.${action}`,
          description: services.collection[domain][action].description ?? "",
          target: services.collection[domain][action].target,
          fields: services.collection[domain][action].fields,
        };
      } catch (err: any) {
        console.warn(err);
        return null;
      }
    },
    getOptions(): ServiceOption[] {
      if (!services.ready) {
        return [];
      }
      return Object.keys(services.collection).reduce<ServiceOption[]>(
        (all, domain) => {
          const opts = Object.keys(
            services.collection[domain]
          ).map<ServiceOption>((action) => ({
            id: `${domain}.${action}`,
            label:
              services.collection[domain][action].name ?? `${domain}.${action}`,
            description: services.collection[domain][action].description ?? "",
            domain,
            action,
            data: {
              name:
                services.collection[domain][action].name ??
                `${domain}.${action}`,
              description:
                services.collection[domain][action].description ?? "",
              target: services.collection[domain][action].target,
              fields: services.collection[domain][action].fields,
            },
          }));
          return all.concat(opts);
        },
        []
      );
    },
    getLabel: (opt: ServiceOption): string => {
      if (typeof opt === "string") {
        if (services.ready) {
          try {
            const [domain, action] = opt.split(".");
            return services.collection[domain][action].name ?? opt;
          } catch (_) {}
        }
        return opt;
      }
      return opt.label ?? opt.id;
    },
    getID: (opt: ServiceOption): string => {
      if (typeof opt === "string") {
        return opt;
      }
      return opt.id;
    },
  };

  return { ...services, ...methods };
};

export type DeviceRegistryOption = Option<{ manufacturer: string }>;
export type HADeviceRegistry = ReturnType<typeof useHADeviceRegistry>;
export const useHADeviceRegistry = () => {
  const dr = useHassCollection(deviceRegistryColl);
  const getLabelForItem = (item: DeviceRegistryItem) =>
    item ? item.name_by_user ?? item.name ?? item.id : "";
  const methods = {
    getOptions(): DeviceRegistryOption[] {
      if (!dr.ready) {
        return [];
      }
      const keys = Object.keys(dr.collection);
      return keys.map((key) => ({
        id: key,
        label: getLabelForItem(dr.collection[key]) ?? key,
        manufacturer: dr.collection[key].manufacturer ?? "",
      }));
    },
    getLabel: (opt: DeviceRegistryOption): string => {
      if (typeof opt === "string") {
        if (dr.ready) {
          return getLabelForItem(dr.collection[opt]) ?? opt;
        }
        return opt;
      }
      return opt.label ?? opt.id;
    },
    getID: (opt: DeviceRegistryOption): string => {
      if (typeof opt === "string") {
        return opt;
      }
      return opt.id;
    },
  };
  return { ...dr, ...methods };
};
export const useHAEntityRegistry = () => {
  const dr = useHassCollection(entityRegistryColl);
  return dr;
};

export type HAService = ReturnType<typeof useHA>;
export const useHA = () => {
  const entities = useHAEntities();
  const devices = useHADeviceRegistry();
  const services = useHAServices();
  const conn = useHAConnection();
  const snackbr = useSnackbar();

  const callService = async (
    domain: string,
    service: string,
    data: any = {},
    target: any = {}
  ) => {
    if (conn.status === "loaded") {
      try {
        const result = await conn.connection.sendMessagePromise({
          type: "call_service",
          domain,
          service,
          target,
          service_data: data,
        });
        snackbr.enqueueSnackbar(`Successfully called ${domain}.${service}`, {
          variant: "success",
        });
        return result;
      } catch (err: any) {
        let msg = JSON.stringify(err);
        if ("message" in err) {
          msg = err.message;
        }
        snackbr.enqueueSnackbar(
          `Failed to call ${domain}.${service} because '${msg}'`,
          {
            variant: "error",
          }
        );
        return;
      }
    }
    if (conn.status === "error") {
      snackbr.enqueueSnackbar(
        `Failed to call service because connection is '${conn.status}' -- ${conn.error}`,
        {
          variant: "error",
        }
      );
    } else {
      snackbr.enqueueSnackbar(
        `Failed to call service because connection is '${conn.status}'`,
        {
          variant: "error",
        }
      );
    }
  };

  const callHA: HASendMessage = async (sendMsg) => {
    if (conn.status === "loaded") {
      return await conn.connection.sendMessagePromise(sendMsg);
    }
  };

  const namer: Namer = {
    getDeviceName(device_id) {
      return devices.getLabel(device_id);
    },
    getEntityName(entity_id, maxEntities = 1) {
      if (Array.isArray(entity_id)) {
        const out = entity_id
          .slice(0, maxEntities)
          .map(entities.getLabel)
          .join(", ");
        if (entity_id.length > maxEntities) {
          return out + " and more";
        }
        return out;
      }
      return entities.getLabel(entity_id);
    },
    getServiceName(service) {
      return services.getLabel(service);
    },
  };

  return {
    entities,
    devices,
    services,
    namer,
    callService,
    callHA,
    deviceExtras: getDeviceExtraWsCalls(callHA),
    reloadAutomations: () =>
      conn.status === "loaded"
        ? callService("automation", "reload")
        : Promise.resolve(),
  };
};

import { entitiesColl, servicesColl } from "home-assistant-js-websocket";
import { Namer } from "utils/formatting";
import { deviceRegistryColl } from "./DeviceRegistry";
import { entityRegistryColl } from "./EntityRegistry";
import { DeviceRegistryItem, HASendMessage } from "./types";
import { useHassCollection } from "./useHassCollection";
import { useHAConnection } from "./connection";
import { useSnackbar } from "notistack";
import { TypedHassService } from "./fieldTypes";
import { Option } from "components/Inputs/InputAutoComplete";
import { getDeviceExtraWsCalls } from "./extras";

export type EntityOption = Option<{ domain: string }>;
export type HAEntitiesState = ReturnType<typeof useHAEntities>;
export const useHAEntities = () => {
  const entities = useHassCollection(entitiesColl, (state) => ({
    domains: Array.from(
      new Set(Object.keys(state).map((x) => x.split(".")[0])).keys()
    ).sort(),
  }));
  const methods = {
    getStates(inp: string[] | string, attribute?: string): string[] {
      if (!entities.ready) {
        return [];
      }
      let entityIds: string[] = [];
      if (typeof inp === "string") {
        entityIds = [inp];
      } else if (Array.isArray(inp)) {
        entityIds = inp;
      }
      let state: Set<string> = new Set();
      entityIds.forEach((entityId) => {
        if (entities.collection.state[entityId]) {
          if (!attribute) {
            state.add(entities.collection.state[entityId].state);
          } else {
            const val = (entities.collection.state[entityId]?.attributes ?? {})[
              attribute
            ];
            if (val) {
              state.add(val);
            }
          }
        }
      });
      return Array.from(state.keys());
    },
    getAttributes(inp: string[] | string): string[] {
      if (!entities.ready) {
        return [];
      }
      let entityIds: string[] = [];
      if (typeof inp === "string") {
        entityIds = [inp];
      } else if (Array.isArray(inp)) {
        entityIds = inp;
      }
      let attributes: Set<string> = new Set();
      entityIds.forEach((entityId) => {
        const thisAttrs = new Set(
          Object.keys(entities.collection.state[entityId]?.attributes ?? {})
        );
        if (attributes.size === 0) {
          attributes = thisAttrs;
        } else {
          attributes = new Set([...attributes].filter((a) => thisAttrs.has(a)));
        }
      });
      return Array.from(attributes.keys());
    },
    getDomainList(): string[] {
      return entities.additional?.domains ?? [];
    },
    validateOptions(
      options: string[],
      restrictedDomains?: string[]
    ): null | string[] {
      if (restrictedDomains) {
        const domains = restrictedDomains.map((x) => x.toLowerCase());
        const domainsStr =
          domains.length > 1
            ? `one of "${domains.join(", ")}"`
            : `"${domains[0]}"`;
        const out = options.reduce<string[]>((all = [], key) => {
          if (!domains.includes(key.toLowerCase().split(".")[0])) {
            return [...all, `${methods.getLabel(key)} is not ${domainsStr}`];
          }
          return all;
        }, []);
        if (out.length > 0) {
          return out;
        }
      }
      return null;
    },
    getOptions(restrictToDomain?: string[]): EntityOption[] {
      if (!entities.ready) {
        return [];
      }
      let keys = Object.keys(entities.collection.state);
      if (restrictToDomain) {
        const domains = restrictToDomain.map((x) => x.toLowerCase());
        keys = keys.filter((key) =>
          domains.includes(key.toLowerCase().split(".")[0])
        );
      }
      return keys.map((key) => ({
        id: key,
        label: entities.collection.state[key].attributes.friendly_name ?? key,
        domain: key.split(".")[0] ?? "n/a",
      }));
    },
    getLabel: (opt: EntityOption): string => {
      if (typeof opt === "string") {
        if (entities.ready) {
          return (
            entities.collection.state[opt]?.attributes.friendly_name ?? opt
          );
        }
        return opt;
      }
      return opt.label ?? opt.id;
    },
    getID: (opt: EntityOption): string => {
      if (typeof opt === "string") {
        return opt;
      }
      return opt.id;
    },
  };
  return {
    ...entities,
    ...methods,
  };
};

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
            services.collection.state[domain][action].name ??
            `${domain}.${action}`,
          description:
            services.collection.state[domain][action].description ?? "",
          target: services.collection.state[domain][action].target,
          fields: services.collection.state[domain][action].fields,
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
      return Object.keys(services.collection.state).reduce<ServiceOption[]>(
        (all, domain) => {
          const opts = Object.keys(
            services.collection.state[domain]
          ).map<ServiceOption>((action) => ({
            id: `${domain}.${action}`,
            label:
              services.collection.state[domain][action].name ??
              `${domain}.${action}`,
            description:
              services.collection.state[domain][action].description ?? "",
            domain,
            action,
            data: {
              name:
                services.collection.state[domain][action].name ??
                `${domain}.${action}`,
              description:
                services.collection.state[domain][action].description ?? "",
              target: services.collection.state[domain][action].target,
              fields: services.collection.state[domain][action].fields,
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
            return services.collection.state[domain][action].name ?? opt;
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
      const keys = Object.keys(dr.collection.state);
      return keys.map((key) => ({
        id: key,
        label: getLabelForItem(dr.collection.state[key]) ?? key,
        manufacturer: dr.collection.state[key].manufacturer ?? "",
      }));
    },
    getLabel: (opt: DeviceRegistryOption): string => {
      if (typeof opt === "string") {
        if (dr.ready) {
          return getLabelForItem(dr.collection.state[opt]) ?? opt;
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
  const { enqueueSnackbar } = useSnackbar();

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
        enqueueSnackbar(`Successfully called ${domain}.${service}`, {
          variant: "success",
        });
        return result;
      } catch (err: any) {
        let msg = JSON.stringify(err);
        if ("message" in err) {
          msg = err.message;
        }
        enqueueSnackbar(
          `Failed to call ${domain}.${service} because '${msg}'`,
          {
            variant: "error",
          }
        );
        return;
      }
    }
    if (conn.status === "error") {
      enqueueSnackbar(
        `Failed to call service because connection is '${conn.status}' -- ${conn.error}`,
        {
          variant: "error",
        }
      );
    } else {
      enqueueSnackbar(
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
        return entity_id
          .slice(0, maxEntities)
          .map(entities.getLabel)
          .join(", ");
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
    reloadAutomations: () => callService("automation", "reload"),
  };
};

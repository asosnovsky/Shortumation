import { Connection, getCollection } from "home-assistant-js-websocket";
import { useHassCollection } from "./useHassCollection";
import { Option, BaseOption } from "components/Inputs/InputAutoComplete";
import { EntityRegisteryItem, HassEntitiesRegistry } from "./types";
import { prettyName } from "utils/formatting";

export interface AreaRegistryItem {
  area_id: string;
  name: string;
  picture: null | string;
}
export type AreaDB = Record<
  string,
  AreaRegistryItem & {
    domains: Set<string>;
    integrations: Set<string>;
  }
>;

export const fetchAreaRegistry = (conn: Connection) =>
  Promise.all([
    conn.sendMessagePromise<AreaRegistryItem[]>({
      type: "config/area_registry/list",
    }),
    conn.sendMessagePromise<HassEntitiesRegistry>({
      type: "config/entity_registry/list",
    }),
  ]).then(([areas, er]) => {
    const areaDB: AreaDB = areas.reduce<AreaDB>((all, item) => {
      return {
        ...all,
        [item.area_id]: {
          ...item,
          domains: new Set(),
          integrations: new Set(),
        },
      };
    }, {});
    er.forEach((eri) => {
      if (eri.area_id) {
        if (eri.entity_id) {
          areaDB[eri.area_id].domains.add(
            eri.entity_id.split(".")[0].toLowerCase()
          );
        }
        if (eri.platform) {
          areaDB[eri.area_id].domains.add(eri.platform);
        }
      }
    });

    return areaDB;
  });
export const areaRegistryColl = (conn: Connection) =>
  getCollection<AreaDB>(conn, "_$earg", fetchAreaRegistry);

export type AreaOptionData = {
  data: Partial<EntityRegisteryItem>;
};
export type AreaBaseOption = BaseOption<AreaOptionData>;
export type AreaOption = Option<AreaOptionData>;
export const useHAAreas = () => {
  const areas = useHassCollection(areaRegistryColl);

  const methods = {
    areaHasEntityDomain(areaId: string, domains: string[]): boolean {
      if (!areas.ready) {
        return true;
      }
      for (const d of domains) {
        if (!areas.collection.state[areaId].domains.has(d)) {
          return false;
        }
      }
      return true;
    },
    areaHasEntityIntegration(areaId: string, integrations: string[]): boolean {
      if (!areas.ready) {
        return true;
      }
      for (const d of integrations) {
        if (!areas.collection.state[areaId].integrations.has(d)) {
          return false;
        }
      }
      return true;
    },
    getBaseOption(opt: AreaOption): AreaBaseOption {
      if (!areas.ready) {
        throw new Error("Not Ready!");
      }
      if (typeof opt === "string") {
        return {
          id: opt,
          label: areas.collection.state[opt].name ?? prettyName(opt),
          data: areas.collection.state[opt],
        };
      }
      return opt;
    },
    getOptions(
      restrictToDomain?: string[],
      restrictedIntegrations?: string[]
    ): AreaOption[] {
      if (!areas.ready) {
        return [];
      }
      let keys = Object.keys(areas.collection.state);
      if (restrictToDomain) {
        const domains = restrictToDomain.map((x) => x.toLowerCase());
        keys = keys.filter((key) => methods.areaHasEntityDomain(key, domains));
      }
      if (restrictedIntegrations) {
        const integrations = restrictedIntegrations.map((x) => x.toLowerCase());
        keys = keys.filter((key) =>
          methods.areaHasEntityIntegration(key, integrations)
        );
      }
      return keys.map((key) => ({
        id: key,
        label: areas.collection.state[key].name ?? prettyName(key),
        data: areas.collection.state[key],
      }));
    },
    getLabel: (opt: AreaOption): string => {
      if (typeof opt === "string") {
        if (areas.ready) {
          return areas.collection.state[opt]
            ? areas.collection.state[opt].name ?? prettyName(opt)
            : prettyName(opt);
        }
        return opt;
      }
      return opt.label ?? opt.id;
    },
    getID: (opt: AreaOption): string => {
      if (typeof opt === "string") {
        return opt;
      }
      return opt.id;
    },
  };

  return methods;
};

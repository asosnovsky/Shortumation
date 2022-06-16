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
    entity: Partial<EntityRegisteryItem>;
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
    const areaDB = areas.reduce<AreaDB>((all, item) => {
      return {
        ...all,
        [item.area_id]: {
          ...item,
          entity: {},
        },
      };
    }, {});
    er.forEach((eri) => {
      if (eri.area_id) {
        areaDB[eri.area_id].entity = eri;
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
    getAreaEntityDomain(areaId: string): null | string {
      if (!areas.ready) {
        return null;
      }
      const entityId = areas.collection.state[areaId].entity.entity_id;
      if (entityId) {
        return entityId.toLowerCase().split(".")[0] ?? null;
      }
      return null;
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
        const out = options.reduce<string[]>((all = [], areaId) => {
          const domain = methods.getAreaEntityDomain(areaId) ?? "";
          if (!domains.includes(domain)) {
            return [...all, `${methods.getLabel(areaId)} is not ${domainsStr}`];
          }
          return all;
        }, []);
        if (out.length > 0) {
          return out;
        }
      }
      return null;
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
    getOptions(restrictToDomain?: string[]): AreaOption[] {
      if (!areas.ready) {
        return [];
      }
      let keys = Object.keys(areas.collection.state);
      if (restrictToDomain) {
        const domains = restrictToDomain.map((x) => x.toLowerCase());
        keys = keys.filter((key) => {
          const domain = methods.getAreaEntityDomain(key);
          if (domain) {
            return domains.includes(domain);
          }
          return false;
        });
      }
      return keys.map((key) => ({
        id: key,
        label: areas.collection.state[key].name ?? prettyName(key),
        data: areas.collection.state[key].entity,
      }));
    },
    getLabel: (opt: AreaOption): string => {
      if (typeof opt === "string") {
        if (areas.ready) {
          return areas.collection.state[opt].name ?? prettyName(opt);
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

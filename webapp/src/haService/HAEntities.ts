import { Option } from "components/Inputs/InputAutoComplete";
import { useHassCollection } from "./useHassCollection";
import { entitiesColl } from "home-assistant-js-websocket";
import { useHAConnection } from "./connection";
import { entitySourceColl } from "./additionalCollections";

export type EntityOption = Option<{ domain: string; integration: string }>;
export type HAEntitiesState = ReturnType<typeof useHAEntities>;
export const useHAEntities = () => {
  const entities = useHassCollection(entitiesColl, (state) => ({
    domains: Array.from(
      new Set(Object.keys(state).map((x) => x.split(".")[0])).keys()
    ).sort(),
  }));
  const entitySource = useHassCollection(entitySourceColl);
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
      restrictedDomains?: string[],
      restrictedIntegrations?: string[]
    ): null | string[] {
      let out = options;
      if (restrictedDomains) {
        const domains = restrictedDomains.map((x) => x.toLowerCase());
        const domainsStr =
          domains.length > 1
            ? `one of "${domains.join(", ")}"`
            : `"${domains[0]}"`;
        out = out.reduce<string[]>((all = [], key) => {
          if (!domains.includes(key.toLowerCase().split(".")[0])) {
            return [...all, `${methods.getLabel(key)} is not ${domainsStr}`];
          }
          return all;
        }, []);
      }
      if (restrictedIntegrations && entitySource.ready) {
        const domains = restrictedIntegrations.map((x) => x.toLowerCase());
        const domainsStr =
          domains.length > 1
            ? `one of "${domains.join(", ")}"`
            : `"${domains[0]}"`;
        out = out.reduce<string[]>((all = [], key) => {
          const integration = entitySource.collection.state[key].domain;
          if (!domains.includes(integration.toLowerCase())) {
            return [...all, `${methods.getLabel(key)} is not ${domainsStr}`];
          }
          return all;
        }, []);
      }
      if (out.length > 0) {
        return out;
      }
      return null;
    },
    getOptions(
      restrictToDomain?: string[],
      restrictedIntegrations?: string[]
    ): EntityOption[] {
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
      if (restrictedIntegrations && entitySource.ready) {
        const integrations = restrictedIntegrations.map((x) => x.toLowerCase());
        console.log(entitySource);
        keys = keys.filter((key) => {
          const integration = (
            entitySource.collection.state[key]?.domain ?? ""
          ).toLowerCase();
          console.log({
            [key]: integration,
            domain: integrations[0],
            include: integrations.includes(integration),
          });
          return integrations.includes(integration);
        });
      }
      return keys.map((key) => ({
        id: key,
        label: entities.collection.state[key].attributes.friendly_name ?? key,
        domain: key.split(".")[0] ?? "n/a",
        integration: entitySource.ready
          ? entitySource.collection.state[key].domain ?? "n/a"
          : "...",
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

import { entitiesColl, servicesColl } from "home-assistant-js-websocket"
import { deviceRegistryColl } from "./DeviceRegistry";
import { entityRegistryColl } from "./EntityRegistry";
import { DeviceRegistryItem } from "./types";
import { useHassCollection } from "./useHassCollection"

export type Option<T = {}> = string | ({
    id: string,
    label: string,
} & T)
export type EntityOption = Option<{ domain: string; }>
export type HAEntitiesState = ReturnType<typeof useHAEntities>;
export const useHAEntities = () => {
    const entities = useHassCollection(entitiesColl, state => ({
        domains: Array.from(new Set(Object.keys(state).map(x => x.split('.')[0])).keys()).sort(),
    }));
    const methods = {
        getDomainList(): string[] {
            return entities.additional?.domains ?? []
        },
        validateOptions(options: string[], restrictedDomains?: string[]): null | string[] {
            if (restrictedDomains) {
                const domains = restrictedDomains.map(x => x.toLowerCase())
                const domainsStr = domains.length > 1 ?
                    `one of "${domains.join(', ')}"` :
                    `"${domains[0]}"`
                return options.reduce<string[]>((all = [], key) => {
                    if (!domains.includes(key.toLowerCase().split('.')[0])) {
                        return [
                            ...all,
                            `${methods.getLabel(key)} is not ${domainsStr}`
                        ]
                    }
                    return all
                }, [])
            }
            return null
        },
        getOptions(restrictToDomain?: string[]): EntityOption[] {
            if (!entities.ready) {
                return []
            }
            let keys = Object.keys(entities.collection.state);
            if (restrictToDomain) {
                const domains = restrictToDomain.map(x => x.toLowerCase())
                keys = keys.filter(key => domains.includes(key.toLowerCase().split('.')[0]))
            }
            return keys.map(key => ({
                id: key,
                label: entities.collection.state[key].attributes.friendly_name ?? key,
                domain: key.split('.')[0] ?? "n/a",
            }))
        },
        getLabel: (opt: EntityOption): string => {
            if (typeof opt === 'string') {
                if (entities.ready) {
                    return entities.collection.state[opt]?.attributes.friendly_name ?? opt;
                }
                return opt
            }
            return opt.label ?? opt.id
        },
        getID: (opt: EntityOption): string => {
            if (typeof opt === 'string') {
                return opt
            }
            return opt.id
        }
    }
    return {
        ...entities,
        ...methods
    }
}

export const useHAServices = () => {
    const services = useHassCollection(servicesColl);

    return services
}

export type DeviceRegistryOption = Option<{ manufacturer: string }>;
export const useHADeviceRegistry = () => {
    const dr = useHassCollection(deviceRegistryColl)
    const getLabelForItem = (item: DeviceRegistryItem) => item ? item.name_by_user ??
        item.name ??
        item.id :
        "";
    const methods = {
        getOptions(): DeviceRegistryOption[] {
            if (!dr.ready) {
                return []
            }
            const keys = Object.keys(dr.collection.state);
            return keys.map(key => ({
                id: key,
                label: getLabelForItem(dr.collection.state[key]) ?? key,
                manufacturer: dr.collection.state[key].manufacturer ?? "",
            }))
        },
        getLabel: (opt: DeviceRegistryOption): string => {
            if (typeof opt === 'string') {
                if (dr.ready) {
                    return getLabelForItem(dr.collection.state[opt]) ?? opt
                }
                return opt
            }
            return opt.label ?? opt.id
        },
        getID: (opt: DeviceRegistryOption): string => {
            if (typeof opt === 'string') {
                return opt
            }
            return opt.id
        }
    }
    return { ...dr, ...methods }
}
export const useHAEntityRegistry = () => {
    const dr = useHassCollection(entityRegistryColl)

    return dr
}
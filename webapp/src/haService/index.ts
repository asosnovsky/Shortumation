import { entitiesColl, servicesColl } from "home-assistant-js-websocket"
import { Namer } from "utils/formatting";
import { deviceRegistryColl } from "./DeviceRegistry";
import { entityRegistryColl } from "./EntityRegistry";
import { DeviceRegistryItem } from "./types";
import { useHassCollection } from "./useHassCollection"
import { useHAConnection } from './connection';
import { useSnackbar } from "notistack";

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

export type ServiceOption = Option<{ domain: string, action: string, description: string }>;
export const useHAServices = () => {
    const services = useHassCollection(servicesColl);
    const methods = {
        getOptions(): ServiceOption[] {
            if (!services.ready) {
                return []
            }
            return Object.keys(services.collection.state).reduce<ServiceOption[]>((all, domain) => {
                const opts = Object.keys(services.collection.state[domain]).map<ServiceOption>(
                    action => ({
                        id: `${domain}.${action}`,
                        label: services.collection.state[domain][action].name ?? `${domain}.${action}`,
                        description: services.collection.state[domain][action].description ?? "",
                        domain,
                        action,
                    })
                )
                return all.concat(opts);
            }, [])
        },
        getLabel: (opt: ServiceOption): string => {
            if (typeof opt === 'string') {
                if (services.ready) {
                    try {
                        const [domain, action] = opt.split('.');
                        return services.collection.state[domain][action].name ?? opt;
                    } catch (_) { }
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

    return { ...services, ...methods }
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
        target: any = {},
    ) => {
        if (conn.status === 'loaded') {
            try {
                const result = await conn.connection.sendMessagePromise({
                    "type": "call_service",
                    domain,
                    service,
                    target,
                    service_data: data
                })
                enqueueSnackbar(`Successfully called ${domain}.${service}`, {
                    "variant": "success",
                })
                return result
            } catch (err: any) {
                let msg = JSON.stringify(err)
                if ('message' in err) {
                    msg = err.message
                }
                enqueueSnackbar(`Failed to call ${domain}.${service} because '${msg}'`, {
                    "variant": "error",
                })
                return
            }
        } if (conn.status === 'error') {
            enqueueSnackbar(`Failed to call service because connection is '${conn.status}' -- ${conn.error}`, {
                "variant": "error"
            })
        } else {
            enqueueSnackbar(`Failed to call service because connection is '${conn.status}'`, {
                "variant": "error"
            })
        }
    }

    const namer: Namer = {
        getDeviceName(device_id) {
            return devices.getLabel(device_id)
        },
        getEntityName(entity_id, maxEntities = 1) {
            if (Array.isArray(entity_id)) {
                return entity_id.slice(0, maxEntities).map(entities.getLabel).join(', ')
            }
            return entities.getLabel(entity_id)
        },
        getServiceName(service) {
            return services.getLabel(service)
        },
    }

    return {
        entities,
        devices,
        services,
        namer,
        callService,
        reloadAutomations: () => callService("automation", "reload")
    }
}
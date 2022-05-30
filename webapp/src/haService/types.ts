export type EntityRegisteryItem = {
    area_id: string | null;
    config_entry_id: string | null;
    device_id: string | null;
    disabled_by:
    | "integration"
    | "user"
    | "config_entry"
    | string
    | null
    ;
    entity_category:
    | "diagnostic"
    | "config"
    | string
    | null
    ;
    hidden_by:
    | "integration"
    | "user"
    | string
    | null
    ;
    icon: string | null;
    name: string | null;
    platform: string | null;
}

export type DeviceRegistryItem = {
    id: string;
    name: string;
    name_by_user: string | null;
    manufacturer: string | null;
    entry_type: 'service' | string | null;
    disabled_by: EntityRegisteryItem['disabled_by'];
    area_id: string | null;
}

export type HassDevices = Array<DeviceRegistryItem>;
export type HassEntitiesRegistry = Array<EntityRegisteryItem>;
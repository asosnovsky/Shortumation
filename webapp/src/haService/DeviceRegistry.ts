import { Connection, getCollection } from "home-assistant-js-websocket";
import { DeviceRegistryItem, HassDevices } from './types';


export const fetchDeviceRegistry = (conn: Connection): Promise<Record<string, DeviceRegistryItem>> =>
    conn.sendMessagePromise<HassDevices>({
        "type": "config/device_registry/list"
    }).then(
        data =>
            data.filter(
                ({ disabled_by }) => !disabled_by
            ).reduce<Record<string, DeviceRegistryItem>>((all, n) => {
                all[n.id] = n
                return all
            }, {}
            ))
export const deviceRegistryColl = (conn: Connection) => getCollection<Record<string, DeviceRegistryItem>>(
    conn,
    "_$drc",
    fetchDeviceRegistry
)
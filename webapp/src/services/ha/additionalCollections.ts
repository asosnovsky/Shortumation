import { Connection, getCollection } from "home-assistant-js-websocket";
import {
  DeviceRegistryItem,
  EntitySource,
  HassDevices,
  HassEntitiesRegistry,
} from "./types";

export const fetchDeviceRegistry = (
  conn: Connection
): Promise<Record<string, DeviceRegistryItem>> =>
  conn
    .sendMessagePromise<HassDevices>({
      type: "config/device_registry/list",
    })
    .then((data) =>
      data
        .filter(({ disabled_by }) => !disabled_by)
        .reduce<Record<string, DeviceRegistryItem>>((all, n) => {
          all[n.id] = n;
          return all;
        }, {})
    );
export const deviceRegistryColl = (conn: Connection) =>
  getCollection<Record<string, DeviceRegistryItem>>(
    conn,
    "_$drc",
    fetchDeviceRegistry
  );

export const fetchEntityRegistry = (conn: Connection) =>
  conn
    .sendMessagePromise<HassEntitiesRegistry>({
      type: "config/entity_registry/list",
    })
    .then((data) => data.filter(({ disabled_by }) => !disabled_by));
export const entityRegistryColl = (conn: Connection) =>
  getCollection<HassEntitiesRegistry>(conn, "_$erc", fetchEntityRegistry);

export const fetchEntitySource = (conn: Connection) =>
  conn.sendMessagePromise<Record<string, EntitySource>>({
    type: "entity/source",
  });
export const entitySourceColl = (conn: Connection) =>
  getCollection<Record<string, EntitySource>>(conn, "_$esc", fetchEntitySource);

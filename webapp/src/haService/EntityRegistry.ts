import { Connection, getCollection } from "home-assistant-js-websocket";
import { HassEntitiesRegistry } from './types';


export const fetchEntityRegistry = (conn: Connection) => conn.sendMessagePromise<HassEntitiesRegistry>({
    "type": "config/entity_registry/list"
}).then(data => data.filter(({ disabled_by }) => !disabled_by))
export const entityRegistryColl = (conn: Connection) => getCollection<HassEntitiesRegistry>(conn, "_$erc", fetchEntityRegistry)


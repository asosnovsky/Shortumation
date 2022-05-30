import { entitiesColl, servicesColl } from "home-assistant-js-websocket"
import { useHassCollection } from "./useHassCollection"


export const useHAService = () => {
    const entities = useHassCollection(entitiesColl);
    const services = useHassCollection(servicesColl);

    return {
        entities,
        services,
    }
}
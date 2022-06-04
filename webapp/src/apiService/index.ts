import { AutomationData } from 'types/automations';
import { makeAutomationAPI } from './automations';
import { makeRemoteAPI } from "./base";
import { useAPIService } from './core';
import { useMockAPI } from "./mock";

const locationPrefixWeb = window.location.pathname.match(/(\/.+\/)web/i);
const baseURL = new URL(
  process.env.NODE_ENV === 'development' ?
    "http://localhost:8000" :
    window.location.origin + (!locationPrefixWeb ? '' : locationPrefixWeb[1])
);
export const wsURL = baseURL + "socket"
console.log({ baseURL, wsURL })
export const remoteAutoAPI = makeRemoteAPI(
  baseURL + "automations"
);
export const useConnectedApiService = () => useAPIService(
  makeAutomationAPI(remoteAutoAPI)
);
export const useMockApiService = (initialAutos: AutomationData[]) => useAPIService(
  makeAutomationAPI(useMockAPI(initialAutos))
);

import { AutomationData } from 'types/automations';
import { makeAutomationAPI } from './automations';
import { makeRemoteAPI } from "./base";
import { useAPIService } from './core';
import { useMockAPI } from "./mock";

const locationPrefixWeb = window.location.pathname.match(/(.+)\/web/i);

export const useConnectedApiService = () => useAPIService(
  makeAutomationAPI(makeRemoteAPI(
    process.env.NODE_ENV === 'development' ?
      "http://localhost:8000/automations" :
      (!locationPrefixWeb ? '' : locationPrefixWeb[1]) + "/automations"
  ))
);
export const useMockApiService = (initialAutos: AutomationData[]) => useAPIService(
  makeAutomationAPI(useMockAPI(initialAutos))
);

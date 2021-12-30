import { AutomationData } from 'types/automations';
import { makeAutomationAPI } from './automations';
import { makeRemoteAPI } from "./base";
import { useAPIService } from './core';
import {useMockAPI} from "./mock";

export const useConnectedApiService = () => useAPIService(
  makeAutomationAPI(makeRemoteAPI("/api/v1"))
);
export const useMockApiService = (initialAutos: AutomationData[]) => useAPIService(
  makeAutomationAPI(useMockAPI(initialAutos))
);

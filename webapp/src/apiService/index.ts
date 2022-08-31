import { AutomationData } from "types/automations";
import { makeAutomationAPI } from "./automations";
import { makeRemoteAPI } from "./base";
import { useAPIService } from "./core";
import { useAutoMockAPI, useProfileMockAPI } from "./mock";
import { createContext, useContext, useRef } from "react";
import { makeProfileAPI } from "./profile";
import { ApiState } from "./types";

const locationPrefixWeb = window.location.pathname.match(/(\/.+\/)web/i);
const baseURL = new URL(
  process.env.NODE_ENV === "development"
    ? `http://${window.location.hostname}:8000`
    : window.location.origin + (!locationPrefixWeb ? "" : locationPrefixWeb[1])
);
export const wsURL = baseURL + "socket";
export const remoteAutoAPI = makeRemoteAPI(baseURL + "automations");
export const detailsAPI = makeRemoteAPI(baseURL + "details/");
export const useConnectedApiService = () =>
  useAPIService(makeAutomationAPI(remoteAutoAPI), makeProfileAPI(detailsAPI));
export const useMockApiService = (
  initialAutos: AutomationData[],
  returnErrors: boolean = false
) =>
  useAPIService(
    makeAutomationAPI(useAutoMockAPI(initialAutos, useRef, returnErrors)),
    makeProfileAPI(useProfileMockAPI())
  );

const ApiStateContext = createContext<ApiState>({
  automations: { ready: false },
  userProfile: { ready: false },
});
export const ApiStateProvider = ApiStateContext.Provider;
export const useApiState = () => useContext(ApiStateContext);

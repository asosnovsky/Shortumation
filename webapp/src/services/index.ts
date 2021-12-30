import { makeAutomationAPI, AutomationAPI } from './automations';
import { makeRemoteAPI } from "./base";

const api = makeRemoteAPI("/api/v1");
export const automationAPI: AutomationAPI = makeAutomationAPI(api);

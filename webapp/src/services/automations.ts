import { AutomationData } from "types/automations";
import { API } from "./base";


export const makeAutomationAPI = (api: API) => ({
  async list(offset: number, limit: number) {
    return await api.makeCall<AutomationData[]>({
      path: "/automations/list",
      data: {
        offset, limit,
      }
    });
  }
})


export type AutomationAPI = ReturnType<typeof makeAutomationAPI>;

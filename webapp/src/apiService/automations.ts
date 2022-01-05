import { AutomationData } from "types/automations";
import { API } from "./base";
import { ListData, ListParams } from "./types";
import { AUTOMTAION_LIST, AUTOMTAION_ROOT } from './paths';


export const makeAutomationAPI = (api: API) => ({
  async list({ offset, limit }: ListParams) {
    const data = await api.makeCall<ListData<AutomationData>, ListParams>({
      path: AUTOMTAION_LIST,
      data: {
        offset, limit,
      }
    });
    return data;
  },
  async update({index, auto}: {index: number, auto: AutomationData}) {
    return await api.makeCall({
      path: AUTOMTAION_ROOT,
      data: {
        index,
        data: auto
      },
    })
  },
  async remove({index}: {index: number}) {
    return await api.makeCall({
      method: "DELETE",
      path: AUTOMTAION_ROOT,
      data: {
        index,
      }
    })
  }
});


export type AutomationAPI = ReturnType<typeof makeAutomationAPI>;

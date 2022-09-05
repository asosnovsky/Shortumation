import { AutomationData, BareAutomationData } from "types/automations";
import { API } from "./base";
import { ListData, ListParams } from "./types";
import {
  AUTOMTAION_LIST,
  AUTOMTAION_ITEM,
  AUTOMTAION_ITEM_TAGS,
} from "./paths";

export const makeAutomationAPI = (api: API) => ({
  async list({ offset, limit }: ListParams) {
    const data = await api.makeCall<ListData<AutomationData>, ListParams>({
      path: AUTOMTAION_LIST,
      data: {
        offset,
        limit,
      },
    });
    return data;
  },
  async update(auto: AutomationData) {
    return await api.makeCall({
      method: "PUT",
      path: AUTOMTAION_ITEM,
      data: auto,
    });
  },
  async create(auto: BareAutomationData) {
    return await api.makeCall({
      method: "POST",
      path: AUTOMTAION_ITEM,
      data: auto,
    });
  },
  async updateTags({
    automation_id,
    tags,
  }: {
    automation_id: string;
    tags: Record<string, string>;
  }) {
    return await api.makeCall({
      path: AUTOMTAION_ITEM_TAGS,
      data: {
        automation_id,
        tags,
      },
    });
  },
  async remove(auto: AutomationData) {
    return await api.makeCall({
      method: "DELETE",
      path: AUTOMTAION_ITEM,
      data: auto,
    });
  },
});

export type AutomationAPI = ReturnType<typeof makeAutomationAPI>;

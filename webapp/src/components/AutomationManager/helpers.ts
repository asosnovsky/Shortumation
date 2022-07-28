import { HassEntities } from "home-assistant-js-websocket";
import { AutomationMetadata } from "types/automations";
import { TagDB } from "./TagDB";
import { AutomationListAuto } from "./types";

export const consolidateAutomations = (
  haEntities: HassEntities,
  configAutomationMetadatas: AutomationMetadata[],
  tagsDB: TagDB
): AutomationListAuto[] => {
  const configData: Record<string, AutomationMetadata> =
    configAutomationMetadatas.reduce(
      (all, n) => ({
        ...all,
        [n.id]: n,
      }),
      {}
    );

  const out = Object.entries(haEntities)
    .filter(([entityId, _]) => entityId.toLowerCase().startsWith("automation."))
    .map<AutomationListAuto>(([entityId, entityData]) => {
      const autoId = entityData.attributes.id;
      let title = entityData.attributes.friendly_name ?? "";
      let description = "";
      let issue: string | undefined = ["on", "off"].includes(entityData.state)
        ? undefined
        : `recived invalid state "${entityData.state}, this could be because you have a lingering automation that was not cleared by homeassistant, try to reboot HA or manually clear this automation from HA Database."`;

      if (configData[autoId]) {
        title = configData[entityData.attributes.id].alias ?? title;
        description =
          configData[entityData.attributes.id].description ?? description;
        delete configData[autoId];
      } else {
        issue = "failed to find this automation in '/config' folder";
      }

      return {
        id: autoId,
        entityId,
        title,
        description,
        state: entityData.state,
        tags: tagsDB.getTags(autoId),
        issue,
      };
    });

  Object.values(configData).forEach((autoMetadata) => {
    out.push({
      id: autoMetadata.id,
      entityId: "",
      title: autoMetadata.alias ?? "",
      description: autoMetadata.description ?? "",
      state: "unregistered",
      tags: tagsDB.getTags(autoMetadata.id),
      issue:
        "homeassistant did not load this automation, try to manually reload automations or restart homeassistant.",
    });
  });

  return out;
};

export const filterAutomations = (
  autos: AutomationListAuto[],
  searchText: string
): AutomationListAuto[] =>
  autos.filter((a) => {
    if (searchText.length > 0) {
      if (
        !(
          (a.description ?? "").toLocaleLowerCase().includes(searchText) ||
          (a.title ?? "").toLocaleLowerCase().includes(searchText)
        )
      ) {
        return false;
      }
    }
    return true;
  });

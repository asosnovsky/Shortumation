import { HassEntities } from "home-assistant-js-websocket";
import { useEffect, useState } from "react";
import { AutomationData } from "types/automations";
import { defaultAutomation } from "utils/defaults";
import { TagDB } from "../TagDB";
import { AutomationManagerAuto } from "../types";

export const useAutomationDB = (
  haEntities: HassEntities,
  configAutomations: AutomationData[],
  tagsDB: TagDB
) => {
  const autoMap = genMapping(haEntities, configAutomations, tagsDB);
  const [newAuto, setNewAuto] =
    useState<null | [AutomationManagerAuto, AutomationData]>(null);

  useEffect(() => {
    if (newAuto && autoMap[newAuto[0].id]) {
      setNewAuto(null);
    }
  }, [autoMap, newAuto]);
  return {
    get managerAutoList() {
      const out = Object.values(autoMap).map(([m, _]) => m);
      if (newAuto) {
        return out.concat([newAuto[0]]);
      } else {
        return out;
      }
    },
    getAutomationData(autoId: string) {
      if (newAuto && newAuto[0].id === autoId) {
        return newAuto[1];
      }
      return (autoMap[autoId] ?? [null, null])[1];
    },
    isAutoNew(autoId: string) {
      return (newAuto && newAuto[0].id === autoId) ?? false;
    },
    removeNew() {
      setNewAuto(null);
    },
    addNew() {
      const auto = defaultAutomation(String(Date.now()));
      setNewAuto([
        {
          id: auto.metadata.id,
          entityId: "",
          title: auto.metadata.alias ?? "",
          description: auto.metadata.description ?? "",
          state: "unregistered",
          tags: {},
          issue: "New Automation",
        },
        auto,
      ]);
      return auto;
    },
  };
};

const genMapping = (
  haEntities: HassEntities,
  configAutomations: AutomationData[],
  tagsDB: TagDB
) => {
  const configData: Record<string, AutomationData> = configAutomations.reduce(
    (all, n) => ({
      ...all,
      [n.metadata.id]: n,
    }),
    {}
  );
  const automatioinMap: Record<
    string,
    [AutomationManagerAuto, AutomationData | null]
  > = {};
  Object.entries(haEntities)
    .filter(([entityId, _]) => entityId.toLowerCase().startsWith("automation."))
    .forEach(([entityId, entityData]) => {
      const autoId = entityData.attributes.id;
      let title = entityData.attributes.friendly_name ?? "";
      let description = "";
      let issue: string | undefined = ["on", "off"].includes(entityData.state)
        ? undefined
        : `recived invalid state "${entityData.state}, this could be because you have a lingering automation that was not cleared by homeassistant, try to reboot HA or manually clear this automation from HA Database."`;
      let found: AutomationData | null = null;

      if (configData[autoId]) {
        found = configData[entityData.attributes.id];
        title = found.metadata.alias ?? title;
        description = found.metadata.description ?? description;
        delete configData[autoId];
      } else {
        issue = "failed to find this automation in '/config' folder";
      }

      automatioinMap[autoId] = [
        {
          id: autoId,
          entityId,
          title,
          description,
          state: entityData.state,
          tags: tagsDB.getTags(autoId),
          issue,
        },
        found,
      ];
    });

  Object.values(configData).forEach((auto) => {
    automatioinMap[auto.metadata.id] = [
      {
        id: auto.metadata.id,
        entityId: "",
        title: auto.metadata.alias ?? "",
        description: auto.metadata.description ?? "",
        state: "unregistered",
        tags: tagsDB.getTags(auto.metadata.id),
        issue:
          "homeassistant did not load this automation, try to manually reload automations or restart homeassistant.",
      },
      auto,
    ];
  });

  return automatioinMap;
};

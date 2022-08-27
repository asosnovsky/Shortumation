import { HassEntities } from "home-assistant-js-websocket";
import { useEffect, useState } from "react";
import { AutomationData, BareAutomationData } from "types/automations";
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
    useState<
      null | [AutomationManagerAuto, AutomationData | BareAutomationData]
    >(null);

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
    getAutomationData(
      autoId: string
    ):
      | null
      | [AutomationManagerAuto, AutomationData | BareAutomationData | null] {
      if (newAuto && newAuto[0].id === autoId) {
        return newAuto;
      }
      return autoMap[autoId] ?? null;
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
          id: auto.id,
          entityId: "",
          title: auto.alias ?? "",
          description: auto.description ?? "",
          state: "unregistered",
          tags: {},
          issue: "New Automation",
          isNew: true,
          source_file: "n/a",
          source_file_type: "n/a",
          configuration_key: ["n/a"],
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
      [n.id]: n,
    }),
    {}
  );
  const automatioinMap: Record<
    string,
    [AutomationManagerAuto, AutomationData | null]
  > = {};
  Object.entries(haEntities)
    .filter(([entityId, _]) => entityId.toLowerCase().startsWith("automation."))
    .forEach(([entityId, entityData], i) => {
      const autoId = entityData.attributes.id ?? `${entityData.state}-${i}`;
      let title = entityData.attributes.friendly_name ?? "";
      let description = "";
      let issue: string | undefined = ["on", "off"].includes(entityData.state)
        ? undefined
        : `recived invalid state "${entityData.state}, this could be because you have a lingering automation that was not cleared by homeassistant, try to reboot HA or manually clear this automation from HA Database."`;
      let found: AutomationData | null = null;
      let source_file = "n/a";
      let source_file_type = "n/a";
      let configuration_key = ["n/a"];
      if (configData[autoId]) {
        found = configData[entityData.attributes.id];
        title = found.alias ?? title;
        description = found.description ?? description;
        source_file = found.source_file ?? source_file;
        source_file_type = found.source_file_type ?? source_file_type;
        configuration_key = found.configuration_key ?? configuration_key;
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
          source_file,
          source_file_type,
          configuration_key,
          issue,
        },
        found,
      ];
    });

  Object.values(configData).forEach((auto) => {
    automatioinMap[auto.id] = [
      {
        id: auto.id,
        entityId: "",
        title: auto.alias ?? "",
        description: auto.description ?? "",
        state: "unregistered",
        tags: tagsDB.getTags(auto.id),
        source_file: auto.source_file,
        source_file_type: auto.source_file_type,
        configuration_key: auto.configuration_key,
        issue:
          "homeassistant did not load this automation, try to manually reload automations or restart homeassistant.",
      },
      auto,
    ];
  });

  return automatioinMap;
};

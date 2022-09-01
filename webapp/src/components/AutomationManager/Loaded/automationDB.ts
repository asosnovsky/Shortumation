import { HassEntities } from "home-assistant-js-websocket";
import { LangStore, useLang } from "lang";
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
  const langStore = useLang();
  const autoMap = genMapping(haEntities, configAutomations, tagsDB, langStore);
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
          readonly: false,
          id: auto.id,
          entityId: "",
          title: auto.alias ?? "",
          description: auto.description ?? "",
          state: langStore.get("AUTOMATION_STATE_UNREGISTERED"),
          tags: {},
          issue: langStore.get("NEW_AUTOMATION"),
          isNew: true,
          source_file: langStore.get("N/A"),
          source_file_type: langStore.get("N/A"),
          configuration_key: [],
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
  tagsDB: TagDB,
  langStore: LangStore
) => {
  const configDataNoId: AutomationData[] = [];
  const configData: Record<string, AutomationData & { id: string }> =
    configAutomations.reduce((all, n) => {
      if (n.id) {
        return {
          ...all,
          [n.id]: n,
        };
      }
      configDataNoId.push(n);
      return all;
    }, {});
  const automatioinMap: Record<
    string,
    [AutomationManagerAuto, AutomationData | null]
  > = {};
  Object.entries(haEntities)
    .filter(([entityId, _]) => entityId.toLowerCase().startsWith("automation."))
    .forEach(([entityId, entityData], i) => {
      const autoId = entityData.attributes.id ?? entityId.split(".")[1];
      let title = entityData.attributes.friendly_name ?? "";
      let description = "";
      let issue: string | undefined = ["on", "off"].includes(entityData.state)
        ? undefined
        : langStore.get("ISSUES_INVALID_STATE", {
            state: entityData.state,
          });
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
        issue = langStore.get("ISSUES_FIND_AUTOMATION_IN_CONFIG");
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
          readonly: found == null,
        },
        found,
      ];
    });

  Object.values(configData).forEach((auto, i) => {
    automatioinMap[auto.id] = [
      {
        id: auto.id,
        entityId: "",
        title: auto.alias ?? "",
        description: auto.description ?? "",
        state: langStore.get("AUTOMATION_STATE_UNREGISTERED"),
        tags: tagsDB.getTags(auto.id),
        source_file: auto.source_file,
        source_file_type: auto.source_file_type,
        configuration_key: auto.configuration_key,
        issue: langStore.get("ISSUES_NO_LOAD_AUTOMATION"),
        readonly: false,
      },
      auto,
    ];
  });
  let failedGeneration: number = 0;
  configDataNoId.forEach((auto) => {
    let generatedAutoId = `automation_${failedGeneration + 1}`;
    if (auto.alias) {
      generatedAutoId = auto.alias
        .toLowerCase()
        .replaceAll(/\W/g, " ")
        .trim()
        .replaceAll(" ", "_");
    } else {
      failedGeneration += 1;
    }
    if (automatioinMap[generatedAutoId]) {
      automatioinMap[generatedAutoId] = [
        {
          ...automatioinMap[generatedAutoId][0],
          issue: langStore.get("ISSUE_MUST_CONTAIN_A_UNQIUE_ID_TO_EDIT", {
            sourceFile: auto.source_file,
          }),
          readonly: true,
        },
        auto,
      ];
    } else {
      automatioinMap[generatedAutoId] = [
        {
          id: generatedAutoId,
          entityId: "",
          title: auto.alias ?? "",
          description: auto.description ?? "",
          state: langStore.get("AUTOMATION_STATE_UNREGISTERED"),
          tags: {},
          source_file: auto.source_file,
          source_file_type: auto.source_file_type,
          configuration_key: auto.configuration_key,
          issue: langStore.get("ISSUE_MUST_CONTAIN_A_UNQIUE_ID_TO_EDIT", {
            sourceFile: auto.source_file,
          }),
          readonly: true,
        },
        auto,
      ];
    }
  });

  return automatioinMap;
};

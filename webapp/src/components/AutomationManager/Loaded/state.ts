import { HassEntities } from "home-assistant-js-websocket";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { AutomationData } from "types/automations";
import { useTagDB } from "../TagDB";
import { useAutomationDB } from "./automationDB";
import { useConfirm } from "material-ui-confirm";

export type UseAutomationManagerStateArgs = {
  configAutomations: AutomationData[];
  hassEntities: HassEntities;
  onUpdateTags: (aid: string, tags: Record<string, string>) => void;
  onAutomationAdd: (auto: AutomationData) => void;
};
export const useAutomationManagerState = ({
  configAutomations,
  hassEntities,
  onUpdateTags,
  onAutomationAdd,
}: UseAutomationManagerStateArgs) => {
  // state
  const confirm = useConfirm();
  const cookies = useAMSCookies();
  const tagsDB = useTagDB(
    configAutomations.map(({ metadata: { id }, tags }) => ({
      id,
      tags,
    })),
    onUpdateTags
  );
  const automationDB = useAutomationDB(hassEntities, configAutomations, tagsDB);

  // alias
  const stillHaveNewAreYouSure = async () => {
    try {
      await confirm({
        content:
          "Selecting another automation will cause you to lose all work done on this new automation. Please save your work on this automation first.",
        confirmationText: "Switch Automation",
        cancellationText: "Cancel",
      });
      return true;
    } catch (_) {
      return false;
    }
  };
  const currentAutomation = automationDB.getAutomationData(
    cookies.currentAutomationId ?? ""
  );

  const methods = {
    get currentAutomationId() {
      return cookies.currentAutomationId;
    },
    get automations() {
      return automationDB.managerAutoList;
    },
    get tagsDB() {
      return tagsDB;
    },
    get currentAutomation() {
      return currentAutomation;
    },
    get currentAutomationIsNew() {
      return automationDB.isAutoNew(cookies.currentAutomationId ?? "");
    },
    async setSelectedAutomationId(i: string | null, force: boolean = false) {
      if (methods.currentAutomationIsNew && !force) {
        if (!(await stillHaveNewAreYouSure())) {
          return;
        }
        automationDB.removeNew();
      }
      cookies.setSelectedAutomation(i);
    },
    async addNew() {
      if (methods.currentAutomationIsNew) {
        if (!(await stillHaveNewAreYouSure())) {
          return;
        }
      }
      const auto = automationDB.addNew();
      methods.setSelectedAutomationId(auto.metadata.id, true);
    },
    updateAutomation(auto: AutomationData) {
      if (methods.currentAutomationIsNew) {
        onAutomationAdd(auto);
      } else {
      }
    },
  };
  return methods;
};

const useAMSCookies = () => {
  const [
    cookies,
    setCookies,
    // eslint-disable-next-line
    _,
  ] = useCookies(["selectedAutomation"]);
  let initialCurrent = null;
  try {
    initialCurrent = cookies.selectedAutomation ?? null;
  } catch (_) {}

  const [selectedAutomation, setSelectedAutomation] =
    useState<string | null>(initialCurrent);

  return {
    currentAutomationId: selectedAutomation,
    setSelectedAutomation(i: string | null) {
      setSelectedAutomation(i);
      setCookies("selectedAutomation", i === null ? undefined : i);
    },
  };
};

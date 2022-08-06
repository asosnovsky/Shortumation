import { HassEntities } from "home-assistant-js-websocket";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { AutomationData } from "types/automations";
import { useTagDB } from "../TagDB";
import { useAutomationDB } from "./automationDB";
import { useConfirm } from "material-ui-confirm";
import { AutomationManagerAutoUpdatable } from "../types";
import { useSnackbar } from "notistack";

export type UseAutomationManagerStateArgs = {
  configAutomations: AutomationData[];
  hassEntities: HassEntities;
  onUpdateTags: (aid: string, tags: Record<string, string>) => void;
  onAutomationAdd: (auto: AutomationData) => void;
  onAutomationUpdate: (aid: string, auto: AutomationData) => void;
  onAutomationStateChange: (eid: string, on: boolean) => void;
  onAutomationRun: (eid: string) => void;
};
export const useAutomationManagerState = ({
  configAutomations,
  hassEntities,
  onUpdateTags,
  onAutomationAdd,
  onAutomationUpdate,
  onAutomationStateChange,
}: UseAutomationManagerStateArgs) => {
  // state
  const confirm = useConfirm();
  const snackbr = useSnackbar();
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
    get currentAutomation(): AutomationData | null {
      return currentAutomation === null ? null : currentAutomation[1];
    },
    get currentAutomationIsNew() {
      return automationDB.isAutoNew(cookies.currentAutomationId ?? "");
    },
    get currentAutomationEntityId(): string | null {
      return currentAutomation === null ? null : currentAutomation[0].entityId;
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
    editorUpdateAutomation(auto: AutomationData) {
      if (methods.currentAutomationIsNew) {
        onAutomationAdd(auto);
      } else if (methods.currentAutomationId) {
        onAutomationUpdate(methods.currentAutomationId, auto);
      }
    },
    sideBarUpdateAutomation(
      a: AutomationManagerAutoUpdatable,
      aid: string,
      eid: string
    ) {
      const previousAuto = automationDB.getAutomationData(aid);
      if (previousAuto && previousAuto[1]) {
        const previousAutoState = previousAuto[1];
        if (
          previousAutoState.metadata.alias !== a.title ||
          previousAutoState.metadata.description !== a.description
        ) {
          onAutomationUpdate(aid, {
            ...previousAutoState,
            metadata: {
              ...previousAutoState.metadata,
              alias: a.title,
              description: a.description,
            },
          });
        }
      } else {
        snackbr.enqueueSnackbar(
          `Failed to save automation "${aid}" contents - ${JSON.stringify(
            a
          )} -- not found in /config`,
          { variant: "error" }
        );
      }
      const previousState =
        previousAuto === null ? null : previousAuto[0].state;
      if (previousState !== a.state) {
        onAutomationStateChange(eid, a.state === "on");
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

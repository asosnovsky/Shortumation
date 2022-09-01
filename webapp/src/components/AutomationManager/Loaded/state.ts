import { HassEntities } from "home-assistant-js-websocket";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { AutomationData, BareAutomationData } from "types/automations";
import { useTagDB } from "../TagDB";
import { useAutomationDB } from "./automationDB";
import { useConfirm } from "material-ui-confirm";
import { AutomationManagerAutoUpdatable } from "../types";
import { useSnackbar } from "notistack";
import { useLang } from "lang";

export type UseAutomationManagerStateArgs = {
  configAutomations: AutomationData[];
  hassEntities: HassEntities;
  onUpdateTags: (aid: string, tags: Record<string, string>) => void;
  onAutomationAdd: (auto: BareAutomationData) => void;
  onAutomationUpdate: (auto: AutomationData) => void;
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
  const langStore = useLang();
  const confirm = useConfirm();
  const snackbr = useSnackbar();
  const cookies = useAMSCookies();
  const tagsDB = useTagDB(
    configAutomations
      .filter((a) => typeof a === "object")
      .map(({ id, tags = {} }) => ({
        id,
        tags,
      }))
      .filter(({ id }) => typeof id === "string") as Array<{
      id: string;
      tags: Record<string, string>;
    }>,
    onUpdateTags
  );
  const automationDB = useAutomationDB(hassEntities, configAutomations, tagsDB);

  // alias
  const stillHaveNewAreYouSure = async () => {
    try {
      await confirm({
        content: langStore.get("WARNING_SWITCHING_FROM_NONE_SAVE"),
        confirmationText: langStore.get("SWITCH_AUTOMATION"),
        cancellationText: langStore.get("CANCEL"),
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
    get currentAutomation(): AutomationData | BareAutomationData | null {
      return currentAutomation === null ? null : currentAutomation[1];
    },
    get currentAutomationIsNew() {
      return automationDB.isAutoNew(cookies.currentAutomationId ?? "");
    },
    get currentAutomationEntityId(): string | null {
      return currentAutomation === null ? null : currentAutomation[0].entityId;
    },
    get currentAutomationIsReadOnly(): boolean {
      return currentAutomation === null ? true : currentAutomation[0].readonly;
    },
    get currentAutomationIssue(): string | undefined {
      return currentAutomation === null
        ? undefined
        : currentAutomation[0].issue;
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
      if (auto.id) {
        methods.setSelectedAutomationId(auto.id, true);
      }
    },
    editorUpdateAutomation(auto: AutomationData | BareAutomationData) {
      if (methods.currentAutomationIsNew) {
        onAutomationAdd(auto);
      } else if (methods.currentAutomationId) {
        onAutomationUpdate(auto as AutomationData);
      }
    },
    sideBarUpdateAutomation(
      a: AutomationManagerAutoUpdatable,
      aid: string,
      eid: string
    ) {
      const previousAuto = automationDB.getAutomationData(aid);
      if (
        previousAuto &&
        previousAuto[1] &&
        "configuration_key" in previousAuto[1] &&
        "source_file" in previousAuto[1] &&
        "source_file_type" in previousAuto[1]
      ) {
        const previousAutoState = previousAuto[1];
        if (
          previousAutoState.alias !== a.title ||
          previousAutoState.description !== a.description
        ) {
          onAutomationUpdate({
            ...previousAutoState,
            alias: a.title,
            description: a.description,
          });
        }
      } else {
        snackbr.enqueueSnackbar(
          langStore.get("ERROR_FAILED_TO_SAVE", {
            aid,
            contents: JSON.stringify(a),
          }),
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

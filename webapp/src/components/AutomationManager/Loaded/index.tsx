import "./index.css";

import { AutomationEditor } from "components/AutomationEditor";
import { DEFAULT_DIMS } from "components/DAGGraph/elements/constants";
import { HassEntities } from "home-assistant-js-websocket";
import { FC, PropsWithChildren } from "react";
import { AutomationData } from "types/automations";
import { consolidateAutomations } from "../helpers";
import { AutomationManagerSidebar } from "../Sidebar";
import { useTagDB } from "../TagDB";
import { useAutomationManagerState } from "./state";
import Alert from "@mui/material/Alert";

export type AutomationManagerLoadedProps = {
  configAutomations: AutomationData[];
  hassEntities: HassEntities;
  onUpdateTags: (aid: string, tags: Record<string, string>) => void;
};
export const AutomationManagerLoaded: FC<
  PropsWithChildren<AutomationManagerLoadedProps>
> = ({ configAutomations, onUpdateTags, hassEntities, children }) => {
  const state = useAutomationManagerState();
  const tagsDB = useTagDB(
    configAutomations.map(({ metadata: { id }, tags }) => ({
      id,
      tags,
    })),
    onUpdateTags
  );

  const automations = consolidateAutomations(
    hassEntities,
    configAutomations.map(({ metadata }) => metadata),
    tagsDB
  );
  const currentAutomation = configAutomations.filter(
    ({ metadata: { id } }) => state.current === id
  );

  return (
    <div className="automation-manager">
      {children}
      <AutomationManagerSidebar
        automations={automations}
        tagsDB={tagsDB}
        selectedAutomationId={state.current}
        onSelectedAutomationId={state.setCurrent}
        onAutomationAdd={() => {}}
        onAutomationDelete={() => {}}
        onAutomationUpdate={() => {}}
      />
      <div className="automation-manager--editor">
        {state.current !== null ? (
          currentAutomation.length > 0 ? (
            <AutomationEditor
              dims={{
                ...DEFAULT_DIMS,
                flipped: true,
              }}
              automation={currentAutomation[0]}
              onUpdate={() => {}}
              tagDB={tagsDB}
            />
          ) : (
            <div>
              <Alert color="warning">
                Failed to find an automation on disk with id {state.current}.
              </Alert>
            </div>
          )
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

import "./index.css";

import { AutomationEditor } from "components/AutomationEditor";
import { DEFAULT_DIMS } from "components/DAGGraph/elements/constants";
import { FC, PropsWithChildren } from "react";
import { AutomationManagerSidebar } from "../Sidebar";
import {
  useAutomationManagerState,
  UseAutomationManagerStateArgs,
} from "./state";
import Alert from "@mui/material/Alert";

export type AutomationManagerLoadedProps = UseAutomationManagerStateArgs & {
  onAutomationDelete: (aid: string, eid: string) => void;
};
export const AutomationManagerLoaded: FC<
  PropsWithChildren<AutomationManagerLoadedProps>
> = ({ children, onAutomationDelete, ...args }) => {
  const state = useAutomationManagerState(args);

  return (
    <div className="automation-manager">
      {children}
      <AutomationManagerSidebar
        automations={state.automations}
        tagsDB={state.tagsDB}
        selectedAutomationId={state.currentAutomationId}
        onSelectedAutomationId={state.setSelectedAutomationId}
        onAutomationAdd={() => state.addNew()}
        onAutomationDelete={(aid, eid) => {
          onAutomationDelete(aid, eid);
          state.setSelectedAutomationId(null);
        }}
        onAutomationUpdate={state.sideBarUpdateAutomation}
      />
      <div className={["automation-manager--editor"].join(" ")}>
        {state.currentAutomationId !== null ? (
          state.currentAutomation ? (
            <AutomationEditor
              dims={{
                ...DEFAULT_DIMS,
                flipped: true,
              }}
              automation={state.currentAutomation}
              onUpdate={state.editorUpdateAutomation}
              tagDB={state.tagsDB}
              isNew={state.currentAutomationIsNew}
            />
          ) : (
            <div>
              <Alert color="warning">
                Failed to find an automation on disk with id{" "}
                {state.currentAutomationId}.
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

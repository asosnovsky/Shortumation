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
import { useConfirm } from "material-ui-confirm";

export type AutomationManagerLoadedProps = UseAutomationManagerStateArgs & {
  onAutomationDelete: (aid: string, eid: string) => void;
};
export const AutomationManagerLoaded: FC<
  PropsWithChildren<AutomationManagerLoadedProps>
> = ({ children, ...args }) => {
  const state = useAutomationManagerState(args);
  const confirm = useConfirm();

  const onAutomationDelete = async (aid: string, eid: string) =>
    confirm({
      title: "Are you sure you want to delete this automation?",
      confirmationText: "Delete",
    })
      .then(() => {
        args.onAutomationDelete(aid, eid);
        state.setSelectedAutomationId(null);
      })
      .catch(() => {});

  return (
    <div className="automation-manager">
      {children}
      <AutomationManagerSidebar
        automations={state.automations}
        tagsDB={state.tagsDB}
        selectedAutomationId={state.currentAutomationId}
        onSelectedAutomationId={state.setSelectedAutomationId}
        onAutomationAdd={() => state.addNew()}
        onAutomationDelete={onAutomationDelete}
        onAutomationUpdate={state.sideBarUpdateAutomation}
        onRun={args.onAutomationRun}
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
              onDelete={() => {
                if (
                  state.currentAutomationId &&
                  state.currentAutomationEntityId
                ) {
                  onAutomationDelete(
                    state.currentAutomationId,
                    state.currentAutomationEntityId
                  );
                }
              }}
              onTrigger={() => {
                if (state.currentAutomationEntityId) {
                  args.onAutomationRun(state.currentAutomationEntityId);
                }
              }}
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

import "./index.css";

import { FC, useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Skeleton from "@mui/material/Skeleton";

import { ApiService } from "apiService/core";
import { HAEntitiesState } from "haService/HAEntities";
import { AutomationManagerLoaded } from "./Loaded";
import { Alert } from "@mui/material";
import { useSnackbar } from "notistack";

export type AutomationManagerProps = {
  onAutomationStateChange: (eid: string, on: boolean) => void;
  haEntities: HAEntitiesState;
  api: ApiService;
};

export const AutomationManager: FC<AutomationManagerProps> = ({
  api,
  haEntities,
  onAutomationStateChange,
}) => {
  const snackbr = useSnackbar();
  const [isSaving, setIsSaving] = useState(false);

  // handle bad states
  if (!haEntities.ready || !api.state.automations.ready) {
    return (
      <div className="automation-manager loading">
        <div className="automation-manager--sidebar loading">
          <Skeleton />
        </div>
        <div className="automation-manager--editor loading">
          <Skeleton />
        </div>
      </div>
    );
  }

  if (!api.state.automations.ok) {
    return (
      <div className="automation-manager error">
        <Alert color="error">
          Failed to load automations from <code>/config</code>
        </Alert>{" "}
        <br />
        <code>{api.state.automations.error}</code>
      </div>
    );
  }

  // alias
  const configAutomations = api.state.automations.data;
  const hassEntities = haEntities.collection.state;
  return (
    <AutomationManagerLoaded
      configAutomations={configAutomations.data}
      hassEntities={hassEntities}
      onAutomationStateChange={onAutomationStateChange}
      onAutomationAdd={(auto) =>
        api.updateAutomation({
          index: configAutomations.totalItems + 1,
          auto,
        })
      }
      onAutomationDelete={(aid) => {
        const index = configAutomations.data.findIndex(
          ({ metadata }) => metadata.id === aid
        );
        if (index >= 0) {
          api.removeAutomation({
            index,
          });
        } else {
          snackbr.enqueueSnackbar(
            "Failed to delete automation, this may be resolved by a refresh or reboot of Home Assistant",
            {
              variant: "error",
            }
          );
        }
      }}
      onAutomationUpdate={(aid, auto) => {
        const index = configAutomations.data.findIndex(
          ({ metadata }) => metadata.id === aid
        );
        if (index >= 0) {
          api.updateAutomation({
            index: configAutomations.data.findIndex(
              ({ metadata }) => metadata.id === aid
            ),
            auto,
          });
        } else {
          snackbr.enqueueSnackbar(
            "Failed to update automation, this may be resolved by a refresh or reboot of Home Assistant.",
            {
              variant: "error",
            }
          );
        }
      }}
      onUpdateTags={async (aid, t) => {
        setIsSaving(true);
        await api.updateTags({
          automation_id: aid,
          tags: t,
        });
        setIsSaving(false);
      }}
    >
      {isSaving && <LinearProgress />}
    </AutomationManagerLoaded>
  );
};

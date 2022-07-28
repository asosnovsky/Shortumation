import "./index.css";

import { FC, useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Skeleton from "@mui/material/Skeleton";

import { ApiService } from "apiService/core";
import { HAEntitiesState } from "haService/HAEntities";
import { AutomationManagerLoaded } from "./Loaded";
import { Alert } from "@mui/material";

export type AutomationManagerProps = {
  haEntites: HAEntitiesState;
  api: ApiService;
};

export const AutomationManager: FC<AutomationManagerProps> = ({
  api,
  haEntites,
}) => {
  const [isSaving, setIsSaving] = useState(false);

  // handle bad states
  if (!haEntites.ready || !api.state.automations.ready) {
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
  const hassEntities = haEntites.collection.state;
  return (
    <AutomationManagerLoaded
      configAutomations={configAutomations.data}
      hassEntities={hassEntities}
      onAutomationAdd={(auto) =>
        api.updateAutomation({
          index: configAutomations.totalItems + 1,
          auto,
        })
      }
      onAutomationDelete={(aid) =>
        api.removeAutomation({
          index: configAutomations.data.findIndex(
            ({ metadata }) => metadata.id === aid
          ),
        })
      }
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

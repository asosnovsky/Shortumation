import { ApiService } from "apiService/core";
import { HAEntitiesState } from "haService/HAEntities";
import { FC, useState } from "react";
import { AutomationManagerLoaded } from "./Loaded";
import LinearProgress from "@mui/material/LinearProgress";

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
    return <div className="automation-manager loading">...</div>;
  }

  if (!api.state.automations.ok) {
    return (
      <div className="automation-manager error">
        <h1>Failed to load</h1>
        {api.state.automations.error}
      </div>
    );
  }

  // alias
  const configAutomations = api.state.automations.data.data;
  const hassEntities = haEntites.collection.state;
  return (
    <div className="automation-manager">
      {isSaving && <LinearProgress />}
      <AutomationManagerLoaded
        configAutomations={configAutomations}
        hassEntities={hassEntities}
        onUpdateTags={async (aid, t) => {
          setIsSaving(true);
          await api.updateTags({
            automation_id: aid,
            tags: t,
          });
          setIsSaving(false);
        }}
      />
    </div>
  );
};

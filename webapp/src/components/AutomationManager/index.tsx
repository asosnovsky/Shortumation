import { ListData } from "apiService/types";
import { HAEntitiesState } from "haService/HAEntities";
import { FC } from "react";
import { AutomationData } from "types/automations";
import { consolidateAutomations } from "./helpers";
import { AutomationListSidebar } from "./Sidebar";
import { useAutomationManagerState } from "./state";
import { useTagDB } from "./TagDB";

export type AutomationListProps = {
  haEntites: HAEntitiesState;
  configAutomations: ListData<AutomationData>;
  onUpdate: (i: number, auto: AutomationData) => void;
  onUpdateTags: (id: string, tags: Record<string, string>) => void;
  onUpdateState: (id: string, state: string) => void;
  onTrigger: (id: string, state: string) => void;
  onAdd: () => void;
  onRemove: (i: number) => void;
};

export const AutomationList: FC<AutomationListProps> = (props) => {
  const state = useAutomationManagerState();

  if (!props.haEntites.ready) {
    return <div className="automation-manager loading">...</div>;
  }

  const tagsDB = useTagDB(
    props.configAutomations.data.map(({ metadata: { id }, tags }) => ({
      id,
      tags,
    })),
    props.onUpdateTags
  );
  const automations = consolidateAutomations(
    props.haEntites.collection.state,
    props.configAutomations.data.map(({ metadata }) => metadata),
    tagsDB
  );
  return (
    <div className="automation-manager">
      {/* <AutomationListSidebar
        automations={automations}
        tagsDB={tagsDB}
        selectedAutomationId={state.current}
        onTagUpdate
      /> */}
    </div>
  );
};

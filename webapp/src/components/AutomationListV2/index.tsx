import { ListData } from "apiService/types";
import { HAEntitiesState } from "haService/HAEntities";
import { FC } from "react";
import { AutomationData } from "types/automations";

export type AutomationListProps = {
  haEntites: HAEntitiesState;
  configAutomations: ListData<AutomationData>;
  onUpdate: (i: number, auto: AutomationData) => void;
  onUpdateTags: (id: string, tags: Record<string, string>) => void;
  onAdd: (auto: AutomationData) => void;
  onRemove: (i: number) => void;
};

export const AutomationList: FC<AutomationListProps> = (props) => {
  return <></>;
};

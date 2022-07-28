import { HassEntities } from "home-assistant-js-websocket";
import { FC } from "react";
import { AutomationData } from "types/automations";
import { consolidateAutomations } from "../helpers";
import { useTagDB } from "../TagDB";
import { useAutomationManagerState } from "./state";

export type AutomationManagerLoadedProps = {
  configAutomations: AutomationData[];
  hassEntities: HassEntities;
  onUpdateTags: (aid: string, tags: Record<string, string>) => void;
};
export const AutomationManagerLoaded: FC<AutomationManagerLoadedProps> = ({
  configAutomations,
  onUpdateTags,
  hassEntities,
}) => {
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

  return <></>;
};

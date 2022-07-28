import "./index.css";

import { FC, useState } from "react";

import Skeleton from "@mui/material/Skeleton";

import { HAEntitiesState } from "haService/HAEntities";
import { AutomationMetadata } from "types/automations";
import InputText from "components/Inputs/InputText";
import InputMultiSelect from "components/Inputs/InputMultiSelect";

import { ListBoxGroup } from "../ListBoxGroup";
import { consolidateAutomations, filterAutomations } from "../helpers";
import { TagDB } from "../TagDB";
import { convertGroupingToItems, makeGrouping } from "../automationGrouper";
import { AutomationListAutoUpdatable } from "../types";

export type AutomationListSidebarProps = {
  configAutomationMetadatas: AutomationMetadata[];
  tagsDB: TagDB;
  haEntites: HAEntitiesState;
  onTagUpdate: (t: Record<string, string>, aid: string) => void;
  onAutomationUpdate: (
    a: AutomationListAutoUpdatable,
    aid: string,
    eid: string
  ) => void;
  onAutomationDelete: (aid: string) => void;
};
export const AutomationListSidebar: FC<AutomationListSidebarProps> = ({
  configAutomationMetadatas,
  tagsDB,
  haEntites,
  ...events
}) => {
  const [searchText, setSearchText] = useState("");
  const [selectedTagIdx, setSelectedTagIdx] = useState<number[]>([]);
  const [selectedAutomationId, setSelectedAutomationId] =
    useState<null | string>(null);

  if (!haEntites.ready) {
    return <Skeleton className="automation-list loading" />;
  }
  const tags = tagsDB.getTagNames([]);
  let automations = consolidateAutomations(
    haEntites.collection.state,
    configAutomationMetadatas,
    selectedAutomationId ?? "",
    tagsDB
  );

  if (searchText.trim().length > 0) {
    automations = filterAutomations(
      automations,
      searchText.toLocaleLowerCase()
    );
  }

  const grouping = makeGrouping(
    automations,
    selectedTagIdx.map((i) => tags[i]),
    selectedAutomationId
  );

  const items = grouping.top.map((i) =>
    convertGroupingToItems(i, automations, grouping)
  );

  return (
    <div className="automation-list">
      <div className="automation-list-box--nav">
        <InputText label="Search" value={searchText} onChange={setSearchText} />
        <InputMultiSelect
          label="Tags"
          selected={selectedTagIdx}
          onChange={setSelectedTagIdx}
          options={tags}
          max={3}
        />
      </div>
      {items.map((item, i) => (
        <ListBoxGroup
          {...item}
          key={i}
          onSelect={setSelectedAutomationId}
          {...events}
          tagsDB={tagsDB}
          initialOpenState={true}
        />
      ))}
    </div>
  );
};

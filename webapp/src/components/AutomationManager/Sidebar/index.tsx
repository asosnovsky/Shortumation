import "./index.css";

import { FC, useState } from "react";

import InputText from "components/Inputs/InputText";
import InputMultiSelect from "components/Inputs/InputMultiSelect";

import { ListBoxGroup } from "../ListBoxGroup";
import { filterAutomations } from "../helpers";
import { TagDB } from "../TagDB";
import { convertGroupingToItems, makeGrouping } from "../automationGrouper";
import { AutomationListAuto, AutomationListAutoUpdatable } from "../types";
import { Button } from "components/Inputs/Button";

export type AutomationListSidebarProps = {
  tagsDB: TagDB;
  automations: AutomationListAuto[];
  selectedAutomationId: string | null;
  onAutomationUpdate: (
    a: AutomationListAutoUpdatable,
    aid: string,
    eid: string
  ) => void;
  onAutomationDelete: (aid: string) => void;
  onAutomationAdd: () => void;
  onSelectedAutomationId: (aid: string) => void;
};
export const AutomationListSidebar: FC<AutomationListSidebarProps> = ({
  automations,
  tagsDB,
  onAutomationAdd,
  selectedAutomationId,
  onSelectedAutomationId,
  ...events
}) => {
  const [searchText, setSearchText] = useState("");
  const [selectedTagIdx, setSelectedTagIdx] = useState<number[]>([]);

  const tags = tagsDB.getTagNames([]);

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
    convertGroupingToItems(i, selectedAutomationId, automations, grouping)
  );

  return (
    <div className="automation-manager--sidebar">
      <div className="automation-manager--sidebar-box--nav">
        <InputText label="Search" value={searchText} onChange={setSearchText} />
        <InputMultiSelect
          label="Tags"
          selected={selectedTagIdx}
          onChange={setSelectedTagIdx}
          options={tags}
          max={3}
        />
      </div>
      <div className="automation-manager--sidebar-box--list">
        {items.map((item, i) => (
          <ListBoxGroup
            {...item}
            key={i}
            onSelect={onSelectedAutomationId}
            {...events}
            tagsDB={tagsDB}
            initialOpenState={true}
          />
        ))}
      </div>
      <div className="automation-manager--sidebar-box--bottom-buttons">
        <Button onClick={onAutomationAdd} color="primary">
          Add
        </Button>
      </div>
    </div>
  );
};

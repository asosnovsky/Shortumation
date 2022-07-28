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
  onTagUpdate: (t: Record<string, string>, aid: string) => void;
  onAutomationUpdate: (
    a: AutomationListAutoUpdatable,
    aid: string,
    eid: string
  ) => void;
  onAutomationDelete: (aid: string) => void;
  onAutomationAdd: () => void;
};
export const AutomationListSidebar: FC<AutomationListSidebarProps> = ({
  automations,
  tagsDB,
  onAutomationAdd,
  ...events
}) => {
  const [searchText, setSearchText] = useState("");
  const [selectedTagIdx, setSelectedTagIdx] = useState<number[]>([]);
  const [selectedAutomationId, setSelectedAutomationId] =
    useState<null | string>(null);

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
      <div className="automation-list-box--list">
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
      <div className="automation-list-box--bottom">
        <Button onClick={onAutomationAdd} color="primary">
          Add
        </Button>
      </div>
    </div>
  );
};

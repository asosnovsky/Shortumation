import "./AutomationListBox.css";
import { FC, useState } from "react";
import { AutomationData } from "types/automations";
import InputMultiSelect from "components/Inputs/InputMultiSelect";
import InputText from "components/Inputs/InputText";
import { Button } from "components/Inputs/Button";
import { makeGrouping } from "./automationGrouper";
import { AutomationListBoxGroup } from "./AutomationListBoxGroup";
import { useCookies } from "react-cookie";
import { TagDB } from "components/AutomationList/TagDB";

export type Props = {
  automations: AutomationData[];
  selected: number;
  onSelectAutomation: (i: number) => void;
  onRemove: (i: number) => void;
  onAdd: () => void;
  tagsDB: TagDB;
};

const useAutomationListBoxState = () => {
  const [
    cookies,
    setCookies,
    // eslint-disable-next-line
    _,
  ] = useCookies(["albSearchText", "albSelected"]);
  let initialSelected = [];
  try {
    initialSelected = JSON.parse(cookies.albSelected);
    if (!Array.isArray(initialSelected)) {
      initialSelected = [initialSelected];
    }
    initialSelected = initialSelected.map(Number);
    // eslint-disable-next-line
  } catch (_) {}
  const [searchText, setSearchText] = useState(cookies.albSearchText ?? "");
  const [selectedTagIdx, setSelectedTagIdx] =
    useState<number[]>(initialSelected);

  return {
    searchText,
    setSearchText(v: string) {
      setSearchText(v);
      setCookies("albSearchText", v);
    },
    setSelectedTagIdx(n: number[]) {
      setSelectedTagIdx(n);
      setCookies("albSelected", JSON.stringify(n));
    },
    selectedTagIdx,
  };
};

export const AutomationListBox: FC<Props> = ({
  automations,
  selected,
  onSelectAutomation,
  onAdd,
  onRemove,
  tagsDB,
}) => {
  const tags = getTagList(automations);
  const { searchText, setSearchText, selectedTagIdx, setSelectedTagIdx } =
    useAutomationListBoxState();
  const filteredAutomations = filterAutomations(
    automations,
    searchText.toLowerCase()
  );
  const grouping = makeGrouping(
    filteredAutomations.map(([a, _]) => a),
    selectedTagIdx.map((i) => tags[i]),
    selected
  );

  return (
    <div className="automation-list-box">
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
      <div className="automation-list-box--body">
        <AutomationListBoxGroup
          events={{
            onSelectAutomation,
            onRemove,
          }}
          autos={filteredAutomations}
          grouping={grouping}
          selectedAutomationIdx={selected}
          tagsDB={tagsDB}
        />
      </div>
      <div className="automation-list-box--bottom">
        <Button onClick={onAdd}>Add</Button>
        <span>
          Showing Automations: {filteredAutomations.length} out of{" "}
          {automations.length}
        </span>
      </div>
    </div>
  );
};

export const getTagList = (autos: AutomationData[]): string[] =>
  Object.keys(
    autos
      .map((a) => Object.keys(a.tags))
      .reduce((all: any, keys) => {
        for (const k of keys) {
          all[k] = 1;
        }
        return all;
      }, {})
  );

const filterAutomations = (
  autos: AutomationData[],
  searchText: string
): Array<[AutomationData, number]> =>
  autos
    .map<[AutomationData, number]>((a, i) => [a, i])
    .filter(([a, i]) => {
      if (!a.metadata) {
        return true;
      }
      if (searchText.length > 0) {
        if (
          !(
            (a.metadata.description ?? "")
              .toLocaleLowerCase()
              .includes(searchText) ||
            (a.metadata.alias ?? "").toLocaleLowerCase().includes(searchText)
          )
        ) {
          return false;
        }
      }
      return true;
    });

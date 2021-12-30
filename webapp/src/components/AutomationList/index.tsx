import "./styles.css";
import { AutomationEditor } from "components/AutomationEditor";
import { Button } from "components/Inputs/Button";
import { FC, useState } from "react";
import { AutomationData } from "types/automations";
import { DAGBoardElmDims } from 'components/DAGSvgs/DAGBoard';
import { defaultAutomation } from '../../utils/defaults';
import { ArrowIcon, TrashIcon } from "components/Icons";
import { ButtonIcon } from "components/Icons/ButtonIcons";
import { useSearchParams } from "react-router-dom";
import { ApiService } from "apiService/core";


interface AutomationListParams {
  automations: AutomationData[];
  onUpdate: (i: number, auto: AutomationData) => void;
  onAdd: (auto: AutomationData) => void;
  onRemove: (i: number) => void;
  dims: DAGBoardElmDims;
}

export const AutomationList: FC<AutomationListParams> = ({
  automations,
  onUpdate,
  onAdd,
  onRemove,
  dims,
  children,
}) => {
  // state
  // const [searchParams, setSearchParams] = useSearchParams();
  const [hideList, setHideList] = useState(false);
  const [current, setCurrent] = useState(0);
  // alias
  // const current = Number(searchParams.get("current") ?? "0");
  // const setCurrent = (i: number) => setSearchParams({ current: String(i) });
  const currentAuto = automations.length > 0 ? automations[current] : null;
  const automationListListCls = "automation-list--list" + (hideList ? " hide" : " show")
  // render
  return <div className="automation-list--root">
    <div className={automationListListCls}>
      <div className="automation-list--list-box">
        {automations.map((auto, i) =>
          <div key={i} className="automation-list--elm">
            <Button onClick={() => onRemove(i)} className="automation-list--elm-remove"><TrashIcon /></Button>
            <Button onClick={() => setCurrent(i)}>
              {auto.metadata.alias.slice(0, 15)} <br />
              <span>{auto.metadata.description.slice(0, 25)}</span>
            </Button>
          </div>
        )}
        <Button onClick={() => {
          onAdd(defaultAutomation(`shortu-${automations.length}`));
          setCurrent(automations.length)
        }}>Add</Button>
      </div>
      <ButtonIcon
        onClick={() => setHideList(!hideList)}
        className="automation-list--list-hide"
      >
        {ArrowIcon}
      </ButtonIcon>
    </div>
    <div className="automation-list--viewer">
      {currentAuto ? <AutomationEditor
        automation={currentAuto}
        onUpdate={a => onUpdate(current, a)}
        dims={dims}
      /> : <></>}
    </div>
    {children}
  </div>
}

interface ConnectedAutmationListParams {
  dims: DAGBoardElmDims;
  api: ApiService;
}
export const ConnectedAutmationList: FC<ConnectedAutmationListParams> = ({
  api: {
    state: {
      automations,
    },
    removeAutomation,
    updateAutomation,
  },
  dims
}) => {
  if (!automations.ready) {
    return <span>Loading...</span>
  }
  if (!automations.ok) {
    return <span>Error {automations.error}</span>
  }
  return <AutomationList
    dims={dims}
    automations={automations.data.data}
    onAdd={auto => updateAutomation({ auto, index: automations.data.totalItems + 1 })}
    onRemove={index => removeAutomation({ index })}
    onUpdate={(index, auto) => updateAutomation({ index, auto })}
  />
}

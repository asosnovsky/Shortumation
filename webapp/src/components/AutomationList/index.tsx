import "./styles.css";
import { AutomationEditor } from "components/AutomationEditor";
import { Button } from "components/Inputs/Button";
import { FC, useState } from "react";
import { AutomationData } from "types/automations";
import { DAGBoardElmDims } from 'components/DAGSvgs/DAGBoard';
import { defaultAutomation } from '../../utils/defaults';
import { ArrowIcon, TrashIcon } from "components/Icons";
import { ButtonIcon } from "components/Icons/ButtonIcons";


interface Props {
  automations: AutomationData[];
  onUpdate: (i: number, auto: AutomationData) => void;
  onAdd: (auto: AutomationData) => void;
  onRemove: (i: number) => void;
  dims: DAGBoardElmDims;
}

export const AutomationList: FC<Props> = ({
  automations,
  onUpdate,
  onAdd,
  onRemove,
  dims,
}) => {
  // state
  const [current, setCurrent] = useState(0);
  const [hideList, setHideList] = useState(false);
  // alias
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
        <Button onClick={() => onAdd(defaultAutomation(`shortu-${automations.length}`))}>Add</Button>
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
  </div>
}

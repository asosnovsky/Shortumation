import { AutomationCondition } from 'types/automations/conditions';
import { ConditionEditor } from "components/ConditionEditor";
import { OptionManager } from "./OptionManager";


export const ConditionLogicState: OptionManager<AutomationCondition> = {
  defaultState: () => ({
    condition: 'and',
    alias: "",
    conditions: [],
  }),
  isReady: _ => true,
  renderOptionList: (state, setState) => <ConditionEditor
    condition={state}
    onUpdate={setState}
    onDelete={() => { }}
  />
}

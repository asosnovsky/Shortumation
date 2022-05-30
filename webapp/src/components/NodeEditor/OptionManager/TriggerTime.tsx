import { OptionManager } from './OptionManager';
import { AutomationTriggerTime } from 'types/automations/triggers';
import InputTime from 'components/Inputs/InputTime';
import { convertObjectToAutomationTimeString } from 'utils/time';


export const TriggerTime: OptionManager<AutomationTriggerTime> = {
  defaultState: () => ({
    "platform": 'time',
    "at": "",
  }),
  isReady: () => true,
  renderOptionList: (state, setState) => {
    return <>
      <InputTime
        label="At"
        value={state.at}
        onChange={_at => setState({
          ...state,
          at: _at ? convertObjectToAutomationTimeString(_at) : "00:00:00",
        })}
      />
    </>
  }
}

import { OptionManager } from './OptionManager';
import { AutomationTriggerTime } from 'types/automations/triggers';
import InputTime from 'components/Inputs/InputTime';


export const TriggerTime: OptionManager<AutomationTriggerTime> = {
  defaultState: () => ({
    $smType: 'trigger',
    "alias": "",
    "platform": 'time',
    "at": {},
  }),
  isReady: ({ alias }) => {
    return (alias !== '')
  },
  renderOptionList: (state, setState) => {
    return <>
      <InputTime
        label="At"
        value={state.at}
        onChange={_at => setState({
          ...state,
          at: _at ?? {},
        })}
      />
    </>
  }
}

import { OptionManager } from './OptionManager';
import { AutomationTriggerTimePattern } from 'types/automations/triggers';
import InputText from 'components/Inputs/InputText';


export const TriggerTimePattern: OptionManager<AutomationTriggerTimePattern> = {
  defaultState: () => ({
    $smType: 'trigger',
    "alias": "",
    "platform": 'time_pattern',
  }),
  isReady: ({ alias }) => {
    return (alias !== '')
  },
  renderOptionList: (state, setState) => {
    return <>
      <InputText label="Hours" value={state.hours ?? ""} onChange={hours => setState({
        ...state,
        hours
      })} />
      <InputText label="Minutes" value={state.minutes ?? ""} onChange={minutes => setState({
        ...state,
        minutes
      })} />
      <InputText label="Seconds" value={state.seconds ?? ""} onChange={seconds => setState({
        ...state,
        seconds
      })} />
    </>
  }
}

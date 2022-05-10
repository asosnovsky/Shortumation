import { OptionManager } from './OptionManager';
import { AutomationTriggerHA } from 'types/automations/triggers';
import { InputList } from "components/Inputs/InputList";


export const TriggerHAState: OptionManager<AutomationTriggerHA> = {
  defaultState: () => ({
    "alias": "HA Starts",
    "platform": "homeassistant",
    "event": "start",
  }),
  isReady: ({ alias }) => {
    return (alias !== '')
  },
  renderOptionList: (state, setState) => {
    return <>
      <InputList
        label="Event Type"
        current={state.event}
        options={['start', 'shutdown']}
        onChange={event => setState({
          ...state, event,
          alias: event === 'shutdown' ? "HA Shutdown" : "HA Starts"
        })}
      />
    </>
  }
}

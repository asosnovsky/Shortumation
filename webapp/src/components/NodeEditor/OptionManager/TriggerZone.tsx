import { OptionManager } from './OptionManager';
import { AutomationTriggerZone } from 'types/automations/triggers';
import InputText from 'components/Inputs/InputText';
import { InputList } from 'components/Inputs/InputList';
import { InputEntity } from 'components/Inputs/InputTextBubble';


export const TriggerZone: OptionManager<AutomationTriggerZone> = {
  defaultState: () => ({
    "alias": "",
    "platform": 'zone',
    "zone": "",
    "event": "enter",
    "entity_id": "",
  }),
  isReady: ({ alias }) => {
    return (alias !== '')
  },
  renderOptionList: (state, setState) => {
    return <>
      <InputText label="Zone" value={state.zone ?? ""} onChange={zone => setState({
        ...state,
        zone
      })} />
      <InputList
        label="Event"
        current={state.event}
        options={['enter', 'leave']}
        onChange={event => setState({
          ...state, event,
        })}
      />
      <InputEntity
        value={state.entity_id}
        onChange={entity_id => setState({
          ...state,
          entity_id
        })}
      />
    </>
  }
}

import { OptionManager } from './OptionManager';
import { AutomationTriggerDevice } from 'types/automations/triggers';
import InputText from 'components/Inputs/InputText';


export const TriggerDevice: OptionManager<AutomationTriggerDevice> = {
  defaultState: () => ({
    "alias": "",
    "platform": 'device',
    "domain": "",
    "type": "",
    "subtype": "",
    "device_id": "",
  }),
  isReady: ({ alias }) => {
    return (alias !== '')
  },
  renderOptionList: (state, setState) => {
    return <>
      <InputText label="Domain" value={state.domain ?? ""} onChange={domain => setState({
        ...state,
        domain
      })} />
      <InputText label="Type" value={state.type ?? ""} onChange={type => setState({
        ...state,
        type
      })} />
      <InputText label="Subtype" value={state.subtype ?? ""} onChange={subtype => setState({
        ...state,
        subtype
      })} />
      <InputText label="Device" value={state.device_id ?? ""} onChange={device_id => setState({
        ...state,
        device_id
      })} />
    </>
  }
}

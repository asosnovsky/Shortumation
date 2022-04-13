import { OptionManager } from './OptionManager';
import { AutomationTriggerWebhook } from 'types/automations/triggers';
import InputText from 'components/Inputs/InputText';


export const TriggerWebhook: OptionManager<AutomationTriggerWebhook> = {
  defaultState: () => ({
    $smType: 'trigger',
    "alias": "",
    "platform": 'webhook',
    "webhook_id": "",
  }),
  isReady: ({ alias }) => {
    return (alias !== '')
  },
  renderOptionList: (state, setState) => {
    return <>
      <InputText label="Webhook ID" value={state.webhook_id ?? ""} onChange={webhook_id => setState({
        ...state,
        webhook_id
      })} />
    </>
  }
}

import { OptionManager } from './OptionManager';
import { AutomationTriggerTemplate } from 'types/automations/triggers';
import InputText from 'components/Inputs/InputText';
import { InputEntity } from 'components/Inputs/InputTextBubble';
import InputNumber from 'components/Inputs/InputNumber';
import InputTextArea from 'components/Inputs/InputTextArea';
import InputTime from 'components/Inputs/InputTime';


export const TriggerTemplate: OptionManager<AutomationTriggerTemplate> = {
  defaultState: () => ({
    $smType: 'trigger',
    "alias": "",
    "platform": 'template',
    "value_template": "",
  }),
  isReady: ({ alias }) => {
    return (alias !== '')
  },
  renderOptionList: (state, setState) => {
    return <>
      <InputText
        label='Template'
        value={state.value_template}
        onChange={value_template => setState({ ...state, value_template })}
      />
      <InputTime
        label="For"
        value={state.for}
        onChange={_for => setState({
          ...state,
          for: _for,
        })}
      />
    </>
  }
}

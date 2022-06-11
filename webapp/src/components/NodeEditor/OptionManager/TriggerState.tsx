import { OptionManager } from './OptionManager';
import { AutomationTriggerState } from 'types/automations/triggers';
import InputText from 'components/Inputs/InputText';
import { InputEntity } from 'components/Inputs/InputEntities';
import { InputTime } from 'components/Inputs/InputTime';


export const TriggerState: OptionManager<AutomationTriggerState> = {
  defaultState: () => ({
    "platform": 'state',
    "entity_id": "",
  }),
  isReady: () => true,
  renderOptionList: (state, setState) => {
    return <>
      <InputEntity
        value={state.entity_id}
        multiple
        onChange={entity_id => setState({
          ...state,
          entity_id
        })}
      />
      <InputText label="Attribute" value={state.attribute ?? ""} onChange={attribute => setState({
        ...state,
        attribute
      })} />
      <InputText
        label="From"
        value={state.from ?? ""}
        onChange={from => setState({
          ...state,
          from,
        })}
      />
      <InputText
        label="To"
        value={state.to ?? ""}
        onChange={to => setState({
          ...state,
          to,
        })}
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

import InputText from "components/Inputs/InputText";
import { ServiceAction } from "types/automations/actions";
import { BaseOptionManager, updateActionData } from './BaseOptionManager';


export default class ActionCallServiceState extends BaseOptionManager<ServiceAction> {
  defaultState = () => ({
    $smType: 'action',
    action: 'service',
    action_data: {
      service: "",
      target: "",
      data: {},
    }
  } as ServiceAction)
  isReady(state: ServiceAction): boolean {
    const { service, alias, target } = state.action_data;
    return service !== '' &&
      alias !== '' &&
      target !== ''
  }
  renderOptionList(state: ServiceAction): JSX.Element {
    const { service, alias = "", target } = state.action_data;
    const update = updateActionData(state, this.setState);
    return <div className="state-manager-options">
      <InputText
        label="Description"
        value={alias}
        onChange={alias => update({ alias })}
      />
      <InputText
        textBoxFor="service"
        label="Service"
        value={service}
        onChange={service => update({ service })}
      />
      <InputText
        label="Target"
        value={target}
        onChange={target => update({ target })}
      />
    </div>
  }
}

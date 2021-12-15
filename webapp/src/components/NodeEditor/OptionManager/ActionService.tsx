import InputText from "components/Inputs/InputText";
import { ServiceAction } from "types/automations/actions";
import { OptionManager, updateActionData } from './OptionManager';


export const ActionCallServiceState: OptionManager<ServiceAction> = {
  defaultState: () => ({
    $smType: 'action',
    action: 'service',
    action_data: {
      service: "",
      target: "",
      data: {},
    }
  }),
  isReady: ({
    action_data: { service, alias, target }
  }) => (
    service !== '' &&
    alias !== '' &&
    target !== ''
  ),
  renderOptionList: (state, setState) => {
    const { service, alias = "", target } = state.action_data;
    const update = updateActionData(state, setState);
    return <>
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
    </>
  }
}

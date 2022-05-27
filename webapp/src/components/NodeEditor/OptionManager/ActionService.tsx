import InputText from "components/Inputs/InputText";
import InputYaml from 'components/Inputs/InputYaml';
import { ServiceAction } from "types/automations/actions";
import { OptionManager, updateActionData } from './OptionManager';


export const ActionCallServiceState: OptionManager<ServiceAction> = {
  defaultState: () => ({
    service: "",
    target: {},
    data: {},
  }),
  isReady: ({
    service,
  }) => (
    service !== ''
  ),
  renderOptionList: (state, setState) => {
    const { service, target, data } = state;
    const update = updateActionData(state, setState);
    return <>
      <InputText
        textBoxFor="service"
        label="Service"
        value={service}
        onChange={service => update({ service })}
      />
      <InputYaml
        label="Target"
        value={target}
        onChange={target => update({ target })}
      />
      <InputYaml
        label="Data"
        value={data}
        onChange={data => update({ data })}
      />
    </>
  }
}

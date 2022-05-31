import { InputDevice } from "components/Inputs/InputDevice";
import { InputEntity } from "components/Inputs/InputEntities";
import InputText from "components/Inputs/InputText";
import { DeviceAction } from "types/automations/actions";
import { OptionManager, updateActionData } from './OptionManager';


export const ActionDeviceState: OptionManager<DeviceAction> = {
  defaultState: () => ({
    alias: "",
    device_id: ""
  }),
  isReady: () => true,
  renderOptionList: (state, setState, entities) => {
    const update = updateActionData(state, setState);
    return <>
      <InputDevice
        value={state.device_id ?? ""}
        onChange={device_id => update({ device_id: device_id ?? "" })}
      />
      <InputText
        textBoxFor="type"
        label="Action"
        value={state.type ?? ""}
        onChange={type => update({ type })}
      />
      <InputEntity
        value={state.entity_id ?? ""}
        onChange={entity_id => update({
          entity_id: entity_id ? entity_id : undefined,
          domain: entity_id ? entity_id.split('.')[0] : ""
        })}
      />
    </>
  }
}

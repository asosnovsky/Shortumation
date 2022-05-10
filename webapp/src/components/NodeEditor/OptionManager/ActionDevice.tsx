import InputText from "components/Inputs/InputText";
import { DeviceAction } from "types/automations/actions";
import { OptionManager, updateActionData } from './OptionManager';


export const ActionDeviceState: OptionManager<DeviceAction> = {
  defaultState: () => ({
    alias: "",
    type: "",
    entity_id: "",
    device_id: "",
    domain: "",
  }),
  isReady: ({
    alias,
    type,
    entity_id,
    device_id,
    domain,
  }) => (
    alias !== '' &&
    type !== "" &&
    entity_id !== "" &&
    device_id !== "" &&
    domain !== ""
  ),
  renderOptionList: (state, setState) => {
    const update = updateActionData(state, setState);
    return <>
      <InputText
        label="Description"
        value={state.alias ?? ""}
        onChange={alias => update({ alias })}
      />
      <InputText
        textBoxFor="device_id"
        label="Device"
        value={state.device_id}
        onChange={device_id => update({ device_id })}
      />
      <InputText
        textBoxFor="type"
        label="Action"
        value={state.type}
        onChange={type => update({ type })}
      />
      <InputText
        textBoxFor="entity_id"
        label="Entity ID"
        value={state.entity_id ?? ""}
        onChange={entity_id => update({ entity_id, domain: entity_id.split('.')[0] })}
      />
    </>
  }
}

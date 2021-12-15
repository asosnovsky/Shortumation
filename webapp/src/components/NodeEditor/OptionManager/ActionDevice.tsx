import InputText from "components/Inputs/InputText";
import { DeviceAction } from "types/automations/actions";
import { OptionManager, updateActionData } from './OptionManager';


export const ActionDeviceState: OptionManager<DeviceAction> = {
  defaultState: () => ({
    $smType: 'action',
    action: 'device',
    action_data: {
      alias: "Device",
      type: "",
      entity_id: "",
      device_id: "",
      domain: "",
    }
  }),
  isReady: ({
    action_data: {
      alias,
      type,
      entity_id,
      device_id,
      domain,
    }
  }) => (
    alias !== '' &&
    type !== "" &&
    entity_id !== "" &&
    device_id !== "" &&
    domain !== ""
  ),
  renderOptionList: (state, setState) => {
    const update = updateActionData(state, setState);
    return <div className="state-manager-options">
      <InputText
        label="Description"
        value={state.action_data.alias ?? ""}
        onChange={alias => update({ alias })}
      />
      <InputText
        textBoxFor="device_id"
        label="Device"
        value={state.action_data.device_id}
        onChange={device_id => update({ device_id })}
      />
      <InputText
        textBoxFor="type"
        label="Action"
        value={state.action_data.type}
        onChange={type => update({ type })}
      />
      <InputText
        textBoxFor="entity_id"
        label="Entity ID"
        value={state.action_data.entity_id ?? ""}
        onChange={entity_id => update({ entity_id, domain: entity_id.split('.')[0] })}
      />
    </div>
  }
}

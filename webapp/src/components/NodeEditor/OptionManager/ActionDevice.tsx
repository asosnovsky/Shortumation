import { InputDevice } from "components/Inputs/InputDevice";
import { InputEntity } from "components/Inputs/InputEntities";
import { InputList } from "components/Inputs/InputList";
import InputText from "components/Inputs/InputText";
import { DeviceAction } from "types/automations/actions";
import { prettyName } from "utils/formatting";
import { OptionManager, updateActionData } from "./OptionManager";
export const ActionDeviceState: OptionManager<DeviceAction> = {
  defaultState: () => ({
    alias: "",
    device_id: "",
  }),
  isReady: () => true,
  Component: ({ state, setState, ha }) => {
    const update = updateActionData(state, setState);
    const options = ha.deviceExtras.useDeviceActions(state.device_id);
    const caps = ha.deviceExtras.useDeviceCapalities(state as any);
    // aliases
    let actions: DeviceAction[] = [];
    if (options.length > 0 && state.type) {
      const currentTypeOptions = options.filter(
        ({ type }) => type === state.type
      );
      if (currentTypeOptions.length > 0) {
        actions = currentTypeOptions[0].actions;
      }
    }
    const entities = actions
      .map(({ entity_id }) => entity_id)
      .filter((x) => !!x) as string[];
    // render
    return (
      <>
        <InputDevice
          value={state.device_id ?? ""}
          onChange={(device_id) => update({ device_id: device_id ?? "" })}
        />
        {options.length > 0 && (
          <InputList
            key={"actions" + state.device_id}
            label="Action"
            current={state.type}
            onChange={(type) =>
              setState({
                device_id: state.device_id,
                ...options.filter((opt) => type === opt.type)[0].actions[0],
              })
            }
            options={options.map(({ type }) => type)}
          />
        )}
        {entities.length > 0 && (
          <InputEntity
            key={"entities" + state.device_id}
            label="Entity"
            value={state.entity_id ?? ""}
            multiple={false}
            onChange={(entity_id) =>
              update({ entity_id: entity_id ?? undefined })
            }
            preSelectedEntityIds={entities}
          />
        )}
        {caps?.extra_fields &&
          caps.extra_fields.map((field) => (
            <InputText
              key={"extra" + state.device_id + field.name}
              label={prettyName(field.name)}
              value={(state as any)[field.name] ?? ""}
              onChange={(v) =>
                update({
                  [field.name]: v,
                })
              }
            />
          ))}
        {actions.length + options.length === 0 && (
          <>This device has no actions.</>
        )}
      </>
    );
  },
};

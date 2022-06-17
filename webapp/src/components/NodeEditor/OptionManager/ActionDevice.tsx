import { InputAutoComplete } from "components/Inputs/InputAutoComplete";
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
    const options = ha.deviceExtras.useDeviceActions(
      state.device_id
        ? {
            deviceId: state.device_id,
          }
        : undefined
    );
    const caps = ha.deviceExtras.useDeviceCapalities(
      state.device_id && state.type && state.domain ? (state as any) : undefined
    );
    // aliases
    const actionId = (state.type ?? "") + (state.subtype ?? "");
    const entities = ((options[actionId] ?? {}).data ?? [])
      .map(({ entity_id }) => entity_id)
      .filter((x) => !!x) as string[];
    // render
    return (
      <>
        <InputDevice
          label="Device"
          value={state.device_id ?? ""}
          onChange={(device_id) => setState({ device_id: device_id ?? "" })}
        />
        <InputAutoComplete
          label="Action"
          multiple={false}
          value={actionId}
          options={Object.keys(options).map((k) => options[k])}
          disabled={Object.keys(options).length === 0}
          onChange={(key) => {
            if (key) {
              const opt = options[key].data[0];
              const updateObj: any = { ...opt };
              delete updateObj["metadata"];
              setState(updateObj);
            } else {
              setState({
                device_id: state.device_id,
              });
            }
          }}
        />
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
        {Object.keys(options).length + entities.length === 0 && (
          <>This device has no actions.</>
        )}
      </>
    );
  },
};

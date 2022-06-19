import {
  BaseOption,
  InputAutoComplete,
} from "components/Inputs/InputAutoComplete";
import { InputDevice } from "components/Inputs/InputDevice";
import { InputDeviceCapabilties } from "components/Inputs/InputDeviceCapabilties";
import { InputEntity } from "components/Inputs/InputEntities";
import { cleanUpUndefined } from "components/NodeEditor/OptionManager/OptionManager";
import { DeviceBaseType, DeviceTypeCapability } from "haService/types";
import { AutomationDeviceState } from "types/automations/common";

export type DeviceEditorProps<DBT extends DeviceBaseType> = {
  type: "action" | "condition" | "trigger";
  state: Partial<AutomationDeviceState>;
  setState: (n: Partial<AutomationDeviceState & Record<string, any>>) => void;
  options: Record<string, BaseOption<{ data: DBT[] }>>;
  caps: Partial<DeviceTypeCapability>;
};
export function DeviceEditor<DBT extends DeviceBaseType>({
  type,
  state,
  setState,
  caps,
  options,
}: DeviceEditorProps<DBT>) {
  // aliases
  const update = (upd: Partial<AutomationDeviceState & Record<string, any>>) =>
    setState(
      cleanUpUndefined({
        ...state,
        ...upd,
      })
    );
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
      {caps?.extra_fields && (
        <InputDeviceCapabilties
          state={state}
          setState={setState}
          defn={caps.extra_fields}
        />
      )}
      {Object.keys(options).length + entities.length === 0 && (
        <>This device has no {type}s.</>
      )}
    </>
  );
}

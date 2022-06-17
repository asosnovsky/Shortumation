import { OptionManager } from "./OptionManager";
import { AutomationTriggerDevice } from "types/automations/triggers";
import InputText from "components/Inputs/InputText";
import { InputEntity } from "components/Inputs/InputEntities";
import InputTextBubble from "components/Inputs/InputTextBubble";
import { InputDevice } from "components/Inputs/InputDevice";
import InputAutoText from "components/Inputs/InputAutoText";
import {
  BaseOption,
  InputAutoComplete,
} from "components/Inputs/InputAutoComplete";
import { prettyName } from "utils/formatting";
import { DeviceTypeTrigger } from "haService/extras";

export const TriggerDevice: OptionManager<AutomationTriggerDevice> = {
  defaultState: () => ({
    platform: "device",
  }),
  isReady: () => true,
  Component: ({ state, setState, ha }) => {
    const triggers: Record<
      string,
      BaseOption<{
        data: DeviceTypeTrigger;
      }>
    > = ha.deviceExtras
      .useDeviceTriggers(
        state.device_id
          ? {
              deviceId: state.device_id,
            }
          : undefined
      )
      .reduce(
        (all, opt) => ({
          ...all,
          [opt.type + (opt.subtype ?? "")]: {
            id: opt.type + (opt.subtype ?? ""),
            label:
              prettyName(opt.type) + (opt.subtype ? ` ${opt.subtype}` : ""),
            data: opt,
          },
        }),
        {}
      );
    return (
      <>
        <InputDevice
          label="Device"
          value={state.device_id ?? ""}
          onChange={(device_id) =>
            setState({ device_id: device_id ?? "", platform: "device" })
          }
        />
        <InputAutoComplete
          label="Event"
          multiple={false}
          value={(state.type ?? "") + (state.subtype ?? "")}
          options={Object.keys(triggers).map((k) => triggers[k])}
          disabled={Object.keys(triggers).length === 0}
          onChange={(key) => {
            if (key) {
              const opt = triggers[key];
              const updateObj: any = { ...opt.data };
              delete updateObj["metadata"];
              setState(updateObj);
            } else {
              setState({
                device_id: state.device_id,
                platform: state.platform,
              });
            }
          }}
        />
      </>
    );
  },
};

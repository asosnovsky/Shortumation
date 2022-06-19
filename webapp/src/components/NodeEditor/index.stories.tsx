import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { NodeEditor } from ".";

import { AutomationCondition } from "types/automations/conditions";
import { Button } from "components/Inputs/Button";
import { useState } from "react";
import { Modal } from "components/Modal";
import { Page } from "components/Page";

export default {
  title: "NodeEditor",
  component: NodeEditor,
  parameters: { actions: { argTypesRegex: "^on.*" } },
  args: {
    node: {
      data: {},
      service: "",
      target: "",
    },
  },
} as ComponentMeta<typeof NodeEditor>;

const Base: ComponentStory<typeof NodeEditor> = (props) => {
  const [state, setState] = useState(props.node);
  return (
    <Page>
      <NodeEditor
        {...props}
        node={state}
        onSave={(s) => {
          setState(s);
          props.onSave && props.onSave(s);
        }}
      />
    </Page>
  );
};
export const Action = Base.bind({});
export const SingleOption = Action.bind({});
SingleOption.args = {
  ...SingleOption.args,
  allowedTypes: ["action"],
};
export const Condition = Action.bind({});
Condition.args = {
  ...Condition.args,
  node: {
    condition: "and",
    conditions: [
      {
        condition: "numeric_state",
        entity_id: ["sensor.kitchen_humidity"],
        conditions: [],
        above: "40",
      },
      {
        condition: "template",
        value_template: "states('switch.kitchen') == 'on'",
      },
    ],
  } as AutomationCondition,
};

export const UnSupported = Action.bind({});
UnSupported.args = {
  ...UnSupported.args,
  node: {
    condition: "bargs",
    platform: "rouge",
  } as any,
};

export const DeviceTriggerExample = Action.bind({});
DeviceTriggerExample.args = {
  ...DeviceTriggerExample.args,
  node: {
    platform: "device",
    device_id: "bd83b10cb1c7aa028c12dade5b4e87d5",
  },
};

export const InAModal: ComponentStory<typeof NodeEditor> = (props) => {
  const [open, setOpen] = useState(false);
  return (
    <Page>
      <Button onClick={() => setOpen(!open)}>Open Editor</Button>
      <Modal open={open}>
        <NodeEditor {...props} onClose={() => setOpen(!open)} />
      </Modal>
    </Page>
  );
};

export const ServiceExample = Action.bind({});
ServiceExample.args = {
  ...ServiceExample.args,
  node: {
    target: {},
    data: {},
    service: "",
  },
};

export const ServiceWithDataExample = Action.bind({});
ServiceWithDataExample.args = {
  ...ServiceWithDataExample.args,
  node: {
    target: {
      entity: "light.switch_baby",
    },
    data: {
      color_name: "red",
    },
    service: "light.turn_on",
  },
};

export const DelayExample = Action.bind({});
DelayExample.args = {
  ...DelayExample.args,
  node: {
    wait_template: "",
  },
};

export const StateTriggerExample = Action.bind({});
StateTriggerExample.args = {
  ...StateTriggerExample.args,
  node: {
    platform: "state",
    entity_id: "binary_sensor.door_main",
  },
};

export const DeviceActionFilledExample = Action.bind({});
DeviceActionFilledExample.args = {
  ...DeviceActionFilledExample.args,
  node: {
    type: "toggle",
    device_id: "c9711be86b0301955f72380509285485",
  },
};

export const NotifyPhoneViaDeviceAction = Action.bind({});
NotifyPhoneViaDeviceAction.args = {
  ...NotifyPhoneViaDeviceAction.args,
  node: {
    device_id: "2a98db84af7526c7ec3cc7aebd1a9e1c",
    domain: "mobile_app",
    type: "notify",
    title: "Hassio Status",
    message: "Hassio Is turning off...",
  } as any,
};

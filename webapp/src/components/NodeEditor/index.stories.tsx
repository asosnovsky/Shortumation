import React from "react";
import { ComponentStory } from "@storybook/react";
import { NodeEditor, NodeEditorProps } from ".";

import { AutomationCondition } from "types/automations/conditions";
import { Button } from "components/Inputs/Buttons/Button";
import { useState } from "react";
import { Modal } from "components/Modal";
import { Page } from "components/Page";
import { makeStory } from "devUtils";

const { componentMeta, make } = makeStory({
  meta: {
    title: "NodeEditor",
    args: {
      node: {
        data: {},
        service: "",
        target: "",
      },
    },
  },
  Component: (props: NodeEditorProps) => {
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
  },
});

export default componentMeta;

export const Action = make({});
export const SingleOption = make({
  allowedTypes: ["action"],
});
export const Condition = make({
  node: {
    condition: "and",
    conditions: [
      {
        condition: "numeric_state",
        entity_id: ["sensor.kitchen_humidity"],
        above: "40",
      },
      {
        condition: "template",
        value_template: "states('switch.kitchen') == 'on'",
      },
    ],
  },
});

export const UnSupported = make({
  node: {
    condition: "bargs",
    platform: "rouge",
  } as any,
});

export const DeviceTriggerExample = make({
  node: {
    platform: "device",
    device_id: "bd83b10cb1c7aa028c12dade5b4e87d5",
  },
});

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

export const ServiceExample = make({
  node: {
    target: {},
    data: {},
    service: "",
  },
});

export const ServiceWithDataExample = make({
  node: {
    target: {
      entity: "light.switch_baby",
    },
    data: {
      color_name: "red",
    },
    service: "light.turn_on",
  },
});

export const DelayExample = make({
  node: {
    wait_template: "",
  },
});

export const StateTriggerExample = make({
  node: {
    platform: "state",
    entity_id: "binary_sensor.door_main",
  },
});

export const DeviceActionFilledExample = make({
  node: {
    type: "toggle",
    device_id: "c9711be86b0301955f72380509285485",
  } as any,
});

export const NotifyPhoneViaDeviceAction = make({
  node: {
    device_id: "2a98db84af7526c7ec3cc7aebd1a9e1c",
    domain: "mobile_app",
    type: "notify",
    title: "Hassio Status",
    message: "Hassio Is turning off...",
  } as any,
});

export const Sun = make({
  node: {
    platform: "sun",
    event: "sunset",
  },
});
export const TriggerScene = make({
  node: {
    scene: "",
  },
});

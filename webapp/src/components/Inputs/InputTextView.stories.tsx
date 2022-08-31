import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Page } from "components/Page";
import InputText from "./Base/InputText";

import { InputTextView } from "./InputTextView";

import { makeStory } from "devUtils";

const { make, componentMeta } = makeStory({
  Component: InputTextView,
  BaseTemplate: (args) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1em",
        padding: "1em",
      }}
    >
      <InputTextView {...args} />
      <InputText {...args} />
    </div>
  ),
  meta: {
    title: "Inputs/InputTextView",
    args: {
      value: "example",
    },
  },
});

export default componentMeta;

export const Basic = make({});

import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Page } from "components/Page";
import InputText from "./Base/InputText";

import { InputTextView } from "./InputTextView";

export default {
  title: "Inputs/InputTextView",
  component: InputTextView,
  parameters: { actions: { argTypesRegex: "^on.*" } },
  args: {
    value: "example",
  },
} as ComponentMeta<typeof InputTextView>;

export const Basic: ComponentStory<typeof InputTextView> = (args) => (
  <Page>
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
  </Page>
);

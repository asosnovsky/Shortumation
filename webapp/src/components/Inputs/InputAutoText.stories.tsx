import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Page } from "components/Page";
import InputAutoText from "./InputAutoText";

export default {
  title: "Inputs/InputAutoText",
  component: InputAutoText,
  parameters: { actions: { argTypesRegex: "^on.*" } },
  args: {
    label: "Something",
    value: "",
    options: ["test", "usa", "canada"],
  },
} as ComponentMeta<typeof InputAutoText>;

const Template: ComponentStory<typeof InputAutoText> = (args) => {
  return (
    <Page>
      <InputAutoText {...args} />
    </Page>
  );
};

export const Basic = Template.bind({});
export const WithError = Template.bind({});
WithError.args = {
  ...WithError.args,
  error: "Oh no!",
};

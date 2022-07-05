import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Page } from "components/Page";

import { SearchItem } from "./extras";

export default {
  title: "Inputs/Extras/SearchItem",
  component: SearchItem,
  parameters: { actions: { argTypesRegex: "^on.*" } },
  argTypes: {},
} as ComponentMeta<typeof SearchItem>;

const Template: ComponentStory<typeof SearchItem> = (args) => {
  return (
    <Page>
      <div
        style={{
          width: "15em",
          height: "3em",
          border: "1px solid var(--mui-grey-400)",
        }}
      >
        <SearchItem {...args} />
      </div>
    </Page>
  );
};

export const Simple = Template.bind({});
Simple.args = {
  id: "sensor.humidity_main_bedroom",
  label: "Main Bedroom Humidity",
  searchTerm: "bedroom",
  listProps: {},
  onlyShowLabel: false,
};

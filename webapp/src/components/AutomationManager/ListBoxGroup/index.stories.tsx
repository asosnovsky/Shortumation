import "styles/root.css";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Page } from "components/Page";
import { ListBoxGroup } from ".";

export default {
  title: "App/AutomationList/ListBoxGroup",
  component: ListBoxGroup,
  parameters: { actions: { argTypesRegex: "^on.*" } },
  args: {
    title: "Example",
    type: "items",
    isSelected: false,
    data: [
      {
        id: "1",
        title: "Example",
        entityId: "automation.1",
        description: "Amazing automation!",
        tags: {},
        state: "on",
        isSelected: false,
      },
      {
        id: "2",
        title: "Example 2",
        entityId: "automation.2",
        description: "Cool!",
        state: "on",
        isSelected: false,
        tags: {
          room: "main bedroom",
          routine: "night time",
        },
      },
    ],
  },
} as ComponentMeta<typeof ListBoxGroup>;

const Template: ComponentStory<typeof ListBoxGroup> = (args) => {
  return (
    <Page>
      <ListBoxGroup {...args} />
    </Page>
  );
};

export const Basic = Template.bind({});
export const Nested = Template.bind({});
Nested.args = {
  title: "Top Group",
  type: "group",
  isSelected: false,
  data: [
    {
      title: "Subgroup 1",
      type: "group",
      isSelected: true,
      data: [
        {
          type: "items",
          isSelected: true,
          title: "Subsub group",
          data: [
            {
              id: "1",
              entityId: "automation.1",
              description: "",
              title: "Automation #1",
              state: "on",
              isSelected: true,
              tags: {},
            },
            {
              id: "2",
              entityId: "automation.2",
              description: "another one",
              title: "Automation #2",
              state: "off",
              isSelected: false,
              tags: {},
            },
            {
              id: "3",
              entityId: "automation.3",
              description: "bad one",
              title: "Automation #3",
              state: "offing",
              isSelected: false,
              tags: {
                type: "bad",
              },
            },
          ],
        },
      ],
    },
    {
      title: "Subgroup 2",
      type: "group",
      isSelected: false,
      data: [],
    },
    {
      title: "Other",
      type: "items",
      isSelected: false,
      data: [
        {
          id: "4",
          entityId: "automation.4",
          description: "Cool thing",
          title: "Automation #4",
          isSelected: false,
          state: "on",
          tags: {
            type: "good",
          },
        },
      ],
    },
  ],
};

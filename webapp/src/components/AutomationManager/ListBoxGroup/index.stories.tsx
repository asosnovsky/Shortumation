import { ListBoxGroup } from ".";

import { makeStory } from "devUtils";
import { useTagDB } from "../TagDB";

const { make, componentMeta } = makeStory({
  Component: ListBoxGroup,
  BaseTemplate: (args) => {
    const tagsDB = useTagDB([], () => {});
    return <ListBoxGroup {...args} tagsDB={tagsDB} />;
  },
  meta: {
    title: "App/AutomationManager/ListBoxGroup",
    args: {
      title: "Example",
      type: "items",
      flags: {
        isSelected: false,
        isModified: false,
      },
      data: [
        {
          id: "1",
          title: "Example",
          entityId: "automation.1",
          description: "Amazing automation!",
          tags: {},
          state: "on",
          source_file: "automation.yaml",
          source_file_type: "list",
          configuration_key: ["automation"],
          flags: {
            isSelected: false,
            isModified: false,
          },
        },
        {
          id: "2",
          title: "Example 2",
          entityId: "automation.2",
          description: "Cool!",
          state: "on",
          source_file: "automation.yaml",
          source_file_type: "list",
          configuration_key: ["automation"],
          flags: {
            isSelected: false,
            isModified: false,
          },
          tags: {
            room: "main bedroom",
            routine: "night time",
          },
        },
      ],
    },
  },
});

export default componentMeta;

export const Basic = make({});
export const Nested = make({
  title: "Top Group",
  type: "group",
  flags: {
    isSelected: false,
    isModified: false,
  },
  data: [
    {
      title: "Subgroup 1",
      type: "group",
      flags: {
        isSelected: true,
        isModified: false,
      },
      data: [
        {
          type: "items",
          flags: {
            isSelected: true,
            isModified: false,
          },
          title: "Subsub group",
          data: [
            {
              id: "1",
              entityId: "automation.1",
              description: "",
              title: "Automation #1",
              state: "on",
              source_file: "automation.yaml",
              source_file_type: "list",
              configuration_key: ["automation"],
              flags: {
                isSelected: true,
                isModified: false,
              },
              tags: {},
            },
            {
              id: "2",
              entityId: "automation.2",
              description: "another one",
              title: "Automation #2",
              state: "off",
              source_file: "automation.yaml",
              source_file_type: "list",
              configuration_key: ["automation"],
              flags: {
                isSelected: false,
                isModified: false,
              },
              tags: {},
            },
            {
              id: "3",
              entityId: "automation.3",
              description: "bad one",
              title: "Automation #3",
              state: "offing",
              source_file: "automation.yaml",
              source_file_type: "list",
              configuration_key: ["automation"],
              flags: {
                isSelected: false,
                isModified: false,
              },
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
      flags: {
        isSelected: false,
        isModified: false,
      },
      data: [],
    },
    {
      title: "Other",
      type: "items",
      flags: {
        isSelected: false,
        isModified: false,
      },
      data: [
        {
          id: "4",
          entityId: "automation.4",
          description: "Cool thing",
          title: "Automation #4",
          flags: {
            isSelected: false,
            isModified: false,
          },
          source_file: "automation.yaml",
          source_file_type: "list",
          configuration_key: ["automation"],
          state: "on",
          tags: {
            type: "good",
          },
        },
      ],
    },
  ],
});

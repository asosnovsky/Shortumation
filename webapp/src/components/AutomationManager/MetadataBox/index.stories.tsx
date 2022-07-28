import "styles/root.css";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Page } from "components/Page";
import { MetadataBox } from ".";
import { useTagDB } from "../TagDB";
import { useState } from "react";

export default {
  title: "App/AutomationList/MetadataBox",
  component: MetadataBox,
  parameters: { actions: { argTypesRegex: "^on.*" } },
  args: {
    id: "dummy",
    title: "Example",
    description: "Cool!",
    state: "on",
    isSelected: false,
    tags: {
      room: "main bedroom",
      routine: "night time",
    },
  },
} as ComponentMeta<typeof MetadataBox>;

const Template: ComponentStory<typeof MetadataBox> = (args) => {
  const [autoTags, setTags] = useState([{ id: args.id, tags: args.tags }]);
  const tagsDB = useTagDB(autoTags, (aid, t) =>
    setTags(
      autoTags
        .filter(({ id }) => id !== aid)
        .concat({
          id: aid,
          tags: t,
        })
    )
  );
  return (
    <Page>
      <MetadataBox {...args} tagsDB={tagsDB} />
    </Page>
  );
};

export const Basic = Template.bind({});
export const IsSelected = Template.bind({});
IsSelected.args = {
  ...IsSelected.args,
  isSelected: true,
};
export const InvalidState = Template.bind({});
InvalidState.args = {
  ...InvalidState.args,
  state: "unavailable",
};
export const WithIssue = Template.bind({});
WithIssue.args = {
  ...WithIssue.args,
  issue: "look at me",
};

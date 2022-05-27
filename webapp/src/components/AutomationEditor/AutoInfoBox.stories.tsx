
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { makeTagDB } from "components/AutomationList/TagDB";
import { Page } from "components/Page";
import { useState } from "react";
import { AutoInfoBox } from "./AutoInfoBox";
import { defaultAutomation } from 'utils/defaults';

export default {
  title: 'App/AutomationList/Editor/InfoBox',
  component: AutoInfoBox,
  parameters: { actions: { argTypesRegex: '^on.*' } },
  args: {
    tagDB: makeTagDB([
      defaultAutomation("test")
    ])
  }
} as ComponentMeta<typeof AutoInfoBox>;


export const NoTags: ComponentStory<typeof AutoInfoBox> = args => {
  const [[metadata, tags], setState] = useState([args.metadata, args.tags])
  return (
    <Page>
      <AutoInfoBox
        {...args}
        className=""
        metadata={metadata}
        tags={tags}
        onUpdate={(m, t) => {
          args.onUpdate(m, t)
          setState([m, t])
        }}
      />
    </Page>
  )
}
NoTags.args = {
  ...NoTags.args,
  tags: [],
  metadata: {
    id: "random",
    alias: "Random",
    description: "Example Metadata",
    trigger_variables: {
      'wowo': '!'
    },
    mode: 'single',
  },
}

export const SomeTags: ComponentStory<typeof AutoInfoBox> = NoTags.bind({})
SomeTags.args = {
  ...SomeTags.args,
  tags: [
    ["Room", "Bathroom"],
    ["Type", "Climate"],
  ],
  metadata: {
    id: "2432asd23",
    alias: "Bathroom Vent",
    description: "Turn the vent when the humidity is high",
    trigger_variables: {
      'wowo': '!'
    },
    mode: 'single',
  },
}

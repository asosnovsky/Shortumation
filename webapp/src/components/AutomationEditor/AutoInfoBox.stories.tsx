import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import { AutoInfoBox } from "./AutoInfoBox";

export default {
  title: 'AutomationEditor/AutoInfoBox',
  component: AutoInfoBox,
  parameters: { actions: { argTypesRegex: '^on.*' } },
} as ComponentMeta<typeof AutoInfoBox>;


export const Basic: ComponentStory<typeof AutoInfoBox> = args => {
  const [state, setState] = useState(args.metadata)
  return (
    <div className="page">
      <AutoInfoBox
        className=""
        metadata={state}
        onUpdate={up => {
          args.onUpdate(up)
          setState(up)
        }}
      />
    </div>
  )
}
Basic.args = {
  ...Basic.args,
  metadata: {
    id: "random",
    alias: "Random",
    description: "Example Metadata",
    trigger_variables: {
      'wowo': '!'
    },
    mode: 'single',
    tags: {},
  },
}

import { ComponentMeta, ComponentStory } from "@storybook/react";
import { DEFAULT_DIMS } from "components/DAGFlow/constants";
import { Page } from "components/Page";
import { MetadataBoxTag } from "./AutomationMetadataBox";
import { useState } from "react";

export default {
  title: "App/AutomationList/Box",
  component: MetadataBoxTag,
  parameters: { actions: { argTypesRegex: "^on.*" } },
  args: {
    value: ["Type", "Climate"],
    options: [[], []],
  },
} as ComponentMeta<typeof MetadataBoxTag>;

export const BoxTag: ComponentStory<typeof MetadataBoxTag> = (args) => {
  const [state, setState] = useState(args.value);
  return (
    <Page>
      <MetadataBoxTag
        options={args.options}
        value={state}
        onChange={(v) => {
          setState(v);
          args.onChange(v);
        }}
      />
    </Page>
  );
};

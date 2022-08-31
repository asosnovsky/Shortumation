import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Page } from "components/Page";
import { useState } from "react";

import InputYaml from "./InputYaml";

import { makeStory } from "devUtils";

const { make, componentMeta } = makeStory({
  Component: InputYaml,
  BaseTemplate: (args) => {
    const [value, setValue] = useState({
      test: "data",
    });
    return <InputYaml {...args} value={value} onChange={setValue} />;
  },
  meta: {
    title: "Inputs/InputYaml",
  },
});

export default componentMeta;
export const Example = make({});

export const SimpleText = make({
  label: "Template",
});

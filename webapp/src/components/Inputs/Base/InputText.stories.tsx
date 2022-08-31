import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Page } from "components/Page";
import { useState } from "react";

import InputText from "./InputText";

import { makeStory } from "devUtils";

const { make, componentMeta } = makeStory({
  Component: InputText,
  meta: {
    title: "Inputs/InputText",
  },
  BaseTemplate: (args) => {
    const [value, setValue] = useState("");
    return <InputText {...args} value={value} onChange={setValue} />;
  },
});

export default componentMeta;

export const SimpleText = make({
  label: "Entity ID",
});

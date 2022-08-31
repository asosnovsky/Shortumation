import { Page } from "components/Page";
import { useState, useEffect } from "react";

import { InputList } from "./InputList";

import { makeStory } from "devUtils";

const { make, componentMeta } = makeStory({
  Component: InputList,
  BaseTemplate: (args) => {
    const [value, setValue] = useState(args.current);
    useEffect(() => {
      if (value !== args.current) {
        setValue(args.current);
      }
    }, [args.current]);
    return <InputList {...args} current={value} onChange={setValue} />;
  },
  meta: {
    title: "Inputs/InputList",
  },
});

export default componentMeta;

export const SimpleText = make({
  label: "Entity ID",
  options: ["Bob", "Martin", "Toots"],
});

export const InvalidSelection = make({
  current: "Derek",
  label: "Entity ID",
  options: ["Bob", "Martin", "Toots"],
});

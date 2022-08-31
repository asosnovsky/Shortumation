import InputAutoText from "./InputAutoText";

import { makeStory } from "devUtils";

const { make, componentMeta } = makeStory({
  Component: InputAutoText,
  meta: {
    title: "Inputs/InputAutoText",
    args: {
      label: "Something",
      value: "",
      options: ["test", "usa", "canada"],
    },
  },
});

export default componentMeta;
export const Example = make({});

export const WithError = make({
  error: "Oh no!",
});

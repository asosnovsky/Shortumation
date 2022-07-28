import { makeStory } from "devUtils";

const { make, componentMeta } = makeStory({
  Component: () => <div>Example</div>,
  meta: {
    title: "DevUtil",
  },
});

export default componentMeta;
export const Example = make({});

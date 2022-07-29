import App from "./App";
import { withQuery } from "@storybook/addon-queryparams";
import { makeStory } from "devUtils";

const { make, componentMeta } = makeStory({
  Component: App,
  meta: {
    title: "App",
    decorators: [withQuery],
  },
});
export default componentMeta;

export const RootApp = make({});

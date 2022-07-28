import { makeStory } from "devUtils";
import { AutomationManager } from ".";

const { make, componentMeta } = makeStory({
  Component: AutomationManager,
  meta: {
    title: "App/AutomationManager",
  },
});

export default componentMeta;
export const Basic = make({});

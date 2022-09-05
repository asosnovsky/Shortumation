import { useConnectedApiService } from "services/apiService";
import { makeStory } from "devUtils";
import { AutomationRoute } from "./automation";

const { make, componentMeta } = makeStory({
  Component: () => {
    return <AutomationRoute api={useConnectedApiService()} />;
  },
  meta: {
    title: "App/Routes",
  },
});

export default componentMeta;

export const Automations = make({});

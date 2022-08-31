import { SearchItem } from "./extras";

import { makeStory } from "devUtils";

const { make, componentMeta } = makeStory({
  Component: SearchItem,
  meta: {
    title: "Inputs/Extras/SearchItem",
  },
  BaseTemplate: (args) => {
    return (
      <div
        style={{
          width: "15em",
          height: "3em",
          border: "1px solid var(--mui-grey-400)",
        }}
      >
        <SearchItem {...args} />
      </div>
    );
  },
});

export default componentMeta;

export const Simple = make({
  id: "sensor.humidity_main_bedroom",
  label: "Main Bedroom Humidity",
  searchTerm: "bedroom",
  listProps: {},
  onlyShowLabel: false,
});

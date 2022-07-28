import { MetadataBox } from ".";
import { useTagDB } from "../TagDB";
import { useState } from "react";

import { makeStory } from "devUtils";

const { make, componentMeta } = makeStory({
  Component: MetadataBox,
  meta: {
    title: "App/AutomationManager/MetadataBox",
    args: {
      id: "dummy",
      title: "Example",
      description: "Cool!",
      state: "on",
      isSelected: false,
      tags: {
        room: "main bedroom",
        routine: "night time",
      },
    },
  },
  BaseTemplate: (args) => {
    const [autoTags, setTags] = useState([{ id: args.id, tags: args.tags }]);
    const tagsDB = useTagDB(autoTags, (aid, t) =>
      setTags(
        autoTags
          .filter(({ id }) => id !== aid)
          .concat({
            id: aid,
            tags: t,
          })
      )
    );
    return <MetadataBox {...args} tagsDB={tagsDB} />;
  },
});

export default componentMeta;

export const Basic = make({});
export const IsSelected = make({ isSelected: true });
export const InvalidState = make({ state: "unavailable" });
export const WithIssue = make({ issue: "look at me" });

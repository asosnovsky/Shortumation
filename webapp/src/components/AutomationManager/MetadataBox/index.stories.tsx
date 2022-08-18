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
export const LongDescription = make({
  description:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
});
export const IsSelected = make({ isSelected: true });
export const InvalidState = make({ state: "unavailable" });
export const WithIssue = make({ issue: "look at me" });
export const NewAutomation = make({ isNew: true });

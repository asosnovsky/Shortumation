import { useTagDB } from "components/AutomationManager/TagDB";
import { useState } from "react";
import { AutoInfoBox, AutoInfoBoxProps } from "./AutoInfoBox";
import { makeStory } from "devUtils";

const { componentMeta, make } = makeStory({
  meta: {
    title: "App/AutomationEditor/InfoBox",
  },
  Component: (args: {
    metadata: AutoInfoBoxProps["metadata"];
    tags: AutoInfoBoxProps["tags"];
    onUpdate: AutoInfoBoxProps["onUpdate"];
  }) => {
    const [[metadata, tags], setState] = useState([args.metadata, args.tags]);
    const tagDB = useTagDB(
      [{ id: metadata.id, tags: Object.fromEntries(tags) }],
      (_, t) => setState([metadata, Object.entries(t)])
    );

    return (
      <AutoInfoBox
        {...args}
        tagDB={tagDB}
        metadata={metadata}
        tags={tags}
        onUpdate={(m, t) => {
          args.onUpdate(m, t);
          setState([m, t]);
        }}
      />
    );
  },
});

export default componentMeta;
export const NoTags = make({
  tags: [],
  metadata: {
    id: "random",
    alias: "Random",
    description: "Example Metadata",
    trigger_variables: {
      wowo: "!",
    },
    mode: "single",
    source_file: "automation.yaml",
    source_file_type: "list",
    configuration_key: "automation",
  },
});

export const SomeTags = make({
  tags: [
    ["Room", "Bathroom"],
    ["Type", "Climate"],
  ],
  metadata: {
    id: "2432asd23",
    alias: "Bathroom Vent",
    description: "Turn the vent when the humidity is high",
    trigger_variables: {
      wowo: "!",
    },
    mode: "single",
    source_file: "automation.yaml",
    source_file_type: "list",
    configuration_key: "automation",
  },
});

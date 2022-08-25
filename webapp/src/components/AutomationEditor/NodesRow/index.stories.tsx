import { DEFAULT_DIMS } from "components/DAGGraph/elements/constants";
import { makeStory } from "devUtils";
import { useState } from "react";
import { NodesRow } from ".";

const { make, componentMeta } = makeStory({
  Component: NodesRow,
  BaseTemplate: (props) => {
    const [data, setData] = useState(props.data);
    return (
      <NodesRow
        {...props}
        data={data}
        onUpdate={(up) => {
          setData(up);
          props.onUpdate(up);
        }}
      />
    );
  },
  meta: {
    title: "App/AutomationEditor/NodesRow",
    args: {
      data: [],
      sequenceNodeDims: DEFAULT_DIMS.node,
    },
  },
});

export default componentMeta;
export const Empty = make({});
export const One = make({
  type: "trigger",
  data: [
    {
      platform: "calendar",
      event: "test",
    },
  ],
});

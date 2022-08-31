import React, { FC } from "react";
import { useHADeviceRegistry } from "haService";
import InputYaml from "components/Inputs/Base/InputYaml";
import { makeStory } from "devUtils";

const Test: FC<{ onRender: () => void }> = ({ onRender }) => {
  const conn = useHADeviceRegistry();
  onRender && onRender();
  if (conn.ready) {
    return (
      <div>
        {Object.keys(conn.collection).length} items
        <ul
          style={{
            maxHeight: "100vh",
            overflow: "auto",
          }}
        >
          {Object.keys(conn.collection).map((k) => (
            <li key={k}>
              <b>{k}</b>
              {/* <u>{conn.collection[k].length > 1 ? conn.collection[k].length : ''}</u> */}
              <InputYaml
                value={conn.collection[k]}
                onChange={() => {}}
                label={k}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return <code>Loading...</code>;
};

const { make, componentMeta } = makeStory({
  Component: Test,
  meta: {
    title: "Services/Device Registry",
  },
});

export default componentMeta;
export const Basic = make({});

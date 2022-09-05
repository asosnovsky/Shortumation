import React, { FC } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { MockPage } from "components/Page";
import { useHAEntityRegistry } from "services/ha";

const Test: FC<{ onRender: () => void }> = ({ onRender }) => {
  const conn = useHAEntityRegistry();
  onRender && onRender();
  if (conn.ready) {
    return (
      <div>
        {conn.collection.length}
        <ul
          style={{
            maxHeight: "100vh",
            overflow: "auto",
          }}
        >
          {conn.collection.map((row, i) => (
            <li key={i}>
              {row.entity_id}
              {/* {Object.keys(row).map(k => <>
                        <span key={k}>
                            <b>{k}</b>: {JSON.stringify(row[k] as any)}
                        </span><br key={`${k}-br`} />
                    </>)} */}
              {/* <InputYaml label={String(i)} value={row} onChange={() => { }} /> */}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return <code>Loading...</code>;
};

export default {
  title: "Services/Entity Registry",
  component: Test,
  parameters: { actions: { argTypesRegex: "^on.*" } },
  args: {},
} as ComponentMeta<typeof Test>;

export const Base: ComponentStory<typeof Test> = (props) => {
  return (
    <MockPage>
      <Test {...props} />
    </MockPage>
  );
};

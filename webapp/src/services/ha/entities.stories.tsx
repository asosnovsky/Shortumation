import React, { FC, useState } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { MockPage } from "components/Page";
import { useHAEntities } from "services/ha/HAEntities";

const Test: FC<{ onRender: () => void }> = ({ onRender }) => {
  const [searchTerm, setSearch] = useState("");
  const conn = useHAEntities();
  onRender && onRender();
  return (
    <>
      <input
        key="text"
        type="text"
        value={searchTerm}
        onChange={(e) => setSearch(e.target.value.toLowerCase())}
      />
      <ul
        key="list"
        style={{
          maxHeight: "60vh",
          overflow: "auto",
        }}
      >
        {Object.entries(conn.collection ?? {})
          .filter(([key, _]) => key.toLowerCase().includes(searchTerm))
          .map(([key, value]) => {
            return (
              <li key={key}>
                <b>{key}</b> <br />
                Context: {JSON.stringify(value.context)} <br />
                Attributes: {JSON.stringify(value.attributes)} <br />
                State: {JSON.stringify(value.state)} <br />
                Updated at: {JSON.stringify(value.last_updated)} <br />
                Changed at: {JSON.stringify(value.last_changed)} <br />
              </li>
            );
          })}
      </ul>
    </>
  );
};

export default {
  title: "Services/HA Entities",
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

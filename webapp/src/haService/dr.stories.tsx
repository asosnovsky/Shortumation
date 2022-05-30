import React, { FC } from "react";
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Page } from "components/Page";
import { useHADeviceRegistry } from "haService";
import InputYaml from "components/Inputs/InputYaml";

const Test: FC<{ onRender: () => void }> = ({ onRender }) => {
    const conn = useHADeviceRegistry();
    onRender && onRender()
    if (conn.ready) {
        return <div>
            {Object.keys(conn.collection.state).length} items
            <ul style={{
                maxHeight: '100vh',
                overflow: 'auto'
            }}>
                {Object.keys(conn.collection.state).map(k => <li key={k}>
                    <b>{k}</b>
                    {/* <u>{conn.collection.state[k].length > 1 ? conn.collection.state[k].length : ''}</u> */}
                    <InputYaml value={conn.collection.state[k]} onChange={() => { }} label={k} />
                </li>)}
            </ul>
        </div>
    }
    return <code>
        Loading...
    </code>
}

export default {
    title: 'Services/Device Registry',
    component: Test,
    parameters: { actions: { argTypesRegex: '^on.*' } },
    args: {}
} as ComponentMeta<typeof Test>

export const Base: ComponentStory<typeof Test> = props => {

    return <Page>
        <Test {...props} />
    </Page>
};
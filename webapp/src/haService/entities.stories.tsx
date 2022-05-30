import React, { FC } from "react";
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Page } from "components/Page";
import { useHAEntities } from "haService";

const Test: FC<{ onRender: () => void }> = ({ onRender }) => {
    const conn = useHAEntities();
    onRender && onRender()
    return <code>
        {JSON.stringify(conn, null, 4)}
    </code>
}

export default {
    title: 'Services/HA Entities',
    component: Test,
    parameters: { actions: { argTypesRegex: '^on.*' } },
    args: {}
} as ComponentMeta<typeof Test>

export const Base: ComponentStory<typeof Test> = props => {

    return <Page>
        <Test {...props} />
    </Page>
};
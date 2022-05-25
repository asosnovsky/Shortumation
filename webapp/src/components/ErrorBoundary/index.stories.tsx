import React, { FC } from "react";
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ErrorBoundary } from ".";
import { Page } from "components/Page";


export default {
    title: 'ErrorBoundary',
    component: ErrorBoundary,
    parameters: { actions: { argTypesRegex: '^on.*' } },
    args: {
    }
} as ComponentMeta<typeof ErrorBoundary>

export const ErrorThrown: ComponentStory<typeof ErrorBoundary> = args => {
    const BadComponent: FC = () => {
        throw new Error("!!!")
    }
    return <Page>
        <ErrorBoundary>
            <BadComponent />
        </ErrorBoundary>
    </Page>
}

export const NoError: ComponentStory<typeof ErrorBoundary> = args => {
    const GoodComponent: FC = () => {
        return <span>All Good.</span>
    }
    return <Page>
        <ErrorBoundary>
            <GoodComponent />
        </ErrorBoundary>
    </Page>
}
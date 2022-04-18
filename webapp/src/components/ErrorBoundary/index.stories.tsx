import React, { FC } from "react";
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ErrorBoundary } from ".";


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
    return <div className="page">
        <ErrorBoundary>
            <BadComponent />
        </ErrorBoundary>
    </div>
}

export const NoError: ComponentStory<typeof ErrorBoundary> = args => {
    const GoodComponent: FC = () => {
        return <span>All Good.</span>
    }
    return <div className="page">
        <ErrorBoundary>
            <GoodComponent />
        </ErrorBoundary>
    </div>
}
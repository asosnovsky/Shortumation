import { useState, useEffect } from 'react';
import { AutomationData, AutomationMetadata } from "types/automations";


export type EditorData = ReturnType<typeof genEditorData>;
export type EditorState = {
    status: 'unchanged' | 'changed',
    data: EditorData
} | {
    status: 'loading'
}
export type EditorStatus = EditorState['status'];

export const useAutomatioEditorState = (
    automation: AutomationData | undefined,
    onSave: (a: AutomationData) => void,
) => {
    const [state, update] = useState<EditorState>({
        status: "loading",
    });
    const makeUpdate = <K extends keyof EditorData, D extends EditorData[K]>(name: K) => (
        data: D
    ) => state.status !== 'loading' && update({
        status: 'changed',
        data: {
            ...state.data,
            [name]: data,
        }
    })

    useEffect(() => {
        if (automation) {
            update({
                status: 'unchanged',
                data: genEditorData(automation),
            })
        }
    }, [automation]);

    return {
        updateTrigger: makeUpdate('trigger'),
        updateSequence: makeUpdate('sequence'),
        updateCondition: makeUpdate('condition'),
        updateMetadata: (metadata: AutomationMetadata, tags: Array<[string, string]>) => {
            if (state.status !== 'loading') {
                update({
                    status: 'changed',
                    data: {
                        ...state.data,
                        tags,
                        metadata,
                    }
                })
            }
        },
        save: () => {
            if (state.status !== 'loading') {
                const data = {
                    ...state.data,
                    tags: state.data.tags.reduce((all, [tagName, tagValue]) => ({
                        ...all,
                        [tagName]: tagValue,
                    }), {})
                };
                update({
                    status: "loading",
                })
                onSave(data);
            }
        },
        get state() {
            return state;
        }
    }
}


const genEditorData = (automation: AutomationData) => {
    const {
        metadata,
        trigger,
        sequence,
        condition,
    } = automation;

    const tags: [string, string][] = Object.keys(automation.tags).map(tagName => [tagName, automation.tags[tagName]]);

    return {
        metadata,
        trigger,
        sequence,
        condition,
        tags,
    }
}
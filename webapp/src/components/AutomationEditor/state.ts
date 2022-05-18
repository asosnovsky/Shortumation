import { useState, useEffect } from 'react';
import { AutomationData, AutomationMetadata } from "types/automations";
import * as v from "types/validators/autmation";
import { getFailures } from "types/validators/helper";
import { MiniFailure } from '../../types/validators/helper';

export type EditorData = ReturnType<typeof genEditorData>;
export type EditorState = {
    status: 'unchanged' | 'changed',
    data: EditorData
} | {
    status: 'loading'
} | {
    status: 'invalid',
    failures: MiniFailure[],
    data: EditorData,
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
    ) => ((state.status === 'changed') || (state.status === 'unchanged')) && update({
        status: 'changed',
        data: {
            ...state.data,
            [name]: data,
        }
    })

    const saveAndUpdate = (data: EditorData) => {
        const cleanData = {
            ...data,
            tags: data.tags.reduce((all, [tagName, tagValue]) => ({
                ...all,
                [tagName.trim()]: tagValue.trim(),
            }), {})
        };
        update({
            status: "loading",
        })
        onSave(cleanData);
    }

    useEffect(() => {
        if (automation) {
            const failures = getFailures(automation, v.AutomationData);
            if (failures) {
                update({
                    status: 'invalid',
                    failures,
                    data: genEditorData(automation),
                })
            } else {
                update({
                    status: 'unchanged',
                    data: genEditorData(automation),
                })
            }
        }
    }, [automation]);

    return {
        validate: (data: any) => getFailures(data, v.AutomationData),
        updateTrigger: makeUpdate('trigger'),
        updateSequence: makeUpdate('sequence'),
        updateCondition: makeUpdate('condition'),
        saveAndUpdate,
        updateMetadata: (metadata: AutomationMetadata, tags: Array<[string, string]>) => {
            if ((state.status === 'changed') || (state.status === 'unchanged')) {
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
                saveAndUpdate(state.data)
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
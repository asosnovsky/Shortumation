import { AutomationCondition, LogicCondition } from "types/automations/conditions";


export const genUpdateMethods = (
    condition: LogicCondition,
    onChange: (c: LogicCondition) => void
) => (i: number) => ({
    onUpdate: (update: AutomationCondition) => onChange({
        ...condition,
        conditions: [
            ...condition.conditions.slice(0, i),
            update,
            ...condition.conditions.slice(i + 1)
        ]
    }),
    onDelete: (which: 'root' | number) => {
        if (which === 'root') {
            onChange({
                ...condition,
                conditions: condition.conditions.slice(0, i).concat(
                    condition.conditions.slice(i + 1)
                )
            })
        } else {
            throw new Error("Not Implemented")
        }
    }
})

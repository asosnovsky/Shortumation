import { AutomationCondition, LogicCondition } from "~/automations/types/conditions";


export const genUpdateMethods = (condition: LogicCondition, onChange: (c: LogicCondition) => void) => (i: number) => ({
    onUpdate: (update: AutomationCondition) => onChange({
        ...condition,
        condition_data: {
            ...condition.condition_data,
            conditions: [
                ...condition.condition_data.conditions.slice(0, i),
                update,
                ...condition.condition_data.conditions.slice(i+1)
            ]
        }
    }),
    onDelete: (which: 'root' | number) => {
        if (which === 'root') {
            onChange({
                ...condition,
                condition_data: {
                    ...condition.condition_data,
                    conditions: condition.condition_data.conditions.slice(0, i).concat(
                        condition.condition_data.conditions.slice(i+1)
                    )
                }
            })
        }   else  {
            const data = (c as LogicCondition).condition_data;
            const update = {
                ...condition.condition_data,
                conditions: [
                    ...condition.condition_data.conditions.slice(0, i),
                    {
                        ...c,
                        condition_data: {
                            ...data,
                            conditions: data.conditions.slice(0, which).concat(data.conditions.concat(which+1))
                        }
                    },
                    ...condition.condition_data.conditions.slice(i+1)
                ]
            }
            onChange({
                ...condition,
                condition_data: update as any
            })
        }
    }
})
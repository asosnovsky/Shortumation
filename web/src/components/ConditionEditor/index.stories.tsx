import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import { AutomationCondition } from "~/automations/types/conditions";
import { usePageTheme } from "~/styles/page";
import { ConditionEditor } from ".";

export default {
    title: 'ConditionEditor',
    component: ConditionEditor,
    parameters: { actions: { argTypesRegex: '^on.*' } },
  } as ComponentMeta<typeof ConditionEditor>;
  

const Template: ComponentStory<typeof ConditionEditor> = ({condition, ...args}) => {
    const {classes} = usePageTheme({});
    const [data, setData] = useState(condition);
    return <div className={classes.page}>
    <ConditionEditor {...args} condition={data} onUpdate={data => {
        setData(data)
    }} />
</div> 
}

export const TemplateViewer = Template.bind({})
TemplateViewer.args = {
    condition: {
        $smType: 'condition',
        condition: 'template',
        condition_data: {
            value_template: "states('switch.light_kitchen') == 'on'"
        } 
    } as AutomationCondition,
}


export const NumericStateViewer = Template.bind({})
NumericStateViewer.args = {
    condition: {
        $smType: 'condition',
        condition: "numeric_state",
        condition_data: {
            entity_id: "sensor.humidity_kitchen",
            above: "10",
        } 
    } as AutomationCondition,
}

export const LogicCondition = Template.bind({})
LogicCondition.args = {
    condition: {
        $smType: 'condition',
        condition: 'or',
        condition_data: {
            conditions: [
                {
                    $smType: 'condition',
                    condition: 'numeric_state',
                    condition_data: {
                        entity_id: 'sensor.humidity_kitchen',
                        above: '60'
                    }
                },
                {
                    $smType: 'condition',
                    condition: 'numeric_state',
                    condition_data: {
                        entity_id: 'sensor.humidity_living_room',
                        above: '60'
                    }
                },
                {
                    $smType: 'condition',
                    condition: 'and',
                    condition_data: {
                        conditions: [
                            {
                                $smType: 'condition',
                                condition: 'numeric_state',
                                condition_data: {
                                    entity_id: 'sensor.humidity_bedroom',
                                    above: '60'
                                }
                            },
                            {
                                $smType: 'condition',
                                condition: 'numeric_state',
                                condition_data: {
                                    entity_id: 'sensor.humidity_bathroom',
                                    above: '60'
                                }
                            }
                        ]
                    }
                },
            ]
        } 
    } as AutomationCondition,
}
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import { AutomationAction } from "~/automations/types/actions";
import { usePageTheme } from "~/styles/page";
import { SequenceEditor } from ".";

export default {
    title: 'SequenceEditor',
    component: SequenceEditor,
    parameters: { actions: { argTypesRegex: '^on.*' } },
  } as ComponentMeta<typeof SequenceEditor>;
  

const Template: ComponentStory<typeof SequenceEditor> = ({node, ...args}) => {
    const {classes} = usePageTheme({});
    const [data, setData] = useState(node);
    return <div className={classes.page}>
    <SequenceEditor {...args} 
        node={data} 
        onUpdate={data => {
            setData(data)
        }}
    />
</div> 
}

export const ServiceAction = Template.bind({})
ServiceAction.args = {
    node: {
        $smType: 'action',
        action: 'service',
        action_data: {
            service: 'switch.toggle',
            data: {},
            target: {},
        }
    } as AutomationAction
}
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { usePageTheme } from "~/styles/page";
import { ConditionEditor } from ".";

export default {
    title: 'ConditionEditor',
    component: ConditionEditor,
    parameters: { actions: { argTypesRegex: '^on.*' } },
  } as ComponentMeta<typeof ConditionEditor>;
  

const Template: ComponentStory<typeof ConditionEditor> = args => {
    const {classes} = usePageTheme({});
    return <div className={classes.page}>
    <ConditionEditor {...args} />
</div> 
}

export const SimpleGraph = Template.bind({})
SimpleGraph.args = {
    condition: {
        $smType: 'condition',
        condition: 'template',
        condition_data: {
            value_template: "states('switch.light_kitchen') == 'on'"
        } 
    }
}
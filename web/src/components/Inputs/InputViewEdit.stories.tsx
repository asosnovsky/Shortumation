import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import { usePageTheme } from "~/styles/page";
import InputViewEdit from "./InputViewEdit";

export default {
    title: 'Inputs/InputViewEdit',
    component: InputViewEdit,
    parameters: { actions: { argTypesRegex: '^on.*' } },
  } as ComponentMeta<typeof InputViewEdit>;
  

const Template: ComponentStory<typeof InputViewEdit> = args => {
    const {classes} = usePageTheme({});
    const [value, setValue] = useState('')
    return <div className={classes.page}>
        <InputViewEdit {...args} value={value} onChange={setValue}/>
    </div> 
}

export const SimpleText = Template.bind({})
SimpleText.args = {
    label: "Entity ID",
}
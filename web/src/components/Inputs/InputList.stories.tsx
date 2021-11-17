import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import { usePageTheme } from "~/styles/page";
import InputList from "./InputList";

export default {
    title: 'Inputs/InputList',
    component: InputList,
    parameters: { actions: { argTypesRegex: '^on.*' } },
  } as ComponentMeta<typeof InputList>;
  

const Template: ComponentStory<typeof InputList> = args => {
    const {classes} = usePageTheme({});
    const [value, setValue] = useState('')
    return <div className={classes.page}>
        <InputList {...args} current={value} onChange={setValue}/>
    </div> 
}

export const SimpleText = Template.bind({})
SimpleText.args = {
    label: "Entity ID",
    options: [
        'Bob',
        'Martin',
        "Toots"
    ]
}
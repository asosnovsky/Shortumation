import { useState } from "react";



export abstract class BaseStateManager<T> {
    abstract defaultState(): T ;
    abstract isReady(): boolean;
    abstract renderOptionList(): JSX.Element;

    public state: T;
    public setState: (s:T) => void;

    constructor(){
        [this.state, this.setState] = useState(this.defaultState());
    }

}
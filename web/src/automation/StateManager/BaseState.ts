import { useState } from "react";



export abstract class BaseState<T> {
    abstract defaultState(): T ;
    abstract isReady(s: T): boolean;
    abstract renderOptionList(s: T): JSX.Element;

    constructor(public setState: (s: T) => void) {}

}
import { useEffect, useState } from "react";
import { AutomationNodeType, NodeSubType } from "../types";
import { BaseState } from "./BaseState";
import Generic from "./Generic";
import { getBaseState } from "./getBaseState";

export default class StateManager {
    public state: any;
    private setState: (s: any) => void;
    private baseState: BaseState<any>;

    constructor(
        public nodeType: AutomationNodeType, 
        public nodeSubtype: NodeSubType,
        initialState: any | undefined = undefined,
    ){
        [this.state, this.setState] = useState(initialState ?? {});
        this.baseState = this.swapBaseState(this.nodeType, this.nodeSubtype);
        if (!initialState) {
            useEffect(() => {
                this.setState(this.baseState.defaultState());
            }, [this.nodeType, this.nodeSubtype]);
        }
    }
    swapBaseState(nodeType: AutomationNodeType, nodeSubtype: NodeSubType) {
        try {
            this.baseState = new (getBaseState(nodeType, nodeSubtype))(this.setState);
        } catch (error) {
            this.baseState = new Generic(this.setState);
        }
        this.nodeType = nodeType;
        this.nodeSubtype = nodeSubtype;
        return this.baseState;
    }
    renderOptionList() {
        return this.baseState.renderOptionList(this.state)
    }
    get isReady() {
        return this.baseState.isReady(this.state);
    }
}
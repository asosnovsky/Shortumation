import { AutomationNodeSubtype } from "types/automations";
import { ActionType, ActionTypeMapping } from "types/automations/actions";
import { DAGElementsOutputState } from "./outputState";
import { ElementMaker, ElementMakerProps } from "./types";

const SpecialNodeRegistry: Partial<Record<ActionType, ElementMaker<any>>> = {};

export const makeSpecialNodeMaker = <
  AT extends ActionType,
  T extends ActionTypeMapping[AT]
>(
  nodeType: AT,
  run: (
    node: T,
    outputState: DAGElementsOutputState,
    args: ElementMakerProps
  ) => any
): ElementMaker<T> => {
  const elementMaker: ElementMaker<T> = (nodes, args) => {
    const outputState = new DAGElementsOutputState(args.position, args.dims);
    if (nodes.length !== 1) {
      throw new Error("makeChooseNodes only access a list of 1");
    }
    const node = nodes[0];
    if (
      !(node.enabled ?? true) ||
      args.state.get(args.lastNodeId ?? "").isClosed
    ) {
      return outputState;
    }

    run(node, outputState, args);

    return outputState;
  };

  SpecialNodeRegistry[nodeType] = elementMaker;

  return elementMaker;
};

export const getSpecialNodeMaker = <AT extends ActionType>(
  nodeType: AT
): ElementMaker<AT> | null => SpecialNodeRegistry[nodeType] ?? null;

export const isSpecialNode = (nodeType: AutomationNodeSubtype) =>
  nodeType in SpecialNodeRegistry;

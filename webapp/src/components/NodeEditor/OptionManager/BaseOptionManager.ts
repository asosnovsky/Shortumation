import { AutomationAction } from 'types/automations/actions';
import { AutomationCondition } from 'types/automations/conditions';
export abstract class BaseOptionManager<T> {
  abstract defaultState(): T ;
  abstract isReady(s: T): boolean;
  abstract renderOptionList(s: T): JSX.Element;

  constructor(public setState: (s: T) => void) { }
}


export const updateConditionData = <T extends AutomationCondition>(
  setState: (s: T) => void
) => (
  state: T,
  data: Partial<T['condition_data']>,
) => setState({
  ...state,
  condition_data: {
    ...state.condition_data,
    ...data,
  },
})

export const updateActionData = <T extends AutomationAction>(
  state: T,
  setState: (s: T) => void
) => (
  data: Partial<T['action_data']>,
) => setState({
  ...state,
    action_data: {
    ...state.action_data,
    ...data,
  },
})

import { AutomationAction } from 'types/automations/actions';
import { AutomationCondition } from 'types/automations/conditions';
export interface OptionManager<T> {
  defaultState(): T ;
  isReady(s: T): boolean;
  renderOptionList(s: T, set: (s:T) => void): JSX.Element;
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
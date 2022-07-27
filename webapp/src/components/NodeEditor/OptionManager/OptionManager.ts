import { HAService } from "haService";
import { HAEntitiesState } from "haService/HAEntities";
import { FC } from "react";
import { AutomationAction } from "types/automations/actions";
import { AutomationCondition } from "types/automations/conditions";
import { cleanUpUndefined } from "utils/helpers";
export type OptionManager<T> = {
  defaultState(): T;
  isReady(s: T): boolean;
} & (
  | {
      renderOptionList(
        s: T,
        set: (s: T) => void,
        entities: HAEntitiesState
      ): JSX.Element;
    }
  | {
      Component: FC<{
        state: T;
        setState: (s: T) => void;
        ha: HAService;
        createMode: boolean;
      }>;
    }
);

export const updateConditionData =
  <T extends AutomationCondition>(setState: (s: T) => void) =>
  (state: T, data: Partial<T>) =>
    setState(
      cleanUpUndefined({
        ...state,
        ...data,
      })
    );

export const updateActionData =
  <T extends AutomationAction>(state: T, setState: (s: T) => void) =>
  (data: Partial<T>) =>
    setState(
      cleanUpUndefined({
        ...state,
        ...data,
      })
    );

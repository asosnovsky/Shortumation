


from typing import Iterable, Union

from src.automations.types import AutomationActionNode, AutomationConditionNode


def _deparse(nodes: Iterable[Union[AutomationActionNode, AutomationConditionNode]]) -> Iterable[dict]:
    for node in nodes:
        if isinstance(node, AutomationActionNode):
            yield from _deparse_action(node)
        elif isinstance(node, AutomationConditionNode):
            yield from _deparse_condition(node)
        else:
            raise NotImplementedError(type(node))

def _deparse_action(action: AutomationActionNode) -> Iterable[dict]:
    if action.action == 'repeat':
        raw_data = action.action_data
        repeat_data = raw_data.pop("repeat")
        yield {
            **raw_data,
            "repeat": {
                **repeat_data,
                "sequence": list(_deparse(repeat_data['sequence']))
            }
        }
    elif action.action == 'choose':
        raw_data = action.action_data
        choose_data = raw_data.pop("choose")
        default_data = raw_data.pop("default", [])
        yield {
            **raw_data,
            "choose": [
                {
                    "conditions": list(map(_deparse_condition, option.get("conditions", []))),
                    "sequence": list(_deparse(option.get("sequence", []))),
                }
                for option in choose_data
            ],
            "default": list(_deparse(default_data)),
        }
    else:
        yield action.action_data


def _deparse_condition(condition: AutomationConditionNode) -> Iterable[dict]:
    raise NotImplementedError
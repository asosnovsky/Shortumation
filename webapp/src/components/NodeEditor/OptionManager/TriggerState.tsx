import { OptionManager } from "./OptionManager";
import { AutomationTriggerState } from "types/automations/triggers";
import InputText from "components/Inputs/InputText";
import { InputEntity } from "components/Inputs/AutoComplete/InputEntities";
import { InputTime } from "components/Inputs/InputTime";
import { InputAutoComplete } from "components/Inputs/AutoComplete/InputAutoComplete";
import { FC } from "react";
import { getEntityDomains } from "utils/automations";
import { InputList } from "components/Inputs/InputList";
import { entityDomainsAreBinary } from "../../../utils/automations";

export const TriggerState: OptionManager<AutomationTriggerState> = {
  defaultState: () => ({
    platform: "state",
    entity_id: "",
  }),
  isReady: () => true,
  Component: ({ state, setState, ha: { entities } }) => {
    const attributes = entities.getAttributes(state.entity_id);
    const states = entities.getStates(state.entity_id, state.attribute);
    return (
      <>
        <InputEntity
          value={state.entity_id}
          multiple
          onChange={(entity_id) =>
            setState({
              ...state,
              entity_id,
            })
          }
        />
        <InputAutoComplete
          label="Attribute"
          value={state.attribute ?? ""}
          options={attributes}
          multiple={false}
          onChange={(attribute) =>
            setState({
              ...state,
              attribute: attribute ?? undefined,
            })
          }
        />
        <FromTo
          entityId={state.entity_id}
          hasAttribute={!!state.attribute}
          values={{ to: state.to ?? "", from: state.from ?? "" }}
          onChange={(x) => setState({ ...state, ...x })}
          states={states}
        />
        <InputTime
          label="For"
          value={state.for}
          onChange={(_for) =>
            setState({
              ...state,
              for: _for,
            })
          }
        />
      </>
    );
  },
};

export const FromTo: FC<{
  entityId: string | string[];
  hasAttribute: boolean;
  values: { to: string; from: string };
  onChange: (s: Partial<{ to: string; from: string }>) => void;
  states: string[];
}> = (props) => {
  if (!props.hasAttribute) {
    const domains = getEntityDomains(props.entityId);
    if (entityDomainsAreBinary(domains)) {
      return (
        <div style={{ display: "flex", flexDirection: "row", gap: "0.25em" }}>
          <InputList
            label="From"
            options={["on", "off"]}
            current={props.values.from}
            onChange={(from) =>
              props.onChange({
                from,
              })
            }
          />
          <InputList
            label="To"
            options={["on", "off"]}
            current={props.values.to}
            onChange={(to) =>
              props.onChange({
                to,
              })
            }
          />
        </div>
      );
    }
  }
  const example = `eg. ${props.states.join(" or ")}`;
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "0.25em" }}>
      <InputText
        label="From"
        value={props.values.from}
        onChange={(from) =>
          props.onChange({
            from,
          })
        }
        placeholder={example}
      />
      <InputText
        label="To"
        value={props.values.to}
        onChange={(to) =>
          props.onChange({
            to,
          })
        }
        placeholder={example}
      />
    </div>
  );
};

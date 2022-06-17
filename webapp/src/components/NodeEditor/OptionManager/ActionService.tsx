import { InputService } from "components/Inputs/InputService";
import { ServiceEditor } from "components/ServiceEditor";
import { ServiceAction } from "types/automations/actions";
import { OptionManager, updateActionData } from "./OptionManager";

export const ActionCallServiceState: OptionManager<ServiceAction> = {
  defaultState: () => ({
    service: "",
    target: {},
    data: {},
  }),
  isReady: ({ service }) => service !== "",
  Component: ({ state, setState, ha: { services } }) => {
    const { service, target, data } = state;
    const update = updateActionData(state, setState);
    const serviceOption = services.getOption(service);
    return (
      <>
        <InputService
          value={service}
          onChange={(service: string | null) =>
            update({ service: service ?? "" })
          }
        />
        {serviceOption && (
          <ServiceEditor
            key={service}
            serviceId={service}
            service={serviceOption}
            data={{ target, field: data }}
            onUpdate={({ target, field }) =>
              update({
                target,
                data: field,
              })
            }
          />
        )}
      </>
    );
  },
};

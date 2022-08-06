import { ApiService } from "apiService/core";
import { Page } from "components/Page";
import { FC } from "react";
import { useHA } from "haService";
import { AutomationManager } from "components/AutomationManager";

export const AutomationRoute: FC<{ api: ApiService }> = ({ api }) => {
  const ha = useHA();
  return (
    <Page>
      <AutomationManager
        api={api}
        refreshAutomations={() => ha.callService("automation", "reload")}
        triggerAutomation={(entity_id) =>
          ha.callService(
            "automation",
            "trigger",
            {},
            {
              entity_id,
            }
          )
        }
        forceDeleteAutomation={(eid) =>
          ha.callHA({
            entity_id: eid,
            type: "config/entity_registry/remove",
          })
        }
        onAutomationStateChange={(eid, on) => {
          ha.callService(
            "automation",
            on ? "turn_on" : "turn_off",
            {},
            {
              entity_id: eid,
            }
          );
        }}
        haEntities={ha.entities}
      />
    </Page>
  );
};

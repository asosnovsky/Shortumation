import "./index.css";

import { FC, useEffect, useRef, useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Skeleton from "@mui/material/Skeleton";

import { ApiService } from "apiService/core";
import { HAEntitiesState } from "haService/HAEntities";
import { AutomationManagerLoaded } from "./Loaded";
import { Alert } from "@mui/material";
import { useSnackbar } from "notistack";
import { ErrorBoundary } from "components/ErrorBoundary";
import { getFailures } from "types/validators/helper";
import * as av from "types/validators/autmation";
import { useConfirm } from "material-ui-confirm";
import InputYaml from "components/Inputs/Base/InputYaml";

export type AutomationManagerProps = {
  onAutomationStateChange: (eid: string, on: boolean) => void;
  refreshAutomations: () => void;
  forceDeleteAutomation: (eid: string) => void;
  triggerAutomation: (eid: string) => void;
  haEntities: HAEntitiesState;
  api: ApiService;
};

export const AutomationManager: FC<AutomationManagerProps> = ({
  api,
  haEntities,
  onAutomationStateChange,
  refreshAutomations,
  forceDeleteAutomation,
  triggerAutomation,
}) => {
  const snackbr = useSnackbar();
  const confirm = useConfirm();
  const validationsShown = useRef(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    refreshAutomations();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (
      api.state.automations.ready &&
      api.state.automations.ok &&
      !validationsShown.current
    ) {
      const configAutomationsValidated = api.state.automations.data.data.map(
        (a) => {
          const failures = getFailures(a, av.AutomationData);
          return {
            automation: a,
            failures,
          };
        }
      );
      const invalidAutomations = configAutomationsValidated.filter(
        ({ failures }) => failures !== null
      );
      if (invalidAutomations.length > 0) {
        validationsShown.current = true;
        confirm({
          cancellationButtonProps: {
            style: { display: "none" },
          },
          title: "Invalid Automations detected!",
          content: (
            <>
              <ol className="invalid-automation-modal-list">
                {invalidAutomations.map(({ automation, failures }, i) => (
                  <li key={i}>
                    <b>Automation</b>
                    <InputYaml
                      label=""
                      value={automation}
                      onChange={() => {}}
                    />
                    <b>Errors</b>
                    <Alert
                      color="error"
                      className="invalid-automation-modal-list--errors"
                    >
                      <ul>
                        {failures &&
                          failures.map((f, fi) => (
                            <li key={fi}>
                              <b>{f.path}</b>: {f.message.join(", ")}
                            </li>
                          ))}
                      </ul>
                    </Alert>
                  </li>
                ))}
              </ol>
            </>
          ),
        })
          .then(console.info)
          .catch(console.error);
      }
    }
  }, [api.state.automations, validationsShown.current]);

  // handle bad states
  if (!haEntities.ready && haEntities.error) {
    return (
      <div className="automation-manager error">
        <Alert color="error">
          Failed to connect to websocket, please check that your access token is
          properly setup
        </Alert>{" "}
        <br />
        <code>{JSON.stringify(haEntities.error)}</code>
      </div>
    );
  }

  if (!haEntities.ready || !api.state.automations.ready) {
    return (
      <div className="automation-manager loading">
        <div className="automation-manager--sidebar loading">
          <Skeleton />
        </div>
        <div className="automation-manager--editor loading">
          <Skeleton />
        </div>
      </div>
    );
  }

  if (!api.state.automations.ok) {
    return (
      <div className="automation-manager error">
        <Alert color="error">
          Failed to load automations from <code>/config</code>
        </Alert>{" "}
        <br />
        <code>{api.state.automations.error}</code>
      </div>
    );
  }

  // alias

  const hassEntities = haEntities.collection;
  const configAutomations = api.state.automations.data;

  return (
    <ErrorBoundary
      additionalContext={{
        configAutomations,
        hassEntities,
      }}
    >
      <AutomationManagerLoaded
        configAutomations={configAutomations.data}
        hassEntities={hassEntities}
        onAutomationRun={triggerAutomation}
        onAutomationStateChange={onAutomationStateChange}
        onAutomationAdd={async (auto) => {
          await api.updateAutomation(auto);
          refreshAutomations();
        }}
        onAutomationDelete={(aid, eid) => {
          const autoToDelete = configAutomations.data.find(
            ({ id }) => id === aid
          );
          let deleteSent = false;
          if (autoToDelete) {
            api.removeAutomation(autoToDelete);
            deleteSent = true;
          }
          const hassAuto = hassEntities[eid];
          if (hassAuto) {
            forceDeleteAutomation(eid);
            deleteSent = true;
          }
          if (!deleteSent) {
            snackbr.enqueueSnackbar(
              "Failed to delete automation, this may be resolved by a refresh or reboot of Home Assistant",
              {
                variant: "error",
              }
            );
          }
          // refreshAutomations();
        }}
        onAutomationUpdate={(auto) => {
          api
            .updateAutomation(auto)
            .then(() => refreshAutomations())
            .catch(() => {
              snackbr.enqueueSnackbar(
                "Failed to update automation, this may be resolved by a refresh or reboot of Home Assistant.",
                {
                  variant: "error",
                }
              );
            });
        }}
        onUpdateTags={async (aid, t) => {
          setIsSaving(true);
          await api.updateTags({
            automation_id: aid,
            tags: t,
          });
          setIsSaving(false);
        }}
      >
        {isSaving && <LinearProgress />}
      </AutomationManagerLoaded>
    </ErrorBoundary>
  );
};

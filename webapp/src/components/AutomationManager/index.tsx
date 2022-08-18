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
import { APIResponse } from "apiService/types";

export type AutomationManagerProps = {
  onAutomationStateChange: (eid: string, on: boolean) => Promise<any>;
  refreshAutomations: () => Promise<any>;
  forceDeleteAutomation: (eid: string) => Promise<any>;
  triggerAutomation: (eid: string) => Promise<any>;
  haEntities: HAEntitiesState;
  api: ApiService;
};

export const AutomationManager: FC<AutomationManagerProps> = ({
  api,
  haEntities,
  onAutomationStateChange: _onAutomationStateChange,
  refreshAutomations: _refreshAutomations,
  forceDeleteAutomation: _forceDeleteAutomation,
  triggerAutomation: _triggerAutomation,
}) => {
  const snackbr = useSnackbar();
  const confirm = useConfirm();
  const validationsShown = useRef(false);
  const [isSaving, setIsSaving] = useState<string[]>([]);

  // helpers
  function wrapPromise<T>(
    name: string,
    errorMessage: string,
    makePromise: () => Promise<T>
  ) {
    setIsSaving(isSaving.concat([name]));
    return makePromise()
      .then((resp) => {
        setIsSaving(isSaving.filter((k) => k !== name));
        return resp;
      })
      .catch((err) => {
        console.error(err);
        snackbr.enqueueSnackbar(errorMessage.replace("{{err}}", String(err)), {
          variant: "error",
        });
        setIsSaving(isSaving.filter((k) => k !== name));
      });
  }
  const wrapApiPromise = (
    name: string,
    errorMessage: string,
    makePromise: () => Promise<APIResponse<any>>
  ) => {
    wrapPromise(name, errorMessage, makePromise).then((resp) => {
      if (resp) {
        if (resp.ok) {
          refreshAutomations();
        } else {
          snackbr.enqueueSnackbar(errorMessage.replace("{{err}}", resp.error), {
            variant: "error",
          });
        }
      }
    });
  };

  const onAutomationStateChange = (eid: string, on: boolean) =>
    wrapPromise(
      "changing automation state",
      'failed to toggle autonation due to "{{err}}"',
      () => _onAutomationStateChange(eid, on)
    );
  const refreshAutomations = () =>
    wrapPromise(
      "refreshing automations",
      'failed refreshing automations due to "{{err}}"',
      () => _refreshAutomations()
    );
  const forceDeleteAutomation = (eid: string) =>
    wrapPromise("deleting automations", 'failed delete due to "{{err}}"', () =>
      _forceDeleteAutomation(eid)
    );
  const triggerAutomation = (eid: string) =>
    wrapPromise(
      "triggering automations",
      'failed trigger due to "{{err}}"',
      () => _triggerAutomation(eid)
    );

  // effects
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
      if (invalidAutomations.length > 0 && !validationsShown.current) {
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
  }, [api.state.automations, confirm]);

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
    let error = api.state.automations.error;
    try {
      const errorObj = JSON.parse(api.state.automations.error);
      if ("detail" in errorObj) {
        error = errorObj["detail"];
      }
    } catch (_: any) {}
    return (
      <div className="automation-manager error">
        <Alert color="error">
          Failed to load automations from <code>/config</code>
        </Alert>{" "}
        <br />
        <code>{error}</code>
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
      {isSaving.length > 0 && (
        <>
          <span>{isSaving.join(" and ")}...</span>
          <LinearProgress />
        </>
      )}
      <AutomationManagerLoaded
        configAutomations={configAutomations.data}
        hassEntities={hassEntities}
        onAutomationRun={triggerAutomation}
        onAutomationStateChange={onAutomationStateChange}
        onAutomationAdd={(auto) =>
          wrapApiPromise(
            "adding automation",
            "Failed to create automation, recieved error: {{err}}!",
            () => api.createAutomation(auto) as any
          )
        }
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
        onAutomationUpdate={(auto) =>
          wrapApiPromise(
            "updating automation",
            "Failed to update automation, recieved error: {{err}}!",
            () => api.updateAutomation(auto) as any
          )
        }
        onUpdateTags={async (aid, t) => {
          wrapApiPromise(
            "updating tags",
            "Failed to update tags, recieved error: {{err}}!",
            () =>
              api.updateTags({
                automation_id: aid,
                tags: t,
              }) as any
          );
        }}
      />
    </ErrorBoundary>
  );
};

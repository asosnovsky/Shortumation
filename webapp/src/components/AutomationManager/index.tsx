import "./index.css";

import { FC, useEffect, useRef, useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Skeleton from "@mui/material/Skeleton";

import { ApiService } from "services/apiService/core";
import { HAEntitiesState } from "services/haService/HAEntities";
import { AutomationManagerLoaded } from "./Loaded";
import { Alert } from "@mui/material";
import { useSnackbar } from "notistack";
import { ErrorBoundary } from "components/ErrorBoundary";
import { getFailures } from "types/validators/helper";
import * as av from "types/validators/autmation";
import { useConfirm } from "material-ui-confirm";
import InputYaml from "components/Inputs/Base/InputYaml";
import { APIResponse } from "services/apiService/types";
import { useLang } from "services/lang";

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
  const langStore = useLang();
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
        snackbr.enqueueSnackbar(
          langStore.get(errorMessage, {
            err: String(err),
          }),
          {
            variant: "error",
          }
        );
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
          snackbr.enqueueSnackbar(
            langStore.get(errorMessage, {
              err: resp.error,
            }),
            {
              variant: "error",
            }
          );
        }
      }
    });
  };

  const onAutomationStateChange = (eid: string, on: boolean) =>
    wrapPromise(
      langStore.get("AUTOMATION_MANAGER_STATE_CHANGE"),
      "AUTOMATION_MANAGER_STATE_CHANGE_FAIL",
      () => _onAutomationStateChange(eid, on)
    );
  const refreshAutomations = () =>
    wrapPromise(
      langStore.get("AUTOMATION_MANAGER_REFRESH"),
      "AUTOMATION_MANAGER_REFRESH_FAIL",
      () => _refreshAutomations()
    );
  const forceDeleteAutomation = (eid: string) =>
    wrapPromise(
      langStore.get("AUTOMATION_MANAGER_DELETE"),
      "AUTOMATION_MANAGER_DELETE_FAIL",
      () => _forceDeleteAutomation(eid)
    );
  const triggerAutomation = (eid: string) =>
    wrapPromise(
      langStore.get("AUTOMATION_MANAGER_TRIGGER"),
      "AUTOMATION_MANAGER_TRIGGER_FAIL",
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
          title: langStore.get("ERROR_INVALID_AUTOMATION_DETECTED"),
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
    // eslint-disable-next-line
  }, [api.state.automations, confirm]);

  // handle bad states
  if (!haEntities.ready && haEntities.error) {
    return (
      <div className="automation-manager error">
        <Alert color="error">
          {langStore.get("ERROR_FAILED_CONNECTION_TO_HA")}
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
          {langStore.get("ISSUES_FIND_AUTOMATION_IN_CONFIG")}
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
            langStore.get("AUTOMATION_MANAGER_ADD"),
            "AUTOMATION_MANAGER_ADD_FAIL",
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
              langStore.get("AUTOMATION_MANAGER_DELETE_LIGHT"),
              {
                variant: "error",
              }
            );
          }
          refreshAutomations();
        }}
        onAutomationUpdate={(auto) =>
          wrapApiPromise(
            langStore.get("AUTOMATION_MANAGER_UPDATE"),
            "AUTOMATION_MANAGER_UPDATE_FAIL",
            () => api.updateAutomation(auto) as any
          )
        }
        onUpdateTags={async (aid, t) => {
          wrapApiPromise(
            langStore.get("AUTOMATION_MANAGER_UPDATE_TAGS"),
            "AUTOMATION_MANAGER_UPDATE_TAGS_FAIL",
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

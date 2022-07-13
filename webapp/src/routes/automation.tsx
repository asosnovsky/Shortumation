import { ApiService } from "apiService/core";
import { ConnectedAutomationList } from "components/AutomationList";
import { DEFAULT_DIMS } from "components/DAGGraph/elements/constants";
import { Page } from "components/Page";
import { FC } from "react";

export const AutomationRoute: FC<{ api: ApiService }> = ({ api }) => {
  return (
    <Page>
      <ConnectedAutomationList dims={DEFAULT_DIMS} api={api} />
    </Page>
  );
};

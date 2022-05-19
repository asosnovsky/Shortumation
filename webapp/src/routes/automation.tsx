import { ApiService } from 'apiService/core';
import { ConnectedAutomationList } from "components/AutomationList";
import { DEFAULT_DIMS } from "components/DAGFlow/constants";
import { FC } from "react";




export const AutomationRoute: FC<{ api: ApiService }> = ({
  api
}) => {


  return <div className="page">
    <ConnectedAutomationList
      dims={DEFAULT_DIMS}
      api={api}
    />
  </div>
}

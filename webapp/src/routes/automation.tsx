import { ApiService } from 'apiService/core';
import { ConnectedAutmationList } from "components/AutomationList";
import { DEFAULT_DIMS } from "components/DAGSvgs/constants";
import { FC } from "react";




export const AutomationRoute: FC<{ api: ApiService }> = ({
  api
}) => {


  return <div className="page">
    <ConnectedAutmationList
      dims={DEFAULT_DIMS}
      api={api}
    />
  </div>
}

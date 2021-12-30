import { ApiService } from 'apiService/core';
import { ConnectedAutmationList } from "components/AutomationList";
import { DEFAULT_DIMS } from "components/DAGSvgs/constants";
import { FC } from "react";
import { usePageTheme } from "styles/page";



export const AutomationRoute: FC<{ api: ApiService }> = ({
  api
}) => {
  const { classes } = usePageTheme({});

  return <div className={classes.page}>
    <ConnectedAutmationList
      dims={DEFAULT_DIMS}
      api={api}
    />
  </div>
}

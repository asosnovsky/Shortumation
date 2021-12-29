import { AutomationList } from "components/AutomationList";
import { DEFAULT_DIMS } from "components/DAGSvgs/constants";
import { FC, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { usePageTheme } from "styles/page";
import { AutomationData } from "types/automations";



export const AutomationRoute: FC = () => {
  const { classes } = usePageTheme({});
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams);
  const [automations, setAutos] = useState<AutomationData[]>([]);

  return <div className={classes.page}>
    <AutomationList
      dims={DEFAULT_DIMS}
      automations={automations}
      onUpdate={(i, auto) => setAutos([
        ...automations.slice(0, i),
        auto,
        ...automations.slice(i + 1)
      ])}
      onAdd={auto => setAutos([...automations, auto])}
      onRemove={i => setAutos([
        ...automations.slice(0, i),
        ...automations.slice(i + 1)
      ])}
    />
  </div>
}

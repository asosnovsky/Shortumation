import React, { FC, useEffect, useState } from "react";
import { makeStory } from "devUtils";
import { useHA } from "services/haService";
import InputYaml from "components/Inputs/Base/InputYaml";
import { InputList } from "components/Inputs/InputList";
import { Button } from "components/Inputs/Buttons/Button";
import { ServiceEditor } from "components/ServiceEditor";

const Test: FC = () => {
  const { services, callService, entities } = useHA();

  const data = services.collection ?? {};

  const domain = "automation";

  const domains = Object.keys(data[domain] ?? "").sort();

  const [service, setService] = useState(domains[0] ?? "");
  const serviceDefn = (data[domain] ?? {})[service] ?? {};

  const [serviceData, setServiceData] = useState({ field: {}, target: {} });

  useEffect(() => {
    setService(domains[0] ?? "");
    setServiceData({ field: {}, target: {} });
  }, [domain, setService]);

  let serviceEditElm = <>Failed to load</>;

  try {
    if (service) {
      serviceEditElm = (
        <div
          style={{
            border: "1px solid var(--mui-grey-400)",
            maxWidth: "100vw",
            padding: "2.5em",
            margin: "2.5em",
          }}
        >
          <ServiceEditor
            service={serviceDefn}
            serviceId={`${domain}.${service}`}
            data={serviceData}
            onUpdate={setServiceData}
          />
        </div>
      );
    }
  } catch (err) {
    serviceEditElm = <>{JSON.stringify(err)}</>;
  }

  return (
    <div style={{ overflow: "auto", maxHeight: "100vh" }}>
      <InputList
        label="Services"
        current={service}
        onChange={setService}
        options={domains}
      />
      <Button
        onClick={() =>
          callService(domain, service, serviceData.field, serviceData.target)
        }
      >
        Call
      </Button>
      {serviceEditElm}
      <InputYaml label="Service Data" value={serviceDefn} onChange={() => {}} />
      {(((serviceData.target ?? {}) as any).entity_id ?? []).map((eid: any) => (
        <span>
          {eid}: {entities.getStates([eid])}
        </span>
      ))}
    </div>
  );
};

const { make, componentMeta } = makeStory({
  Component: Test,
  meta: {
    title: "Services/HA Service",
  },
});

export default componentMeta;
export const AutomationCall = make({});

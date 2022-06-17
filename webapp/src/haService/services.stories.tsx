import React, { FC, useEffect, useState } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Page } from "components/Page";
import { useHA } from "haService";
import InputYaml from "components/Inputs/InputYaml";
import { InputList } from "components/Inputs/InputList";
import { Button } from "components/Inputs/Button";
import { ServiceEditor } from "components/ServiceEditor";

const Test: FC = () => {
  const { services, callService } = useHA();

  const data = services.collection?.state ?? {};
  const options = Object.keys(data).sort();

  // const flattened: any[] = [];
  // Object.keys(data).forEach(domain => {
  //     Object.keys(data[domain]).forEach(
  //         service_name => {
  //             const service = data[domain][service_name];
  //             const all: any = {
  //                 domain, service_name,
  //             }

  //             flattened.push({
  //                 domain, service_name,
  //                 fields: Object.keys(service.fields).map(k => ({
  //                     name: k,
  //                     data: service.fields[k]
  //                 })),
  //                 target: Object.keys(service.target ?? {}).map(k => ({
  //                     name: k,
  //                     data: (service.target as any)[k]
  //                 }))
  //             })
  //         }
  //     )
  // })

  // console.info(flattened)

  // const summary: Record<string, Record<string, { total: number, domains: string[], values: Set<string> }>> = {}
  // const fields: Record<string, Record<string, { total: number, values: Set<string> }>> = {}
  // const target: Record<string, Record<string, { total: number, values: Set<string> }>> = {}

  // Object.keys(data).forEach(domain =>
  //     Object.keys(data[domain]).forEach(
  //         action => {
  //             const service = data[domain][action];
  //             Object.keys(service.fields).forEach(field => {
  //                 const value = service.fields[field];
  //                 const valueType = `${typeof value}-${Array.isArray(value)}`;
  //                 fields[field] = fields[field] ?? {}
  //                 fields[field][valueType] = fields[field][valueType] ?? {
  //                     total: 0,
  //                     domains: [],
  //                     values: new Set()
  //                 }
  //                 fields[field][valueType].total += 1
  //                 fields[field][valueType].values.add(JSON.stringify(value))

  //             })
  //             Object.keys(service.target ?? {}).forEach(field => {
  //                 const value = (service.target as any)[field];
  //                 const valueType = `${typeof value}-${Array.isArray(value)}`;
  //                 target[field] = target[field] ?? {}
  //                 target[field][valueType] = target[field][valueType] ?? {
  //                     total: 0,
  //                     domains: [],
  //                     values: new Set()
  //                 }
  //                 target[field][valueType].total += 1
  //                 target[field][valueType].values.add(JSON.stringify(value))

  //             })
  //             Object.keys(service).forEach(field => {
  //                 const value = (service as any)[field];
  //                 const valueType = `${typeof value}-${Array.isArray(value)}`;
  //                 summary[field] = summary[field] ?? {}
  //                 summary[field][valueType] = summary[field][valueType] ?? {
  //                     total: 0,
  //                     domains: [],
  //                     values: new Set()
  //                 }
  //                 summary[field][valueType].total += 1
  //                 summary[field][valueType].domains.push(`${domain}.${action}`)
  //                 summary[field][valueType].values.add(JSON.stringify(value))
  //             })
  //         }
  //     )
  // )

  const [domain, setDomain] = useState(options[0] ?? "");

  const domains = Object.keys(data[domain] ?? "").sort();

  const [service, setService] = useState(domains[0] ?? "");
  const serviceDefn = (data[domain] ?? {})[service] ?? {};

  useEffect(() => {
    setService(domains[0] ?? "");
  }, [domain, setService]);

  let serviceEditElm = <>Failed to load</>;

  try {
    if (service) {
      serviceEditElm = (
        <div
          style={{
            border: "1px solid var(--primary-accent)",
            maxWidth: "100vw",
            padding: "2.5em",
            margin: "2.5em",
          }}
        >
          <ServiceEditor
            service={serviceDefn}
            serviceId={`${domain}.${service}`}
            data={{ field: {}, target: {} }}
            onUpdate={() => {}}
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
        label="Domains"
        current={domain}
        onChange={setDomain}
        options={options}
      />
      <InputList
        label="Services"
        current={service}
        onChange={setService}
        options={domains}
      />
      <Button onClick={() => callService(domain, service)}>Call</Button>
      {serviceEditElm}
      <InputYaml label="Service Data" value={serviceDefn} onChange={() => {}} />
      <code>{JSON.stringify(serviceDefn, null, 4)}</code>

      {/* <ul style={{
            maxHeight: '20vh',
            overflow: 'auto',
        }}>
            {Object.keys(summary).map(k => <li key={k}>
                <b>{k}</b> <ul>
                    {Object.keys(summary[k]).map(t => <li key={k + t}>
                        <b>{t}</b> ({summary[k][t].total})
                        <ul style={{ maxHeight: '200px', overflow: 'auto' }}>
                            {Array.from(summary[k][t].values.values()).sort().map((v, i) => <li key={i}>
                                {v}
                            </li>)}
                        </ul>
                    </li>)}
                </ul>
            </li>)}
        </ul>
        <h1>Fields</h1>
        <ul style={{
            maxHeight: '20vh',
            overflow: 'auto',
        }}>
            {Object.keys(fields).map(k => <li key={k}>
                <b>{k}</b> <ul>
                    {Object.keys(fields[k]).map(t => <li key={k + t}>
                        <b>{t}</b> ({fields[k][t].total})
                        <ul style={{ maxHeight: '200px', overflow: 'auto' }}>
                            {Array.from(fields[k][t].values.values()).sort().map((v, i) => <li key={i}>
                                {v}
                            </li>)}
                        </ul>
                    </li>)}
                </ul>
            </li>)}
        </ul>
        <h1>Targets</h1>
        <ul style={{
            maxHeight: '20vh',
            overflow: 'auto',
        }}>
            {Object.keys(target).map(k => <li key={k}>
                <b>{k}</b> <ul>
                    {Object.keys(target[k]).map(t => <li key={k + t}>
                        <b>{t}</b> ({target[k][t].total})
                        <ul style={{ maxHeight: '200px', overflow: 'auto' }}>
                            {Array.from(target[k][t].values.values()).sort().map((v, i) => <li key={i}>
                                {v}
                            </li>)}
                        </ul>
                    </li>)}
                </ul>
            </li>)}
        </ul> */}
    </div>
  );
};

export default {
  title: "Services/HA Service",
  component: Test,
  parameters: { actions: { argTypesRegex: "^on.*" } },
  args: {},
} as ComponentMeta<typeof Test>;

export const Base: ComponentStory<typeof Test> = (props) => {
  return (
    <Page>
      <Test {...props} />
    </Page>
  );
};

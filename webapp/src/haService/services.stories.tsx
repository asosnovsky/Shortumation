import React, { FC, useEffect, useState } from "react";
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Page } from "components/Page";
import { useHA } from "haService";
import InputYaml from "components/Inputs/InputYaml";
import { InputList } from "components/Inputs/InputList";
import { Button } from "components/Inputs/Button";

const Test: FC = () => {
    const { services, callService } = useHA();

    const data = services.collection?.state ?? {};
    const options = Object.keys(data).sort();

    const summary: Record<string, Record<string, { total: number, domains: string[], values: Set<string> }>> = {}
    const fields: Record<string, Record<string, { total: number, values: Set<string> }>> = {}
    const target: Record<string, Record<string, { total: number, values: Set<string> }>> = {}

    Object.keys(data).forEach(domain =>
        Object.keys(data[domain]).forEach(
            action => {
                const service = data[domain][action];
                Object.keys(service.fields).forEach(field => {
                    const value = service.fields[field];
                    const valueType = `${typeof value}-${Array.isArray(value)}`;
                    fields[field] = fields[field] ?? {}
                    fields[field][valueType] = fields[field][valueType] ?? {
                        total: 0,
                        domains: [],
                        values: new Set()
                    }
                    fields[field][valueType].total += 1
                    fields[field][valueType].values.add(JSON.stringify(value))

                })
                Object.keys(service.target ?? {}).forEach(field => {
                    const value = (service.target as any)[field];
                    const valueType = `${typeof value}-${Array.isArray(value)}`;
                    target[field] = target[field] ?? {}
                    target[field][valueType] = target[field][valueType] ?? {
                        total: 0,
                        domains: [],
                        values: new Set()
                    }
                    target[field][valueType].total += 1
                    target[field][valueType].values.add(JSON.stringify(value))

                })
                Object.keys(service).forEach(field => {
                    const value = (service as any)[field];
                    const valueType = `${typeof value}-${Array.isArray(value)}`;
                    summary[field] = summary[field] ?? {}
                    summary[field][valueType] = summary[field][valueType] ?? {
                        total: 0,
                        domains: [],
                        values: new Set()
                    }
                    summary[field][valueType].total += 1
                    summary[field][valueType].domains.push(`${domain}.${action}`)
                    summary[field][valueType].values.add(JSON.stringify(value))
                })
            }
        )
    )

    const [domain, setDomain] = useState(options[0] ?? "");

    const domains = Object.keys(data[domain] ?? "").sort();

    const [service, setService] = useState(domains[0] ?? "");

    useEffect(() => {
        setService(domains[0] ?? "")
    }, [domain, setService])


    return <div style={{ overflow: 'auto', maxHeight: '100vh' }}>
        <InputList label="Domains" current={domain} onChange={setDomain} options={options} />
        <InputList label="Services" current={service} onChange={setService} options={domains} />
        <Button onClick={() => callService(domain, service)}>Call</Button>
        <InputYaml label="Service Data" value={(data[domain] ?? {})[service] ?? {}} onChange={() => { }} />
        <ul style={{
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
        </ul>
    </div>
}

export default {
    title: 'Services/HA Service',
    component: Test,
    parameters: { actions: { argTypesRegex: '^on.*' } },
    args: {
    }
} as ComponentMeta<typeof Test>

export const Base: ComponentStory<typeof Test> = props => {

    return <Page>
        <Test {...props} />
    </Page>
};
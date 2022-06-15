import "./index.css";

import { cleanUpUndefined } from "components/NodeEditor/OptionManager/OptionManager";
import { TypedHassService } from "haService/fieldTypes";
import { FC, useState } from "react";
import {
  ServiceEditorOption,
  splitUpOptions,
  convertFieldToOption,
  convertTargetToOption,
  ServiceEditorData,
} from "./options";
import { ServiceEditorField } from "./ServiceEditorField";
import { InputAutoComplete } from "components/Inputs/InputAutoComplete";

export type ServiceEditorProps = {
  serviceId: string;
  service: TypedHassService;
  data: ServiceEditorData;
  onUpdate: (d: ServiceEditorData) => void;
};
export const ServiceEditor: FC<ServiceEditorProps> = ({
  serviceId,
  service,
  data,
  onUpdate,
}) => {
  const options = splitUpOptions(service, data);
  console.log(service);
  const [additionalFields, setAdditionalFields] = useState<{
    field: string[];
    optionalList: ServiceEditorOption[];
  }>({
    field: options.incmFields,
    optionalList: options.additional,
  });

  // aliases
  const hasRequired = options.required.length > 0;
  const hasTargets = !!service.target && Object.keys(service.target).length > 0;
  const hasOptional = additionalFields.field.length > 0;
  const hasNothing =
    !hasRequired &&
    !hasOptional &&
    !hasTargets &&
    additionalFields.optionalList.length === 0;

  // render
  return (
    <div className="service-editor">
      <div className="service-editor--name">
        <b>
          {service.name} /<span>{serviceId}</span>
        </b>
        <span>{service.description}</span>
      </div>
      {hasNothing ? (
        <span>This Service Requires no inputs</span>
      ) : (
        <>
          {options.required.map((opt) => (
            <ServiceEditorField
              key={opt.type + opt.id}
              option={opt}
              value={data[opt.type][opt.id]}
              onChange={(v) =>
                onUpdate({
                  ...data,
                  [opt.type]: {
                    ...data[opt.type],
                    [opt.id]: v,
                  },
                })
              }
            />
          ))}
          {hasTargets && (
            <div className="service-editor--target">
              {Object.keys(service.target ?? {}).map((key) => {
                const targetData = (service.target as any)[key];
                const option = convertTargetToOption(key, targetData);
                return (
                  <ServiceEditorField
                    key={"fields-" + key}
                    option={option}
                    value={data.target[key] ?? ""}
                    onChange={(v) =>
                      onUpdate({
                        ...data,
                        target: {
                          ...data.target,
                          [key]: v,
                        },
                      })
                    }
                  />
                );
              })}
            </div>
          )}
          <div className="service-editor--used">
            {additionalFields.field.map((key) => {
              const serviceData = service.fields[key];
              const option = convertFieldToOption(key, serviceData);
              return (
                <ServiceEditorField
                  key={"fields-" + key}
                  option={option}
                  value={data.field[key] ?? ""}
                  onRemove={() => {
                    setAdditionalFields({
                      ...additionalFields,
                      field: additionalFields.field.filter((k) => k !== key),
                      optionalList:
                        additionalFields.optionalList.concat(option),
                    });
                    onUpdate({
                      ...data,
                      field: cleanUpUndefined({
                        ...data.field,
                        [key]: undefined,
                      }),
                    });
                  }}
                  onChange={(v) =>
                    onUpdate({
                      ...data,
                      field: {
                        ...data.field,
                        [key]: v,
                      },
                    })
                  }
                />
              );
            })}
          </div>
        </>
      )}
      <hr />
      {additionalFields.optionalList.length > 0 && (
        <div className="service-editor--add">
          <InputAutoComplete
            label="Additional Field"
            helperText="Include an additional none-optional fields from this list."
            className="service-editor--add--list"
            value={""}
            onChange={(id) => {
              const newField = additionalFields.optionalList.filter(
                (opt) => opt.id === id
              )[0];
              if (newField) {
                setAdditionalFields({
                  ...additionalFields,
                  field: additionalFields.field.concat([newField.id]),
                  optionalList: additionalFields.optionalList.filter(
                    (opt) =>
                      !(opt.type === newField.type && opt.id === newField.id)
                  ),
                });
              }
            }}
            options={additionalFields.optionalList}
          />
        </div>
      )}
    </div>
  );
};

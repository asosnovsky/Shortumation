import "./index.css";

import { InputList } from "components/Inputs/InputList";
import { cleanUpUndefined } from "components/NodeEditor/OptionManager/OptionManager";
import { TypedHassService } from "haService/fieldTypes";
import { FC, useState } from "react";
import {
  ServiceEditorOption,
  splitUpOptions,
  convertFieldToOption,
  convertTargetToOption,
} from "./options";
import { ServiceEditorField } from "./ServiceEditorField";
import { InputAutoComplete } from "components/Inputs/InputAutoComplete";

export type ServiceEditorData = {
  field: Record<string, any>;
  target: Record<string, any>;
};
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
  const options = splitUpOptions(service);
  const [additionalFields, setAdditionalFields] = useState<{
    field: string[];
    target: string[];
    optionalList: ServiceEditorOption[];
  }>({
    field: [],
    target: [],
    optionalList: options.additional,
  });

  // aliases
  const hasRequired = options.required.length > 0;
  const hasOptional =
    additionalFields.field.length + additionalFields.target.length > 0;
  const hasNothing =
    !hasRequired && !hasOptional && additionalFields.optionalList.length === 0;

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
            {additionalFields.target.map((key) => {
              const targetData = (service.target as any)[key];
              const option = convertTargetToOption(key, targetData);
              return (
                <ServiceEditorField
                  key={"fields-" + key}
                  option={option}
                  value={data.target[key] ?? ""}
                  onRemove={() => {
                    setAdditionalFields({
                      ...additionalFields,
                      target: additionalFields.target.filter((k) => k !== key),
                      optionalList:
                        additionalFields.optionalList.concat(option),
                    });
                    onUpdate({
                      ...data,
                      target: cleanUpUndefined({
                        ...data.target,
                        [key]: undefined,
                      }),
                    });
                  }}
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
        </>
      )}
      <hr style={{ width: "90%" }} />
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
                  [newField.type]: additionalFields[newField.type].concat([
                    newField.id,
                  ]),
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

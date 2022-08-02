import "./index.css";

import { cleanUpUndefined } from "utils/helpers";
import { TypedHassService } from "haService/fieldTypes";
import { FC, useState } from "react";
import {
  ServiceEditorOption,
  splitUpOptions,
  convertFieldToOption,
  ServiceEditorData,
} from "./options";
import { ServiceEditorField } from "./ServiceEditorField";
import { InputAutoComplete } from "components/Inputs/AutoComplete/InputAutoComplete";
import { ServiceEditorTarget } from "./ServiceEditorTarget";

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
              key={"field-" + opt.id}
              option={opt}
              value={data.field[opt.id]}
              onChange={(v) =>
                onUpdate({
                  ...data,
                  field: {
                    ...data.field,
                    [opt.id]: v,
                  },
                })
              }
            />
          ))}
          {hasTargets && (
            <ServiceEditorTarget
              key={"target-" + serviceId}
              defn={service.target ?? {}}
              value={data.target}
              onChange={(target) =>
                onUpdate({
                  ...data,
                  target,
                })
              }
            />
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
                    (opt) => !(opt.id === newField.id)
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

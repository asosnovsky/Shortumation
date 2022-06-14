import { BaseOption, Option } from "haService";
import { FieldData, TargetData, TypedHassService } from "haService/fieldTypes";
import { prettyName } from "utils/formatting";
export type ServiceEditorOption = BaseOption<
  | {
      type: "field";
      data: {
        description: string;
      } & FieldData;
    }
  | {
      type: "target";
      data: {
        description: string;
      } & TargetData;
    }
>;

export const convertFieldToOption = (id: string, data: FieldData): ServiceEditorOption => ({
  id,
  label: data.name ?? prettyName(id),
  type: "field",
  data,
})

export const convertTargetToOption = (id: string, data: TargetData): ServiceEditorOption => ({
  id,
  type: "target",
  label: ((data ?? {}) as any).name ?? prettyName(id),
  data: (data as any) ?? {
    description: "",
  },
})
  
export const splitUpOptions = (service: TypedHassService) => {
  const required: ServiceEditorOption[] = [];
  const additional: ServiceEditorOption[] = [];
  Object.keys(service.fields ?? {}).forEach((key) => {
    const serviceData = service.fields[key];
    const opt = convertFieldToOption(key, serviceData);
    if (serviceData.required) {
      required.push(opt);
    } else {
      additional.push(opt);
    }
  });
  Object.keys(service.target ?? {}).forEach((key) =>{
    const serviceData = (service.target ?? ({} as any))[key];
    additional.push(convertTargetToOption(key, serviceData))
  });
  return { required, additional };
};

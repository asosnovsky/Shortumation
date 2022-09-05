import { BaseOption } from "components/Inputs/AutoComplete/InputAutoComplete";
import { FieldData, TypedHassService } from "services/haService/fieldTypes";
import { prettyName } from "utils/formatting";

export type ServiceEditorData = {
  field: Record<string, any>;
  target: Record<string, any>;
};
export type ServiceEditorOption = BaseOption<{
  data: FieldData;
}>;

export const convertFieldToOption = (
  id: string,
  data: FieldData
): ServiceEditorOption => ({
  id,
  label: data.name ?? prettyName(id),
  data,
});

export const splitUpOptions = (
  service: TypedHassService,
  data: ServiceEditorData
) => {
  const required: ServiceEditorOption[] = [];
  const additional: ServiceEditorOption[] = [];
  const incmFields: string[] = [];
  Object.keys(service.fields ?? {}).forEach((key) => {
    const serviceData = service.fields[key];
    const opt = convertFieldToOption(key, serviceData);
    if (serviceData.required) {
      required.push(opt);
    } else {
      if (data.field[opt.id]) {
        incmFields.push(opt.id);
      } else {
        additional.push(opt);
      }
    }
  });
  return { required, additional, incmFields };
};

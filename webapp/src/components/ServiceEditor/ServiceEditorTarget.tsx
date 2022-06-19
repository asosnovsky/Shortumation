import "./ServiceEditorTarget.css";
import { InputDevice } from "components/Inputs/InputDevice";
import { InputEntity } from "components/Inputs/InputEntities";
import { Targets } from "haService/fieldTypes";
import { FC } from "react";
import { InputArea } from "components/Inputs/InputArea";

type RawTargetData = {
  entity_id?: string[] | string;
  area_id?: string[] | string;
  device_id?: string[] | string;
};
type CleanTargetData = {
  entity_id: string[];
  area_id: string[];
  device_id: string[];
};

export type ServiceEditorTargetProps = {
  defn: Targets;
  value: RawTargetData | null | undefined;
  onChange: (v: any) => void;
};
export const ServiceEditorTarget: FC<ServiceEditorTargetProps> = (props) => {
  const value = cleanUpValue(props.value ?? {});
  const domainRestrictions: string[] = [];
  const integrationRestrictions: string[] = [];

  if (props.defn.entity) {
    if (typeof props.defn.entity.domain === "string") {
      domainRestrictions.push(props.defn.entity.domain);
    }
    if (typeof props.defn.entity.integration === "string") {
      integrationRestrictions.push(props.defn.entity.integration);
    }
  }

  return (
    <div className="service-editor--targets">
      <InputEntity
        label="Entity"
        value={value.entity_id}
        onChange={(entity_id) =>
          props.onChange({
            ...(props.value || {}),
            entity_id,
          })
        }
        restrictToDomain={
          domainRestrictions.length === 0 ? undefined : domainRestrictions
        }
        restrictedIntegrations={
          integrationRestrictions.length === 0
            ? undefined
            : integrationRestrictions
        }
        multiple
      />
      <InputDevice
        label="Device"
        value={value.device_id}
        onChange={(device_id) =>
          props.onChange({
            ...(props.value || {}),
            device_id,
          })
        }
        multiple
      />
      <InputArea
        label="Area"
        value={value.area_id}
        onChange={(area_id) =>
          props.onChange({
            ...(props.value || {}),
            area_id,
          })
        }
        multiple
      />
    </div>
  );
};

const cleanUpValue = (value: RawTargetData): CleanTargetData => {
  const cleanOne = (v?: string[] | string): string[] => {
    if (typeof v === "string") {
      return [v];
    }
    if (!v || !Array.isArray(v)) {
      return [];
    }
    return v;
  };
  return {
    entity_id: cleanOne(value.entity_id),
    device_id: cleanOne(value.device_id),
    area_id: cleanOne(value.area_id),
  };
};

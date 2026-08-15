import { data_container_types, DataContainer, FieldData, FieldNode } from "../../constants/DataTypes";
import { SETTING } from "../../constants/setting-enums";
import { settingDefinitions } from "../../hooks/NodeRegistry";

export type CommonProps = {
    template: DataContainer<data_container_types> | null;
    id: string; field: FieldNode<FieldData> | null;
    fieldKey: string;
    defaultShown: boolean;
    locked?: boolean;
    onChange?: (template: DataContainer<data_container_types>,
        defaultShown: boolean,
        newValue: FieldNode<FieldData>) => void;
};

export default function SettingManager({
    template,
    id,
    field,
    fieldKey,
    defaultShown,
    onChange,
}: CommonProps) {
    if (!defaultShown) return null;

    const settingType = SETTING[fieldKey as keyof typeof SETTING];

    if (!settingType) {
        return null;
    }

    const SettingComponent = settingDefinitions[settingType as keyof typeof settingDefinitions];

    if (!SettingComponent) {
        return null;
    }

    const commonProps = {
        template,
        id,
        field,
        fieldKey,
        defaultShown,
        onChange: (
            template: DataContainer<data_container_types>,
            defaultShown: boolean,
            newValue: FieldNode<FieldData>
        ) => onChange?.(template, defaultShown, newValue),
    };

    return <SettingComponent {...commonProps} />;
}
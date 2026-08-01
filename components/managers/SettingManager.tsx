import { SETTING } from "../../constants/setting-enums";
import { useSettings } from "../../utils/SettingsProvider";
import SettingInputField from "../nodes/inputs/SettingInputField";
import NumberInputField from "../nodes/inputs/NumberInputField";
import TimeInputField from "../nodes/inputs/TimeInputField";
import { DataContainer, FieldNode, FieldData, data_container_types } from "../../constants/DataTypes";

export type CommonProps = { // put this in a constants file?
    template: DataContainer<data_container_types> | null;
    id: string;
    field: FieldNode<FieldData> | null;
    fieldKey: string;
    defaultShown: boolean;
    onChange?: (template: DataContainer<data_container_types>, defaultShown: boolean, newValue: FieldNode<FieldData>) => void;
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

    const commonProps = {
        template,
        id,
        field,
        fieldKey,
        defaultShown,
        onChange: (template: DataContainer<data_container_types>, defaultShown: boolean, newValue: FieldNode<FieldData>) => onChange?.(template, defaultShown, newValue),
    };
    switch (SETTING[fieldKey]) {
        case "text":
            return <SettingInputField {...commonProps} />;
        case "time":
            return <TimeInputField {...commonProps} />;
        case "number":
            return <NumberInputField {...commonProps} />;
        default:
            return <SettingInputField {...commonProps} />;
    }
}
//TODO: decide whether to send this through typednode/fieldnodefactory/sectionnodefactory/etc setup or no
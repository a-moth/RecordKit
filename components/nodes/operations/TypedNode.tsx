import { data_container_types, DataContainer, DateData, DurationData, FieldData, FieldNode, ScaleData, SelectionData, TextData, ToggleImageButtonData } from '../../../constants/DataTypes';
import BooleanInputField from '../inputs/BooleanInputField';
import DateInputField from '../inputs/DateInputField';
import DurationInputField from '../inputs/DurationInputField';
import ScaleInputField from '../inputs/ScaleInputField';
import SelectionInputField from '../inputs/SelectionInputField';
import TextInputField from '../inputs/TextInputField';

export default function TypedNode({ field, template, id, locked, onChange }: {
    template: DataContainer<data_container_types>,
    id: string,
    field: FieldNode<FieldData>,
    locked: boolean,
    onChange: (
        template: DataContainer<data_container_types>,
        defaultShown: boolean,
        value: FieldNode<FieldData>
    ) => void
}) {
    switch (field?.field.data.type) {
        case "text": // add Labels for each based on field
            return (
                <TextInputField
                    template={template}
                    id={field.id}
                    fieldKey={field.field.data.label}
                    field={field as FieldNode<TextData>}
                    defaultShown={field.field.data.visible}
                    locked={locked}
                    onChange={onChange}
                />
            );

        case "date":
            return (
                <DateInputField
                    template={template}
                    id={field.id}
                    fieldKey={field.field.data.label}
                    field={field as FieldNode<DateData>}
                    defaultShown={field.field.data.visible}
                    locked={locked}
                    onChange={onChange}
                />
            );

        case "duration":
            return (
                <DurationInputField
                    template={template}
                    id={field.id}
                    fieldKey={field.field.data.label}
                    field={field as FieldNode<DurationData>}
                    defaultShown={field.field.data.visible}
                    locked={locked}
                    onChange={onChange}
                />
            );

        case "selection":
            return (
                <SelectionInputField
                    template={template}
                    id={field.id}
                    fieldKey={field.field.data.label}
                    field={field as FieldNode<SelectionData>}
                    defaultShown={field.field.data.visible}
                    locked={locked}
                    onChange={onChange}
                />
            );

        case "scale":
            return (
                <ScaleInputField
                    template={template}
                    id={field.id}
                    fieldKey={field.field.data.label}
                    field={field as FieldNode<ScaleData>}
                    defaultShown={field.field.data.visible}
                    locked={locked}
                    onChange={onChange}
                />
            );

        case "boolean":
            return (
                <BooleanInputField
                    template={template}
                    id={field.id}
                    fieldKey={field.field.data.label}
                    field={field as FieldNode<ToggleImageButtonData>}
                    defaultShown={field.field.data.visible}
                    locked={locked}
                    onChange={onChange}
                />
            );

        default:
            return null;
    }
}
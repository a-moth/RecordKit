import { FieldData, FieldNode } from '../../../constants/DataTypes';
import { isValid, parse } from 'date-fns';
import { Text } from 'react-native';
import { useSettings } from '../../../utils/SettingsProvider';
import { useTheme } from '../../../hooks/use-theme-provider';

function isUnsignedInt(value: number): boolean {
    return Number.isInteger(value) && value >= 0;
}

export function validateFieldData(data: FieldData, settings: Record<string, string>): string | null {
    switch (data.type) {
        case "boolean":
            return null;

        case "date":
            if (!data.value) return null;
            try {
                return isValid(parse(data.value, data.format ?? settings?.["**dayFormat"] ?? "dd/MM/yyyy", new Date()))
                    ? null
                    : "Date is not a valid calendar date or is not in format " + (data.format ?? settings?.["**dayFormat"] ?? "dd/MM/yyyy");
            } catch (e) {
                return "Date is not a valid calendar date or is not in format " + (data.format ?? settings?.["**dayFormat"] ?? "dd/MM/yyyy");
            }

        case "duration":
            return isUnsignedInt(data.valueA) && isUnsignedInt(data.valueB)
                ? null
                : "Duration values must be whole numbers of zero or more.";

        case "scale":
            if (!isUnsignedInt(data.min) || !isUnsignedInt(data.max)) {
                return "Min and max must be whole numbers of zero or more.";
            }
            if (data.min >= data.max) {
                return "Min must be less than max.";
            }
            if (data.value !== 0 && (data.value < data.min || data.value > data.max)) {
                return "Value must fall within the min/max range.";
            }
            return null;

        case "selection":
            if (!data.options || data.options.length === 0) {
                return "Add at least one option to choose from.";
            }
            if (!data.multiple && data.selected.length > 1) {
                return "Only one option may be selected.";
            }
            const optionIds = new Set(data.options.map(option => option?.id));
            return data.selected.every(id => optionIds.has(id))
                ? null
                : "Selected value is no longer a valid option.";

        case "text":
            return null;

        case "image-boolean":
            // an unset image falls back to settings **image5/**image1 at render time (see BooleanImageInputField.tsx)
            return (data.imageSelected || settings?.["**image5"]) && (data.imageUnselected || settings?.["**image1"])
                ? null
                : "Both images must be set.";

        case "number":
            return Number.isFinite(data.value) ? null : "Enter a valid number.";

        case "time":
            if (!data.value) return null;
            try {
                return isValid(parse(data.value, data.format ?? settings?.["**timeFormat"] ?? "HH:mm", new Date()))
                    ? null
                    : "Time must be in " + (data.format ?? settings?.["**timeFormat"] ?? "HH:mm") + " format.";
            } catch (e) {
                return "Time must be in " + (data.format ?? settings?.["**timeFormat"] ?? "HH:mm") + " format.";
            }

        case "section":
            return Object.keys(data.childNodes).length > 0
                ? null
                : "Section has no fields.";

        default:
            return "Error, incorrect field type.";
    }
}

export function hasValidationErrors(data: Record<string, FieldNode<FieldData>>, settings: Record<string, string>): boolean {
    for (const node of Object.values(data)) {
        if (validateFieldData(node.field.data, settings) != null) {
            return true;
        }
        if (node.field.data.type === "section" &&
            hasValidationErrors(node.field.data.childNodes, settings)) {
            return true;
        }
    }
    return false;
}

export default function ValidationPreview({ field }: { field: FieldNode<FieldData> }) {
    const theme = useTheme();

    const { settings } = useSettings();

    if (field.type !== "field") return <></>;

    const error = validateFieldData(field.field.data, settings);
    if (!error) return <></>;

    return (
        <Text style={{ color: theme.colors.danger, fontFamily: theme.fonts?.regular.fontFamily }}>
            {error}
        </Text>
    );
}

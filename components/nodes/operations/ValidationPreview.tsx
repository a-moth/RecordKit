import { FieldData, FieldNode } from "../../../constants/DataTypes";
import { Text } from "react-native";
import { isValid, parseISO } from "date-fns";
import { useTheme } from "../../../hooks/use-theme-provider";

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

function isUnsignedInt(value: number): boolean {
    return Number.isInteger(value) && value >= 0;
}

function validateFieldData(data: FieldData): string | null {
    switch (data.type) {
        case "boolean":
            return null;

        case "date":
            if (!data.value) return null;
            return isValid(parseISO(data.value))
                ? null
                : "Date is not a valid calendar date.";

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
            return data.imageSelected && data.imageUnselected
                ? null
                : "Both images must be set.";

        case "number":
            return Number.isFinite(data.value) ? null : "Enter a valid number.";

        case "time":
            if (!data.value) return null;
            return TIME_PATTERN.test(data.value)
                ? null
                : "Time must be in HH:MM (24-hour) format.";

        case "section":
            return Object.keys(data.childNodes).length > 0
                ? null
                : "Section has no fields.";

        default:
            return "Error, incorrect field type.";
    }
}

export default function ValidationPreview({ field }: { field: FieldNode<FieldData> }) {
    const theme = useTheme();

    if (field.type !== "field") return <></>;

    const error = validateFieldData(field.field.data);
    if (!error) return <></>;

    return (
        <Text style={{ color: theme.colors.danger, fontFamily: theme.fonts?.regular.fontFamily }}>
            {error}
        </Text>
    );
}

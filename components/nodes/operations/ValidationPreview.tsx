import { FieldNode, FieldData } from "../../../constants/DataTypes";
import { Text } from "react-native";

export default function ValidationPreview({ field }: { field: FieldNode<FieldData> }) {
    switch (field.type) {
        case "field":
            switch (field.field.data.type) {
                case "boolean":
                    return <Text>Boolean Text</Text>
                case "date":
                    return <Text>Date</Text>
                case "duration":
                    return <Text>Duration</Text>
                case "scale":
                    return <Text>Scale</Text>
                case "selection":
                    return <Text>Selection</Text>
                case "text":
                    return <Text>Text</Text>
                case "image-boolean":
                    return <Text>Boolean Image</Text>
                case "number":
                    return <Text>Number</Text>
                case "time":
                    return <Text>Time</Text>
                case "section":
                    return <Text>Section</Text>;
                default:
                    return <Text>Error, incorrect field type.</Text>;
            }
    }
    return <></>;
}
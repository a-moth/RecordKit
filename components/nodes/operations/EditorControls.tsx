import { View } from "react-native";
import MiniButton from "../../common/MiniButton";

export default function EditorControls({ moveUp, moveDown, deleteField }: { moveUp: () => void; moveDown: () => void; deleteField: () => void; }) {
    return (
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <MiniButton label="Move Up" color="caution" onPress={moveUp} />
            <MiniButton label="Move Down" color="caution" onPress={moveDown} />
            <MiniButton label="Delete" color="danger" onPress={deleteField} />
        </View>
    );
}

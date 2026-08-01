import SettingManager from "../managers/SettingManager";
import { useSettings } from "../../utils/SettingsProvider";
import { ScrollView } from "react-native";

// so far all settings are arrays of strings under a string


export default function SettingsReader() {
  const { settings } = useSettings();

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {Object.keys(settings).map(key => (
        <SettingManager template={null} id={key} field={null} key={key} fieldKey={key} defaultShown={key.charAt(0) === "*"} />
      ))}
    </ScrollView>
  );
}

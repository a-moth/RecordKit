import SettingManager from "../managers/SettingManager";
import { useSettings } from "../../utils/SettingsProvider";
import { ScrollView } from "react-native";
import { useTheme } from "../../hooks/use-theme-provider";

// so far all settings are arrays of strings under a string


export default function SettingsReader() {
  const { settings } = useSettings();
  const theme = useTheme();

  return (
    <ScrollView contentContainerStyle={{ padding: 16, backgroundColor: theme.colors.background }}>
      {Object.keys(settings).map(key => (
        <SettingManager template={null} id={key} field={null} key={key} fieldKey={key} defaultShown={key.charAt(0) === "*"} />
      ))}
    </ScrollView>
  );
}

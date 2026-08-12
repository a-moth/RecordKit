import { ScrollView } from "react-native";
import { useSettings } from "../../utils/SettingsProvider";
import { useTheme } from "../../hooks/use-theme-provider";

import { v4 as uuidv4 } from "uuid";

import TemplateListReader from "../../components/readers/TemplateListReader";

import { router } from "expo-router";

export default function TemplatesScreen() {
    const { updateSetting } = useSettings();
    const theme = useTheme();

    function createNewTemplate() {
        let currentTemplateId = "template" + uuidv4();

        updateSetting({ "**currentTemplate": currentTemplateId });

        router.push({
            pathname: "/templates/edit",
            params: {
                templateId: currentTemplateId,
            },
        });
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <TemplateListReader onPress={() => createNewTemplate()} />
        </ScrollView>
    );
}
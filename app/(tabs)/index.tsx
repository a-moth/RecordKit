import { useMemo, useState } from "react";
import { ScrollView } from "react-native";
import EntryListReader from "../../components/readers/EntryListReader";
import SelectionInputField from "../../components/nodes/inputs/SelectionInputField";

import { v4 as uuidv4 } from "uuid";

import { useSettings } from "../../utils/SettingsProvider";

import { useRouter } from 'expo-router';
import { getTemplates } from "../../utils/StorageUtil";
import { defaultTemplate } from "../../hooks/node-registry";
import {
    data_container_types,
    DataContainer,
    FieldData,
    FieldNode,
    SelectionData,
    SelectionField,
} from "../../constants/DataTypes";
import { useTheme } from "../../hooks/use-theme-provider";

export default function HomeScreen() {
    const { updateSetting, loading } = useSettings();

    const router = useRouter();

    const theme = useTheme();

    const [showTemplatePicker, setShowTemplatePicker] = useState(false);
    const [templates, setTemplates] = useState<Record<string, DataContainer<data_container_types>> | null>(null);

    async function createNewEntry(templateId: string) {
        let currentId = "entry" + uuidv4();

        updateSetting({ "**currentEntry": currentId });

        router.push({
            pathname: "/entry",
            params: {
                entryId: currentId,
                templateId: templateId,
            },
        });
    }

    async function toggleTemplatePicker() {
        if (!showTemplatePicker) {
            setTemplates(await getTemplates());
        }

        setShowTemplatePicker((prev) => !prev);
    }

    const templatePickerField: FieldNode<SelectionData> = useMemo(() => ({
        id: "template-picker",
        type: "field",
        field: new SelectionField({
            type: "selection",
            label: "Choose a Template",
            multiple: false,
            selected: [],
            options: Object.values(templates ?? {}).map((template) => ({
                id: template.metadata.templateId,
                name: template.metadata.name || template.metadata.templateId,
            })),
            visible: true,
        }),
    }), [templates]);

    function onTemplateSelected(
        _template: DataContainer<data_container_types> | null,
        _defaultShown: boolean,
        newValue: FieldNode<FieldData>,
    ) {
        const selectedTemplateId = (newValue.field.data as SelectionData).selected[0];
        console.log(selectedTemplateId);
        if (selectedTemplateId) {
            setShowTemplatePicker(false);
            createNewEntry(selectedTemplateId);
        }
    }


    // greeting is automatic
    // new entry input button/selector
    // analytics preview - add later
    // TODO: analytics AFTER MVP
    // todo: set up loading analytics preview component

    if (loading) return null;

    return (
        <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <EntryListReader
                onPress={toggleTemplatePicker}
            >
                {showTemplatePicker && (
                    <SelectionInputField
                        id="template-picker"
                        style={{
                            ...theme.sizes.default.alignCenter,
                            ...theme.sizes.default.container,
                            ...theme.sizes.default.fillContainer,
                            backgroundColor: theme.colors.background,
                            borderColor: theme.colors.border,
                            color: theme.colors.text,
                            fontFamily: theme.fonts?.regular.fontFamily,
                        }}
                        textStyle={{
                            ...theme.sizes.default.text,
                            color: theme.colors.text,
                            fontFamily: theme.fonts?.regular.fontFamily,
                        }}
                        template={defaultTemplate}
                        fieldKey="Choose a Template"
                        field={templatePickerField}
                        defaultShown={true}
                        locked={false}
                        onChange={onTemplateSelected}
                    />
                )}
            </EntryListReader>
        </ScrollView>
    );
}
import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

import ThemedButton from "../common/ThemedButton";

import {
    getData,
    getTemplate,
    saveData,
} from "../../utils/StorageUtil";

import { defaultTemplate } from "../../hooks/NodeRegistry";
import {
    DataContainer,
    data_container_types,
    DataContainerFactory,
    FieldData,
    FieldNode,
} from "../../constants/DataTypes"

import { useTheme }
    from "../../hooks/use-theme-provider";
import { useFocusBorderColor } from "../../hooks/use-focus-border-color";
import { useRouter } from "expo-router";
import TemplateEditorManager from "../managers/TemplateEditorManager";


type Props = {
    templateId: string;
};

export default function TemplateWriter({
    templateId,
}: Props) {

    const [templateData, setTemplateData] =
        useState<DataContainer<data_container_types> | null>(null);

    const [saving, setSaving] =
        useState(false);

    const [nameText, setNameText] =
        useState("");

    const theme = useTheme();
    const focusBorder = useFocusBorderColor(theme.colors.border, theme.colors.caution);

    const router = useRouter();

    useEffect(() => {

        async function load() {

            let template =
                await getTemplate(
                    templateId
                );

            if (template == null) {
                const base = await getTemplate(
                    defaultTemplate.metadata.templateId
                );

                // clone so we don't mutate the stored default template,
                // then reassign it to this new template's own id
                template = base
                    ? DataContainerFactory.fromJSON(base.toJSON())
                    : null;

                if (template) {
                    template.metadata = {
                        ...template.metadata,
                        templateId: templateId,
                        name: "",
                    };
                }
            }

            setTemplateData(template);
            setNameText(template?.metadata.name || defaultTemplate.metadata.name);
        }

        load();

    }, [templateId]);

    const templateRef = useRef(templateData);

    useEffect(() => {
        templateRef.current = templateData;
    }, [templateData]);

    function updateName(newText: string) {
        // Only kept in local state until Save is pressed — mutating the
        // template object here would let an unsaved rename leak into
        // anything else still holding a reference to it (e.g. the list
        // preview), since DataContainer instances are mutated in place.
        setNameText(newText);
    }

    function updateField(template: DataContainer<data_container_types> | null, defaultShown: boolean, newValue: FieldNode<FieldData>) {
        setTemplateData((template) => {
            if (!template) return template;

            const updated = template.onHandleChange(template, defaultShown, newValue);

            return updated ?? template;
        });
    }

    async function handleSave() {
        if (!templateRef.current) return;

        templateRef.current.metadata = {
            ...templateRef.current.metadata,
            name: nameText,
        };

        setSaving(true);

        const appData = await getData();

        await saveData({
            ...appData,
            templates: {
                ...appData.templates,
                [templateId]: templateRef.current,
            },
        });

        setSaving(false);
        router.push("/templates");
    }

    if (!templateData) {
        return null;
    }

    return (
        <ScrollView
            contentContainerStyle={{
                ...theme.sizes.default.container,
                backgroundColor:
                    theme.colors.background,
            }}
        >

            <View style={theme.sizes.default.container}>
                <Text
                    style={[
                        theme.sizes.default.text,
                        {
                            color: theme.colors.text,
                            fontFamily: theme.fonts?.regular.fontFamily,
                        },
                    ]}
                >
                    Template Name
                </Text>

                <TextInput
                    value={nameText}
                    onChangeText={updateName}
                    onFocus={focusBorder.onFocus}
                    onBlur={focusBorder.onBlur}
                    style={[
                        theme.sizes.default.input,
                        {
                            backgroundColor: theme.colors.background,
                            borderColor: focusBorder.borderColor,
                            color: theme.colors.text,
                            fontFamily: theme.fonts?.regular.fontFamily,
                        },
                    ]}
                />
            </View>

            <TemplateEditorManager
                isList={false}
                template={templateData}
                locked={false}
                edit={true}
                onChange={
                    updateField
                }
                onTreeChange={
                    setTemplateData
                }
            />

            <View
                style={
                    theme.sizes.default.container
                }
            >
                <ThemedButton
                    title={
                        saving
                            ? "Saving..."
                            : "Save Template"
                    }
                    disabled={saving}
                    onPress={
                        handleSave
                    }
                />
            </View>

        </ScrollView>
    );
}
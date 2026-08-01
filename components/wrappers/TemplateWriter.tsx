import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    Button,
    ScrollView,
    View,
} from "react-native";

import {
    getData,
    getTemplate,
    saveData,
} from "../../utils/StorageUtil";

import { defaultTemplate } from "../../hooks/NodeRegistry";
import {
    DataContainer,
    data_container_types,
    FieldData,
    FieldNode,
} from "../../constants/DataTypes"

import { useTheme }
    from "../../hooks/use-theme-provider";
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

    const theme = useTheme();

    const router = useRouter();

    useEffect(() => {

        async function load() {

            let template =
                await getTemplate(
                    templateId
                );

            if (template == null) {
                template = {
                    ...defaultTemplate,
                    metadata: {
                        ...defaultTemplate.metadata,
                        templateId: templateId,
                    }
                }
            }

            setTemplateData(template);
        }

        load();

    }, [templateId]);

    const templateRef = useRef(templateData);

    useEffect(() => {
        templateRef.current = templateData;
    }, [templateData]);

    function updateField(template: DataContainer<data_container_types> | null, defaultShown: boolean, newValue: FieldNode<FieldData>) {
        setTemplateData((prev: DataContainer<data_container_types> | null) => {
            prev?.onHandleChange(prev, defaultShown, newValue);

            return prev;
        });
    }

    async function handleSave() {
        if (!templateRef.current) return;

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

            <TemplateEditorManager
                isList={false}
                template={templateRef.current}
                locked={false}
                edit={true}
                onChange={
                    updateField
                }
            />

            <View
                style={
                    theme.sizes.default.container
                }
            >
                <Button
                    title={
                        saving
                            ? "Saving..."
                            : "Save Template"
                    }
                    onPress={
                        handleSave
                    }
                />
            </View>

        </ScrollView>
    );
}
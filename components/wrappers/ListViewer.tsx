import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Button, View, Text, TextInput } from "react-native";
import { useTheme } from "../../hooks/use-theme-provider";
import { useSettings } from "../../utils/SettingsProvider";
import { deleteEntry, deleteTemplate, getData, getEntries, getTemplates, saveData, } from '../../utils/StorageUtil';
import { entry, template, DataContainer, data_container_types, FieldData, FieldNode } from '../../constants/DataTypes';
import valueOf from "../../utils/generic-calls";
import { useRouter } from "expo-router";
import { createId } from "../../utils/NodeUtils";
import TemplateEditorManager from "../managers/TemplateEditorManager";

type ListViewerProps = {
    type: string,
}; // TODO make listItems list of entries or templates

//TODO: test this entire setup after refactoring into generic type

export default function ListViewer({
    type,
}: ListViewerProps) {

    const theme = useTheme();
    const router = useRouter();
    const { settings } = useSettings();
    const [data, setData] = useState<Record<string, DataContainer<data_container_types>> | null>(null);
    const [_isLoading, setLoading] = useState(false);

    const [entryCountState] = useState(() =>
        valueOf(settings?.settings?.[`**listEntryCount` as keyof typeof settings.settings]) ?? Infinity
    );

    const [showCountState] = useState(() =>
        valueOf(settings?.settings?.[`**showCount` as keyof typeof settings.settings]) ?? 2
    );

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            try {
                const result = type == "entry" ? await getEntries() : await getTemplates();
                if (cancelled) return;
                setData(result);
            } catch (err) {
                console.error("Failed to load items:", err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, [type]);

    // TODO make this make sense
    const sortedTemplateData = useMemo(() => {
        if (!data) return [];

        //TODO entries and templates have the same properties. eventually combine them into one object
        return Object.values(data)
            .sort((a, b) => {
                const bTime = b?.metadata?.lastModified ?? 0;
                const aTime = a?.metadata?.lastModified ?? 0;
                return bTime - aTime;
            })

    }, [data]);

    // Compute counts
    let listCount: number;

    if (type === "entry") {
        listCount = entryCountState;
    } else {
        listCount = Infinity;
    }

    async function deleteId(id: string) {
        if (type === "entry") {
            await deleteEntry(id);
        } else {
            await deleteTemplate(id);
        }

        const fresh = await getData();
        setData(type === "entry" ? fresh.entries : fresh.templates);
    }

    function openEditor(id: string, template: string) {
        if (type == "entry") {
            router.push({
                pathname: "/entry",
                params: {
                    entryId: id,
                    templateId: template,
                },
            });
        } else {
            router.push({
                pathname: "/templates/edit",
                params: {
                    templateId: template ?? '9834fa2e-4392-407f-9672-95b82d2868a7',
                },
            });
        }
    }

    //TODO make this name make sense with a comment
    function TemplateRow({ item }: { item: DataContainer<data_container_types> }) {
        function onChange(template: DataContainer<data_container_types> | null, defaultShown: boolean, newValue: FieldNode<FieldData>) {
            if (!template) return;

            const updated = template.onHandleChange(template, defaultShown, newValue);
            if (!updated) return;

            setData(prev => prev && { ...prev, [updated.metadata.templateId]: updated });
        }

        return (
            <View style={[theme.sizes.default.row, theme.sizes.default.fillContainer, theme.sizes.default.alignCenter]}>
                <View style={theme.sizes.default.entryEditButton}>
                    <Button title="Edit" onPress={() => { openEditor(item.metadata.templateId, item.metadata.templateId) }} />
                    <Button title="Delete" onPress={() => { deleteId(item.metadata.templateId) }} />
                </View>

                <View style={[theme.sizes.default.entryViewer, theme.sizes.default.listMinItem, { backgroundColor: theme.colors.primary }]}>
                    {
                        <TemplateEditorManager key={createId()} template={item} locked={true} edit={false} isList={true} onChange={onChange} />
                    }
                </View>
            </View>
        );
    }

    //TODO make this make sense with a comment
    function EntryRow({ item }: { item: DataContainer<data_container_types> }) {
        function onChange(entry: DataContainer<data_container_types> | null, defaultShown: boolean, newValue: FieldNode<FieldData>) {
            if (!entry) return;

            const updated = entry.onHandleChange(entry, defaultShown, newValue);
            if (!updated) return;

            setData(prev => prev && { ...prev, [updated.metadata.name]: updated });
        }

        return (
            <View style={[theme.sizes.default.row, theme.sizes.default.fillContainer, theme.sizes.default.alignCenter]}>
                <View style={theme.sizes.default.entryEditButton}>
                    <Button title="Edit" onPress={() => { openEditor(item.metadata.name, item.metadata.templateId) }} />
                    <Button title="Delete" onPress={() => { deleteId(item.metadata.name) }} />
                </View>

                <View style={[theme.sizes.default.entryViewer, theme.sizes.default.listMinItem, { backgroundColor: theme.colors.primary }]}>
                    <TemplateEditorManager template={item} locked={true} edit={false} isList={true} onChange={onChange} />
                </View>
            </View>
        );
    }
    // check if listItems is empty, return default script if it is

    if ((!sortedTemplateData || sortedTemplateData.length === 0) && type == "entry") {
        return (
            <View style={[theme.sizes.default.row, theme.sizes.default.fillContainer, theme.sizes.default.alignCenter]} key={"entry-holder"}>
                <Text style={[theme.sizes.default.text, { color: theme.colors.text }]}>
                    No entries found.
                </Text>
            </View>
        );
    }

    if ((!sortedTemplateData || sortedTemplateData.length === 0) && type == "template") {
        return (
            <View style={[theme.sizes.default.row, theme.sizes.default.fillContainer, theme.sizes.default.alignCenter]} key={"template-holder"}>
                <Text style={[theme.sizes.default.text, { color: theme.colors.text }]}>
                    No Templates Found, create a new one?
                </Text>
            </View>
        );
    }

    return (
        <View style={[theme.sizes.default.row, theme.sizes.default.fillContainer, theme.sizes.default.alignCenter]} key={"template-holder"}>
            {sortedTemplateData.slice(0, listCount).map((value) => {
                if (!value?.metadata) return null;
                if (type === "entry") {
                    return (
                        <EntryRow
                            key={value.metadata.name}
                            item={value as DataContainer<entry>}
                        />
                    );
                } else {
                    return (
                        <Fragment key={value.metadata.templateId}>
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
                                    value={value.metadata.name}
                                    style={[
                                        theme.sizes.default.input,
                                        {
                                            backgroundColor: theme.colors.card,
                                            borderColor: theme.colors.border,
                                            color: theme.colors.text,
                                            fontFamily: theme.fonts?.regular.fontFamily,
                                        },
                                    ]}
                                />
                            </View>
                            <TemplateRow
                                item={value as DataContainer<template>}
                            />
                            <View style={{ height: theme.sizes.default.container.height }} />
                        </Fragment>
                    );
                }
            })}
        </View>
    );
} // TODO count in map pulled only if type is entry else infinity
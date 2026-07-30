import { useEffect, useMemo, useRef, useState } from "react";
import { Button, View, Text } from "react-native";
import { useTheme } from "../../hooks/use-theme-provider";
import { useSettings } from "../../utils/SettingsProvider";
import { deleteEntry, deleteTemplate, getData, getEntries, getTemplates, saveData, } from '../../utils/StorageUtil';
import { entry, template, DataContainer, data_container_types, FieldData, SectionData, TextData, SelectionData, FieldNode } from '../../constants/DataTypes';
import valueOf from "../../utils/generic-calls";
import { useRouter } from "expo-router";
import { createId } from "../../utils/NodeUtils";
import TemplateEditorManager from "../managers/TemplateEditorManager";

type ListViewerProps = {
    type: string,
}; // TODO make listItems list of entries or templates

//TODO: test this entire setup after refactoring into generic type

// TODO: test this function, make it make sense
function useDebounceCallback<T extends (...args: any[]) => void>(callback: T, delay: number) {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    return useMemo(() => {
        return (...args: Parameters<T>) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                callbackRef.current(...args);
            }, delay);
        };
    }, [delay]);
}

export default function ListViewer({
    type,
}: ListViewerProps) {

    const theme = useTheme();
    const router = useRouter();
    const { settings } = useSettings();
    let data: template | entry;
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
                if (type == "entry") {
                    data = await getEntries();
                } else {
                    data = await getTemplates();
                }
                if (cancelled) return;
            } catch (err) {
                console.error("Failed to load items:", err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, []);

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

    let count = showCountState;

    // TODO this code does nothing now. fix.
    async function renameTemplateTextOnly(id: string, name: string) {
        if (!data) return;

        // Keep the old lastModified so the list row order stays pinned while typing
        const updatedData: Templates = {
            ...data,
            [id]: {
                ...data[id],
                metadata: {
                    ...data[id].metadata,
                    name: name,
                },
            },
        };

        setData(updatedData);
    }

    //TODO this borrowed code does nothing now. fix
    const triggerSortUpdate = useDebounceCallback(async (id: string) => {
        setData(prev => {
            if (!prev || !prev[id]) return prev;
            return {
                ...prev,
                [id]: {
                    ...prev[id],
                    metadata: {
                        ...prev[id].metadata,
                        lastModified: Date.now()
                    }
                }
            };
        });

        // Persist the updated timestamp structure
        try {
            const appData = await getData();
            if (type == "entry") {
                if (appData.entries && appData.entries[id]) {
                    appData.entries[id].metadata.lastModified = Date.now();
                    setData(appData.entries);
                }
            } else {
                if (appData.templates && appData.templates[id]) {
                    appData.templates[id].metadata.lastModified = Date.now();
                    setData(appData.templates);
                }
            }
        } catch (err) {
            console.error("Failed to save item sort timestamp:", err);
        }
    }, 1200);

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
    function TemplateRow({ item }: { item: Template }) {
        function onChange(template: Template | null, defaultShown: boolean, newValue: FieldNode) {
            onHandleChange(template, defaultShown, newValue);
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
    function EntryRow({ item }: { item: Entry }) {
        function onChange(template: Template | null, defaultShown: boolean, newValue: FieldNode) {
            onHandleChange(template, defaultShown, newValue);
        }

        return (
            <View style={[theme.sizes.default.row, theme.sizes.default.fillContainer, theme.sizes.default.alignCenter]}>
                <View style={theme.sizes.default.entryEditButton}>
                    <Button title="Edit" onPress={() => { openEditor(item.metadata.entryId, item.metadata.templateId) }} />
                    <Button title="Delete" onPress={() => { deleteId(item.metadata.entryId) }} />
                </View>

                <View style={[theme.sizes.default.entryViewer, theme.sizes.default.listMinItem, { backgroundColor: theme.colors.primary }]}>
                    <TemplateEditorManager template={item} locked={true} edit={false} isList={true} onChange={onChange} />
                </View>
            </View>
        );
    }
    // check if listItems is empty, return default script if it is

    if ((!sortedTemplateData || sortedTemplateData.length) === 0 && type == "entry") {
        return (
            <View style={[theme.sizes.default.row, theme.sizes.default.fillContainer, theme.sizes.default.alignCenter]}>
                <Text style={[theme.sizes.default.text, { color: theme.colors.text }]}>
                    No entries found.
                </Text>
            </View>
        );
    }

    if ((!sortedTemplateData || sortedTemplateData.length) === 0 && type == "template") {
        return (
            <View style={[theme.sizes.default.row, theme.sizes.default.fillContainer, theme.sizes.default.alignCenter]}>
                <Text style={[theme.sizes.default.text, { color: theme.colors.text }]}>
                    No Templates Found, create a new one?
                </Text>
            </View>
        );
    }

    return (
        <View style={[theme.sizes.default.row, theme.sizes.default.fillContainer, theme.sizes.default.alignCenter]}>
            {sortedTemplateData.slice(0, listCount).map((value) => {
                if (!value?.metadata) return null;
                if (type === "entry") {
                    return (
                        <EntryRow
                            key={(value as Entry).metadata.name}
                            item={value as Entry}
                        />
                    );
                } else {
                    return (
                        <TemplateRow
                            key={(value as Template).metadata.templateId}
                            item={value as Template}
                        />
                    );
                }
            })}
        </View>
    );
} // TODO count in map pulled only if type is entry else infinity
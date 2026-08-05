import {
  useEffect,
  useState,
} from "react";

import {
  Button,
  ScrollView,
  View,
} from "react-native";

import {
  getData,
  getEntry,
  getTemplate,
  saveData,
} from "../../utils/StorageUtil";

import {
  FieldNode,
  FieldData,
  DataContainer,
  data_container_types,
  entry,
  EntryContainer,
} from "../../constants/DataTypes"

import { useTheme }
  from "../../hooks/use-theme-provider";

import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "expo-router";
import TemplateEditorManager from "../managers/TemplateEditorManager";
import { defaultTemplate } from "../../hooks/NodeRegistry";

type Props = {
  base?: string;
  template: string;
};

export default function EntryWriter({
  base,
  template,
}: Props) {

  const [entryData, setEntryData] =
    useState<DataContainer<data_container_types> | null>(null);

  const [saving, setSaving] =
    useState(false);

  const theme = useTheme();
  const router = useRouter();

  useEffect(() => {

    async function load() {

      const entry =
        base
          ? await getEntry(base)
          : null;

      if (entry) {

        setEntryData(entry);

        return;
      }

      const templateData =
        await getTemplate(
          template
        );

      setEntryData(new EntryContainer({
        ...templateData ?? defaultTemplate,
        metadata: {
          ...templateData?.metadata ?? defaultTemplate.metadata,
          templateId: templateData?.metadata?.templateId ?? defaultTemplate.metadata.templateId,
          name: base ?? "entry" + uuidv4(),
          type: "entry",
          lastModified: Date.now(),
          createdAt: Date.now(),
          order: templateData?.metadata?.order ?? defaultTemplate.metadata.order
        },

        fields: templateData?.fields ?? defaultTemplate.fields,
      }));
    }

    load();

  }, [base, template]);

  function updateField(
    template: DataContainer<data_container_types> | null,
    defaultShown: boolean,
    newValue: FieldNode<FieldData>
  ) {
    if (!template) return;

    const updated = template.onHandleChange(
      template,
      defaultShown,
      newValue
    );

    if (updated) {
      setEntryData(updated);
    }
  }

  async function handleSave() {

    if (!entryData) {
      return;
    }

    setSaving(true);

    const appData =
      await getData();

    await saveData({
      ...appData,

      entries: {
        ...appData.entries,

        [entryData.getData().metadata.name]: entryData,
      },
    });

    setSaving(false);

    router.push("/");
  }

  if (!entryData) {
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
        template={entryData}
        locked={false}
        edit={false}
        onChange={
          updateField
        }
        onTreeChange={
          setEntryData
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
              : "Save Entry"
          }
          onPress={
            handleSave
          }
        />
      </View>

    </ScrollView>
  );
}
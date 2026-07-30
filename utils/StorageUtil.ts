import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  defaultTemplate,
  DataContainer,
  data_container_types,
} from '../constants/DataTypes';

export async function saveData(data: any) {
  await AsyncStorage.setItem('appData', JSON.stringify(data));
}

export async function getData() {
  const raw = await AsyncStorage.getItem('appData');
  const parsed = raw ? JSON.parse(raw) : null;

  if (!parsed) {
    return {
      templates: {
        [defaultTemplate.metadata.templateId]: defaultTemplate,
      },
      entries: {},
    };
  }

  return parsed;
}

export async function getEntry(entryId: string) {
  const data = await getData();
  if (!entryId) return null;
  return data.entries[entryId];
}

export async function getEntries() {
  const data = await getData();
  return data.entries;
}

export async function deleteEntry(entryId: string) {
  if (!entryId) return;

  const data = await getData();

  delete data.entries[entryId];

  await saveData(data);
}

export async function editTemplate(
  template: DataContainer<data_container_types>,
) {
  const data = await getData();

  const templateId = template.metadata.templateId;

  if (templateId === defaultTemplate.metadata.templateId) {
    return;
  }

  data.templates[templateId] = template;

  await saveData(data);
}

export async function deleteTemplate(templateId: string) {
  if (!templateId) return;

  if (templateId === defaultTemplate.metadata.templateId) return;

  let value = await getData();

  delete value.templates[templateId];

  await saveData(value);
}

export async function getTemplates() {
  return (await getData()).templates;
}

export async function getTemplate(templateId: string) {
  const data = await getData();

  const template = data.templates?.[templateId];

  if (!template) return null;

  return template;
}

// TODO: handle saving images to cache to load as images into code
// Leftover from file-based saving
// async function save(filename: string, content: string) {
//   try {
//     const file = new File(Paths.cache, filename);
//     file.write(JSON.stringify(content));
//     console.log(file.textSync());
//   } catch (error) {
//     console.error(error);
//   }
// }

// async function load(filename: string): Promise<any> {
//   try {
//     const file = new File(Paths.cache, filename);
//     return JSON.parse(await file.text());
//   } catch (error) {
//     console.error(error);
//   }
// }

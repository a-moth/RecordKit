import AsyncStorage from '@react-native-async-storage/async-storage';
import { DataContainer, data_container_types } from '../constants/DataTypes';
import { defaultTemplate } from '../hooks/node-registry';
import { DataContainerFactory } from '../constants/DataTypes';

type AppData = {
  templates: Record<string, DataContainer<data_container_types>>;
  entries: Record<string, DataContainer<data_container_types>>;
};

export async function saveData(data: AppData) {
  // process to save data AS JSON
  let templates: Record<string, string> = {};
  let entries: Record<string, string> = {};

  for (const template in data.templates) {
    let value = data.templates[template].toJSON();
    if (value != '') {
      templates[data.templates[template].metadata.templateId] = value;
    }
  }

  for (const entry in data.entries) {
    let value = data.entries[entry].toJSON();
    if (value != '') {
      entries[data.entries[entry].metadata.name] = value;
    }
  }

  await AsyncStorage.setItem(
    'appData',
    JSON.stringify({
      templates: templates,
      entries: entries,
    }),
  );
}

export async function getData(): Promise<AppData> {
  // if raw exists, construct it into the correct record
  const raw = await AsyncStorage.getItem('appData');

  if (raw) {
    let data = JSON.parse(raw);

    if (!data) {
      return {
        templates: {
          [defaultTemplate.metadata.templateId]: defaultTemplate,
        },
        entries: {},
      };
    }

    if (!data.templates || !data.entries) {
      return {
        templates: {
          [defaultTemplate.metadata.templateId]: defaultTemplate,
        },
        entries: {},
      };
    }
    let templates: Record<string, DataContainer<data_container_types>> = {};
    let entries: Record<string, DataContainer<data_container_types>> = {};

    for (const template in data.templates) {
      let templateList = DataContainerFactory.fromJSON(
        data.templates[template],
      );
      if (templateList) {
        templates[templateList.metadata.templateId] = templateList;
      }
    }

    if (Object.keys(templates).length === 0) {
      templates = {
        [defaultTemplate.metadata.templateId]: defaultTemplate,
      };
    }

    for (const entry in data.entries) {
      let entryList = DataContainerFactory.fromJSON(data.entries[entry]);
      if (entryList) {
        entries[entryList.metadata.name] = entryList;
      }
    }
    return {
      templates: templates,
      entries: entries,
    } as AppData;
  }

  return {
    templates: {
      [defaultTemplate.metadata.templateId]: defaultTemplate,
    },
    entries: {},
  };
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

  const template = data['templates'][templateId];

  if (!template) return null;

  return template;
}

// TODO: handle saving images to cache to load as images into code
// TODO: store image paths within the app itself
// TODO: store images as data to storage if <5MB
// TODO: store image paths if >5MB and warn user with notification on load
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

import { createId } from "../utils/NodeUtils";
import { DataContainer, DateField, DurationField, field_data, FieldData, FieldNode, NumberField, ScaleField, SectionField, SelectionField, template, TemplateContainer, TextField, TimeField, ToggleButtonField, ToggleImageButtonField } from "../constants/DataTypes";
import BooleanImageInputField from '../components/nodes/inputs/BooleanImageInputField';
import BooleanInputField from '../components/nodes/inputs/BooleanInputField';
import DateInputField from '../components/nodes/inputs/DateInputField';
import DurationInputField from '../components/nodes/inputs/DurationInputField';
import NumberInputField from '../components/nodes/inputs/NumberInputField';
import ScaleInputField from '../components/nodes/inputs/ScaleInputField';
import SelectionInputField from '../components/nodes/inputs/SelectionInputField';
import TextInputField from '../components/nodes/inputs/TextInputField';
import TimeInputField from '../components/nodes/inputs/TimeInputField';
import SectionComponent from "../components/common/Component";
import SettingInputField from "../components/nodes/inputs/SettingInputField";
import SettingSelectionField from "../components/nodes/inputs/SettingSelectionField";
import FileInputField from "../components/nodes/inputs/FileInputField";
import SettingTimeInputField from "../components/nodes/inputs/SettingTimeInputField";

// the default values for defaultTemplate

type FieldDefinition<T extends FieldData = FieldData> = {
  create: () => field_data<T>;
  component: React.ComponentType<any>;
};

/**
 * Registry of field-type id -> factory producing a fresh default field_data
 * instance of that type. Used by "Add Field" to build a new node once a type
 * is picked from the `selectionField` picker below.
 */
export const fieldDefinitions: Record<string, FieldDefinition> = {
  text: {
    create: () => new TextField({
      type: "text",
      label: "Text Field",
      value: "",
      visible: true,
    }),
    component: TextInputField,
  },

  number: {
    create: () => new NumberField({
      type: "number",
      label: "Number Field",
      value: 0,
      visible: true,
    }),
    component: NumberInputField,
  },

  time: {
    create: () => new TimeField({
      type: "time",
      label: "Time Field",
      value: "",
      visible: true,
    }),
    component: TimeInputField,
  },

  date: {
    create: () => new DateField({
      type: "date",
      label: "Date Field",
      value: "",
      visible: true,
    }),
    component: DateInputField,
  },

  duration: {
    create: () => new DurationField({
      type: "duration",
      label: "Duration Field",
      valueA: 0,
      valueB: 0,
      unitA: "hrs",
      unitB: "mins",
      visible: true,
    }),
    component: DurationInputField,
  },

  selection: {
    create: () => new SelectionField({
      type: "selection",
      label: "Selection Field",
      multiple: false,
      selected: [],
      options: [],
      visible: true,
    }),
    component: SelectionInputField,
  },

  multiselection: {
    create: () => new SelectionField({
      type: "selection",
      label: "Selection Field",
      multiple: true,
      selected: [],
      options: [],
      visible: true,
    }),
    component: SelectionInputField
  },

  scale: {
    create: () => new ScaleField({
      type: "scale",
      label: "Scale Field",
      imageBased: false,
      min: 0,
      max: 5,
      value: 0,
      images: [],
      visible: true,
    }),
    component: ScaleInputField,
  },

  boolean: {
    create: () => new ToggleButtonField({
      type: "boolean",
      label: "Boolean Field",
      labelSelected: "On",
      labelUnselected: "Off",
      value: false,
      visible: true,
    }),
    component: BooleanInputField,
  },

  "image-boolean": {
    create: () => new ToggleImageButtonField({
      type: "image-boolean",
      label: "Image Boolean Field",
      value: false,
      imageSelected: "",
      imageUnselected: "",
      visible: true,
    }),
    component: BooleanImageInputField,
  },

  section: {
    create: () => new SectionField({
      type: "section",
      label: "Section Field",
      orientation: "row",
      id: createId(),
      childNodes: {},
      visible: true,
    }),
    component: SectionComponent,
  },
};

export const settingDefinitions = {
  text: SettingInputField,
  time: SettingTimeInputField,
  number: NumberInputField,
  selection: SettingSelectionField,
  image: FileInputField,
};

/**
 * Public constant containing the initialisation of the core Journal Template
 */
export let defaultTemplate: DataContainer<template> = new TemplateContainer({
  metadata: {
    templateId: '9834fa2e-4392-407f-9672-95b82d2868a7',
    name: 'defaultTemplate',
    type: "template",
    lastModified: 0,
    usedTime: 0,
    order: [],
  },

  fields: {
    'text-input-1': {
      id: 'text-input-1',
      type: "field",
      field: new TextField({
        type: "text",
        label: 'Text Input 1',
        value: "",
        visible: true,
      }),
    },
    'duration-input-1': {
      id: 'duration-input-1',
      type: "field",
      field: new DurationField({
        type: "duration",
        label: 'Duration Input 1',
        valueA: 0,
        valueB: 0,
        unitA: 'hrs',
        unitB: 'mins',
        visible: true,
      }),
    },
    'scale-input-1': {
      id: 'scale-input-1',
      type: "field",
      field: new ScaleField({
        type: "scale",
        label: 'Scale Input 1',
        imageBased: true,
        min: 0,
        max: 5,
        value: 0,
        images: [],
        visible: true,
      }),
    },
    'selection-input-1': {
      id: 'selection-input-1',
      type: "field",
      field: new SelectionField({
        type: "selection",
        label: 'Selection Input 1',
        multiple: false,
        selected: [],
        options: [
          { id: '1', name: '1st' },
          { id: '2', name: '2nd' },
          { id: '3', name: '3rd' },
        ],
        visible: true,
      }),
    },
    'selection-input-2': {
      id: 'selection-input-2',
      type: "field",
      field: new SelectionField({
        type: "selection",
        label: 'Selection Input 2',
        multiple: false,
        selected: [],
        options: [
          { name: '1st', id: '1' },
          { name: '2nd', id: '2' },
          { name: '3rd', id: '3' },
          { name: '4th', id: '4' },
          { name: '5th', id: '5' },
          { name: '6th', id: '6' },
        ],
        visible: true,
      }),
    },
    'selection-input-3': {
      id: 'selection-input-3',
      type: "field",
      field: new SelectionField({
        type: "selection",
        label: 'Selection Input 3',
        multiple: true,
        selected: [],
        options: [
          { id: '1', name: '1st' },
          { id: '2', name: '2nd' },
          { id: '3', name: '3rd' },
        ],
        visible: true,
      }),
    },
    'selection-input-4': {
      id: 'selection-input-4',
      type: "field",
      field: new SelectionField({
        type: "selection",
        label: 'Selection Input 4',
        multiple: true,
        selected: [],
        options: [
          { name: '1st', id: '1' },
          { name: '2nd', id: '2' },
          { name: '3rd', id: '3' },
          { name: '4th', id: '4' },
          { name: '5th', id: '5' },
          { name: '6th', id: '6' },
        ],
        visible: true,
      }),
    },
    'date-input-1': {
      id: 'date-input-1',
      type: "field",
      field: new DateField({
        type: "date",
        label: 'Date Input 1',
        value: "",
        visible: true,
      }),
    },
    'boolean-input-1': {
      id: 'boolean-input-1',
      type: "field",
      field: new ToggleButtonField({
        type: "boolean",
        label: 'Boolean Input 1',
        labelSelected: 'On',
        labelUnselected: 'Off',
        value: false,
        visible: true,
      }),
    },
    'section-input-1': {
      id: 'section-input-1',
      type: "field",
      field: new SectionField({
        type: "section",
        label: 'Section Input 1',
        orientation: "row",
        id: 'section-input-1',
        visible: true,
        childNodes: {
          'image-button-1': {
            id: 'image-button-1',
            type: "field",
            field: new ToggleImageButtonField({
              type: "image-boolean",
              label: 'Image Button 1',
              value: false,
              imageSelected: "",
              imageUnselected: "",
              visible: true,
            }),
          },
        },
      }),
    },
  },
});

export const addFieldSelector: SelectionField = new SelectionField({
  type: 'selection',
  label: 'Add Field',
  multiple: false,
  selected: [], // nothing picked until the user chooses a type
  options: [
    { id: 'text', name: 'Text' },
    { id: 'number', name: 'Number' },
    { id: 'time', name: 'Time' },
    { id: 'date', name: 'Date' },
    { id: 'duration', name: 'Duration' },
    { id: 'selection', name: 'Single Selection' },
    { id: 'multiselection', name: 'Multiple Selection' },
    { id: 'scale', name: 'Scale' },
    { id: 'boolean', name: 'Boolean' },
    { id: 'image-boolean', name: 'Image Boolean' },
  ],
  visible: true,
});

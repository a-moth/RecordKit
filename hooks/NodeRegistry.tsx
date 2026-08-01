/**
 * a registry of default node data for adding
const nodeRegistry = {
  text: TextInputField,
  boolean: BooleanInputField,
  number: NumberInputField,
};
 */

import { DataContainer, DateField, DurationField, FieldData, FieldNode, ScaleField, SectionField, SelectionField, template, TemplateContainer, TextData, TextField, ToggleButtonField, ToggleImageButtonField } from "../constants/DataTypes";

// the default values for defaultTemplate

// the default values for every node and input
const fieldDefinitions: Record<string, FieldNode<FieldData>> = {

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
    TextInput1: {
      id: 'text-input-1',
      type: "field",
      field: new TextField({
        type: "text",
        label: 'Text Input 1',
        value: "",
        visible: true,
      }),
    },
    DurationInput1: {
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
    ScaleInput1: {
      id: 'scale-input-1',
      type: "field",
      field: new ScaleField({
        type: "scale",
        label: 'Scale Input 1',
        imageBased: true,
        min: 0,
        max: 5,
        value: 0,
        visible: true,
      }),
    },
    SelectionInput1: {
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
    SelectionInput2: {
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
    SelectionInput3: {
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
    SelectionInput4: {
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
    DateInput1: {
      id: 'date-input-1',
      type: "field",
      field: new DateField({
        type: "date",
        label: 'Date Input 1',
        value: "",
        visible: true,
      }),
    },
    BooleanInput1: {
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
    SectionInput1: {
      id: 'section-input-1',
      type: "field",
      field: new SectionField({
        type: "section",
        label: 'Section Input 1',
        orientation: "row",
        id: 'section-input-1',
        visible: true,
        childNodes: {
          ImageButton1: {
            id: 'image-button-1',
            type: "field",
            field: new ToggleImageButtonField({
              type: "image-boolean",
              label: 'Image Button 1',
              value: false,
              imageSelected: require('../assets/images/4.png'),
              imageUnselected: require('../assets/images/5.png'),
              visible: true,
            }),
          },
        },
      }),
    },
  },
});

export const selectionField: SelectionField = new SelectionField({
  type: 'selection',
  label: 'Add Field',
  multiple: false,
  selected: [
    'text',
    'number',
    'time',
    'date',
    'duration',
    'selection',
    'scale',
    'boolean',
    'image-boolean',
  ], // the actual value
  options: [], // the choices
  visible: true,
});

import { Image } from 'react-native';
import { field_node, TextField } from '../constants/DataTypes';

/**
 * Default Template Definitions
 * [private to this types config]
 */

const TextInput1: TextField = new TextField({
  type: 'text',
  value: 'something has gone wrong',
  label: 'Text Input 1',
  visible: true,
});

// TODO: convert to instances
const DurationInput1: DurationField = {
  type: 'duration',
  label: 'Duration Input 1',
  valueA: 0,
  valueB: 5,
  unitA: 'hrs',
  unitB: 'mins',
  visible: true,
};

const ScaleInput1: ScaleField = {
  type: 'scale',
  value: 0,
  label: 'Scale Input 1',
  imageBased: true,
  min: 0,
  max: 5,
  visible: true,
};

const SelectionInput1: SelectionField = {
  type: 'selection',
  label: 'Selection Input 1',
  multiple: false,
  selected: [],
  options: [
    { id: '1', name: '1st' },
    { id: '2', name: '2nd' },
    { id: '3', name: '3rd' },
  ],
  visible: true,
};

const SelectionInput2: SelectionField = {
  type: 'selection',
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
};

const SelectionInput3: SelectionField = {
  type: 'selection',
  label: 'Selection Input 3',
  multiple: true,
  selected: [],
  options: [
    { id: '1', name: '1st' },
    { id: '2', name: '2nd' },
    { id: '3', name: '3rd' },
  ],
  visible: true,
};

const SelectionInput4: SelectionField = {
  type: 'selection',
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
};

const DateInput1: DateField = {
  type: 'date',
  value: '01-05-2001',
  label: 'Date Input 1',
  format: 'dd-MM-YYYY',
  visible: true,
};

const BooleanInput1: ToggleButtonField = {
  type: 'boolean',
  value: false,
  label: 'Boolean Input 1',
  labelSelected: 'testy tested',
  labelUnselected: 'testy testing',
  visible: true,
};

const TestText1: TextField = {
  type: 'text',
  value: 'testing :3',
  label: "I'm a test text node!",
  visible: true,
};

/**
 * Creates a new UUID for any object
 * @returns New UUID for anything
 */
function createId() {
  return crypto.randomUUID();
}

/**
 * Public helper function to convert FieldValues to FieldNodes
 * @param field the field value to convert to a node
 * @returns the field node of the field value
 */
function createFieldNode(field: FieldValue): FieldNode {
  return {
    id: createId(),
    type: 'field',
    field,
  };
}

function createSectionNode(
  title: string,
  orientation: string,
  children?: Record<string, Node>,
) {
  return {
    id: createId(),
    type: 'section',
    title,
    orientation,
    childNodes: children || {},
  } as SectionNode;
}

const Section1: SectionNode = createSectionNode('Testing Section', 'row', {
  TestText1: createFieldNode(TestText1),
});

// default SelectionField

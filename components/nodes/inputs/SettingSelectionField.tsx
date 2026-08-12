import { DataContainer, data_container_types, FieldData, FieldNode, SelectionData, SelectionField } from '../../../constants/DataTypes';
import { useSettings } from '../../../utils/SettingsProvider';
import { SETTING_OPTIONS } from '../../../constants/setting-enums';
import { CommonProps } from '../../managers/SettingManager';
import SelectionInputField from './SelectionInputField';

export default function SettingSelectionField({ fieldKey, defaultShown }: CommonProps) {
  const { settings, updateSetting } = useSettings();
  if (!defaultShown) return null;

  const options = SETTING_OPTIONS[fieldKey] ?? [];
  const currentValue = settings[fieldKey];
  const selected = options.some(option => option.id === currentValue) ? [currentValue] : [];

  const selectionField: FieldNode<SelectionData> = {
    id: `setting-${fieldKey}`,
    type: 'field',
    field: new SelectionField({
      type: 'selection',
      label: fieldKey,
      multiple: false,
      selected,
      options,
      visible: true,
    }),
  };

  function handleChange(
    _template: DataContainer<data_container_types>,
    _defaultShown: boolean,
    newValue: FieldNode<FieldData>,
  ) {
    if (newValue.field.data.type !== 'selection') return;

    const chosen = newValue.field.data.selected[0];
    if (chosen) updateSetting({ [fieldKey]: chosen });
  }

  return (
    <SelectionInputField
      template={null as unknown as DataContainer<data_container_types>}
      id={selectionField.id}
      fieldKey={fieldKey}
      field={selectionField}
      defaultShown={defaultShown}
      locked={false}
      onChange={handleChange}
    />
  );
}

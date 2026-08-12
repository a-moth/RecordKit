// Works as intended for now... Main body is copy pasted from
// https://www.npmjs.com/package/react-native-multiple-select

import { Component } from "react";
import { TextStyle, View, Text } from 'react-native';
import MultiSelect from "react-native-multiple-select";
import { FieldNode, DataContainer, data_container_types, SelectionData, field_node, field_data } from "../../../constants/DataTypes";

export interface Item {
  id: string;
  name: string;
}

interface Props {
  style?: TextStyle;
  textStyle?: TextStyle;
  template: DataContainer<data_container_types>;
  id: string;
  field: FieldNode<SelectionData>;
  locked: boolean;

  onChange?: (
    template: DataContainer<data_container_types>,
    defaultShown: boolean,
    newValue: FieldNode<SelectionData>
  ) => void;

  fieldKey: SelectionData["label"];
  defaultShown: boolean;
  submitButtonColor?: string;
}

export default class SelectionInput extends Component<Props> {
  multiSelect: any = null;

  private lastSentSelected: string[] = [];

  onSelectedItemsChange = (newItemsList: string[]) => {
    if (!this.props.onChange) return;

    const same =
      newItemsList.length === this.lastSentSelected.length &&
      newItemsList.every((v, i) => v === this.lastSentSelected[i]);

    if (same) return;

    this.lastSentSelected = [...newItemsList];

    const newField = this.props.field.field.clone();
    newField.setData(newItemsList);

    this.props.onChange(this.props.template, this.props.defaultShown, {
      id: this.props.field.id,
      type: "field",
      field: newField,
    });
  };

  render() {
    let baseStyle = {
      ...(this.props.style?.backgroundColor ? { backgroundColor: this.props.style.backgroundColor } : undefined),
      ...(this.props.textStyle?.color ? { color: this.props.textStyle.color } : {}),
      ...(this.props.style?.borderColor ? { borderColor: this.props.style.borderColor } : undefined),
    }

    const containerStyle = {
      backgroundColor: this.props.style?.backgroundColor,
      borderColor: this.props.style?.borderColor,
      color: this.props.textStyle?.color,
    };

    const textStyle = {
      color: this.props.textStyle?.color,
      fontFamily: this.props.textStyle?.fontFamily,
    };

    const isLocked = this.props.locked;

    return (
      <View style={baseStyle}>
        <MultiSelect
          hideTags
          items={this.props.field.field.data.options}
          uniqueKey="id"
          ref={(component) => {
            this.multiSelect = component;
          }}
          single={!this.props.field.field.data.multiple}
          onSelectedItemsChange={(items: string[]) => {
            if (isLocked) return;
            this.onSelectedItemsChange(items);
          }}
          selectedItems={this.props.field.field.data.selected}
          selectText={isLocked ? "Pick items disabled" : "Pick items"}
          searchInputPlaceholderText="Search Items..."
          displayKey="name"
          submitButtonText="Submit"
          tagRemoveIconColor={baseStyle.backgroundColor ? baseStyle.backgroundColor.toString() : "#CCC"}
          tagBorderColor={baseStyle.borderColor ? baseStyle.borderColor.toString() : "#CCC"}
          tagTextColor={baseStyle.color ? baseStyle.color.toString() : "#CCC"}
          selectedItemTextColor={baseStyle.color ? baseStyle.color.toString() : "#CCC"}
          selectedItemIconColor={baseStyle.backgroundColor ? baseStyle.backgroundColor.toString() : "#CCC"}
          itemTextColor={baseStyle.color ? baseStyle.color.toString() : "#000"}
          submitButtonColor={this.props.submitButtonColor ?? (baseStyle.backgroundColor ? baseStyle.backgroundColor.toString() : "#CCC")}
          styleDropdownMenuSubsection={containerStyle}
          styleDropdownMenu={containerStyle}
          styleInputGroup={containerStyle}
          styleItemsContainer={containerStyle}
          styleSelectorContainer={containerStyle}
          styleListContainer={containerStyle}
          styleTextDropdown={textStyle}
          styleTextDropdownSelected={textStyle}
          searchInputStyle={textStyle}
        >
        </MultiSelect>
        <View style={baseStyle}>
          {this.props.field.field.data.options
            .filter(item => this.props.field.field.data.selected.includes(item.id))
            .map(item => (
              <Text key={item.id} style={textStyle}>
                {item.name}
              </Text>
            ))}
        </View>
      </View>
    );
  }
}

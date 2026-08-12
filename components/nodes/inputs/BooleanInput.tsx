// touchable opacity component for boolean input data
/**
 * TODO: test component and ensure it works, presents, and is functional in the intended way
 */

import {
  Text,
  TouchableOpacity,
} from "react-native";

import { useTheme } from "../../../hooks/use-theme-provider";

type BooleanInputProps = {
  selected: boolean;
  label: string;
  value: boolean;
  locked?: boolean;
  onChange?: (
    selected: boolean,
    value: boolean
  ) => void;
};

export default function BooleanInput({
  selected,
  label,
  value,
  locked = false,
  onChange,
}: BooleanInputProps) {
  const theme = useTheme();

  function toggleSelection() {
    if (locked) return;

    onChange?.(!selected, value);
  }

  const backgroundColor = selected
    ? theme.colors.primary
    : theme.colors.card;

  const borderColor = selected
    ? theme.colors.primary
    : theme.colors.border;

  if (locked) {
    return (
      <Text style={theme.sizes.default.textCenter}>
        {value}
      </Text>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={toggleSelection}
      style={[
        theme.sizes.default.button,
        {
          alignSelf: "flex-start",
          backgroundColor,
          borderColor,
        },
      ]}
    >
      <Text style={theme.sizes.default.textCenter}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
/**°
 * TODO: load loaded images in from files somehow
 * TODO: load images async with alt text until they load
 */

// components/BooleanInput.tsx

import { useEffect, useState } from "react";

import {
  Image,
  TouchableOpacity,
  View,
  ImageSourcePropType,
} from "react-native";

import { useTheme } from "../../../hooks/use-theme-provider";

type BooleanInputProps = {
  selected: boolean;

  selection: number;

  imageSrcFalse: ImageSourcePropType;

  imageSrc: ImageSourcePropType;

  locked?: boolean;

  // pixels, or a percentage of the parent (e.g. to fit N-in-a-row) - height follows via aspectRatio
  size?: number | `${number}%`;

  // caps the rendered size in pixels regardless of `size` - see settings **maxImageSize
  maxSize?: number;

  onPress: () => void;
};

export default function BooleanImageInput({
  selected,
  selection,
  onPress,
  imageSrcFalse,
  imageSrc,
  locked = false,
  size = 100,
  maxSize,
}: BooleanInputProps) {
  const theme = useTheme();

  const [isSelected, setIsSelected] =
    useState(selected);

  // sync prop updates
  useEffect(() => {
    setIsSelected(selected);
  }, [selected]);

  function toggleSelection() {
    if (locked) return;
    onPress();
  }

  const imageStyle = [
    theme.sizes.default.image,
    {
      borderColor: isSelected ? theme.colors.border : theme.colors.background,
      borderWidth: isSelected ? 5 : 0,
      width: size,
      maxWidth: maxSize,
      aspectRatio: 1,
    },
  ];

  if (locked) {
    return (
      <View style={[theme.sizes.default.container, { alignItems: 'center' }]}>
        <Image
          style={imageStyle}
          source={
            isSelected
              ? imageSrc
              : imageSrcFalse
          }
        />
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={toggleSelection}
      style={[
        theme.sizes.default.image,
        {
          backgroundColor: theme.colors.background,
          alignItems: 'center',
        },
      ]}
    >
      <Image
        style={imageStyle}
        source={
          isSelected
            ? imageSrc
            : imageSrcFalse
        }
      />
    </TouchableOpacity>
  );
}
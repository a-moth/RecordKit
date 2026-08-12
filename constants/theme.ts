/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */
// constants/theme.ts

import { TextStyle, ViewStyle, ImageStyle } from 'react-native';

/**
 * Shared corner-radius scale ("angles") so every themed element rounds off
 * consistently instead of each component picking its own number.
 */
export const Radius = {
  sm: 8,
  md: 12,
  lg: 18,
  pill: 999,
};

//TODO: fix Sizes to make actual sense instead of just old groups of CSS classes that are messy
export const Sizes = {
  default: {
    container: {
      marginVertical: 8,
      marginLeft: 2,
      marginRight: 2,
    } as ViewStyle,

    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    } as ViewStyle,

    column: {
      flexDirection: 'column',
      flexWrap: 'wrap',
    } as ViewStyle,

    alignCenter: {
      alignItems: 'center',
      justifyContent: 'center',
    } as ViewStyle,

    button: {
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: Radius.lg,
    } as ViewStyle,

    regularButton: {
      borderWidth: 1,
    } as ViewStyle,

    imageButton: {
      borderRadius: Radius.md,
    } as ViewStyle,

    buttonText: {
      fontSize: 16,
      fontWeight: '600',
    } as TextStyle,

    textCenter: {
      textAlign: 'center',
    } as TextStyle,

    listMinItem: {
      minWidth: 800,
      minHeight: 80,
    },

    fillContainer: {
      minHeight: 100,
      minWidth: '100%',
    } as ViewStyle,

    image: {
      borderWidth: 0,
      borderRadius: Radius.sm,
      marginHorizontal: 4,
    } as ImageStyle,

    input: {
      borderWidth: 1,
      borderRadius: Radius.md,
      fontSize: 16,
      minHeight: 48,
      paddingLeft: 14,
      paddingRight: 14,
      outlineWidth: 0,
    } as TextStyle,

    text: {
      padding: 15,
      fontSize: 16,
      minHeight: 40,
    } as TextStyle,

    bold: {
      fontWeight: 'bold',
    } as TextStyle,

    currentContainerStyle: {
      padding: 16,
      minHeight: '100%',
    } as ViewStyle,

    entryListContainer: {
      flex: 0.3 / 2,
      minHeight: 'auto',
    } as ViewStyle,

    entryEditButton: {
      flex: 0.1,
    } as ViewStyle,

    entryViewer: {
      flex: 0.5,
    },

    dropdownButtonStyle: {
      width: 200,
      height: 50,
      borderRadius: 12,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 12,
    },

    dropdownButtonTxtStyle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '500',
    },

    dropdownButtonArrowStyle: {
      fontSize: 28,
    },

    dropdownButtonIconStyle: {
      fontSize: 28,
      marginRight: 8,
    },

    dropdownMenuStyle: {
      borderRadius: 8,
    },

    dropdownItemStyle: {
      width: '100%',
      flexDirection: 'row',
      paddingHorizontal: 12,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 8,
    },

    dropdownItemTxtStyle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '500',
    },

    dropdownItemIconStyle: {
      fontSize: 28,
      marginRight: 8,
    },

    section: {
      marginLeft: 10,
    } as ViewStyle,

    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
    } as TextStyle,

    'micro-button': {
      paddingVertical: 4,
      paddingHorizontal: 9,
      borderRadius: Radius.sm,
      borderWidth: 1,
      marginRight: 6,
      marginBottom: 6,
    } as ViewStyle,

    'micro-button-text': {
      fontSize: 11,
      fontWeight: '600',
    } as TextStyle,
  },
};

import { ImageSourcePropType } from 'react-native';

// The default settings values (see SettingsProvider.tsx) point at these bundled
// assets by their descriptive path rather than a real runtime URI, so resolve
// those specific values back to the actual bundled image; anything else (a
// picked content:// / data: URI) is used directly.
const bundledImages: Record<string, ImageSourcePropType> = {
    "assets/images/1.png": require("../assets/images/1.png"),
    "assets/images/2.png": require("../assets/images/2.png"),
    "assets/images/3.png": require("../assets/images/3.png"),
    "assets/images/4.png": require("../assets/images/4.png"),
    "assets/images/5.png": require("../assets/images/5.png"),
};

export function resolveBundledImage(value: string): ImageSourcePropType {
    return bundledImages[value] ?? { uri: value };
}

import { useState } from "react";

/**
 * Text inputs otherwise fall back to the browser/OS default focus ring
 * (often a mismatched yellow), which reads as a different "editing" accent
 * than the caution-colored Move Up/Move Down controls. This keeps focused
 * inputs on the same accent as the rest of the editing UI.
 */
export function useFocusBorderColor(defaultColor: string, focusColor: string) {
    const [focused, setFocused] = useState(false);

    return {
        borderColor: focused ? focusColor : defaultColor,
        onFocus: () => setFocused(true),
        onBlur: () => setFocused(false),
    };
}

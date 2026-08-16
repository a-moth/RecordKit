import { useCallback, useEffect, useRef } from 'react';

export type PickedImage = {
    uri: string;
    name: string | null;
};

// Browsers never expose a real filesystem path for a picked file, so this
// resolves to a data URI instead - same approach as FileInputField.web.tsx.
// Returns a plain, directly-usable image URI (or null on cancel/error).
export function useImagePicker() {
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        return () => {
            inputRef.current?.remove();
            inputRef.current = null;
        };
    }, []);

    function getInput(): HTMLInputElement {
        if (!inputRef.current) {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.style.display = 'none';
            document.body.appendChild(input);
            inputRef.current = input;
        }
        return inputRef.current;
    }

    const pickImage = useCallback((): Promise<PickedImage | null> => {
        return new Promise((resolve) => {
            const input = getInput();

            input.onchange = () => {
                const file = input.files?.[0];
                input.value = ""; // allow re-picking the same file later

                if (!file) {
                    resolve(null);
                    return;
                }

                const reader = new FileReader();

                reader.onload = () => {
                    resolve({ uri: reader.result as string, name: file.name });
                };

                reader.onerror = () => {
                    console.error("Error reading file:", reader.error);
                    resolve(null);
                };

                reader.readAsDataURL(file);
            };

            input.click();
        });
    }, []);

    return { pickImage };
}

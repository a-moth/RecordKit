import { errorCodes, isErrorWithCode, pick, types } from '@react-native-documents/picker';
import { File } from 'expo-file-system';

export type PickedImage = {
    uri: string;
    name: string | null;
};

// TODO: no limit on file size, but load async if too large to load into memory
export function useImagePicker() {
    async function pickImage(): Promise<PickedImage | null> {
        try {
            const [result] = await pick({ type: [types.images] });

            // The picker only returns a content://file:// reference, whose read
            // permission is scoped to this session and isn't guaranteed to still
            // resolve after the app restarts - read the actual bytes into a
            // self-contained data URI instead, matching the web picker.
            const base64 = await new File(result.uri).base64();
            const mimeType = result.type ?? "image/jpeg";

            return { uri: `data:${mimeType};base64,${base64}`, name: result.name };
        } catch (error) {
            if (isErrorWithCode(error) && error.code === errorCodes.OPERATION_CANCELED) {
                return null;
            }
            console.error("Error picking file:", error);
            return null;
        }
    }

    return { pickImage };
}

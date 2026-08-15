import { useTheme } from '../../../hooks/use-theme-provider';
import { useSettings } from '../../../utils/SettingsProvider';
import { CommonProps } from '../../managers/SettingManager';

export default function FileInputField({ template, id, field, onChange, fieldKey, defaultShown }: CommonProps) {
    const theme = useTheme();
    const { settings, updateSetting } = useSettings();
    if (!defaultShown) return null;


    // TODO: set up file input and storage of images based on loading the file path item into memory
    // TODO: limit inputs to image files
    // TODO: no limit on file size, but load async if too large to load into memory
    return null;
}
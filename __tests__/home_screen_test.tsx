import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import HomeScreen from '../app/(tabs)/index';
import { ThemeProvider } from '../hooks/use-theme-provider';
import { SettingsProvider } from '../utils/SettingsProvider';

describe('<HomeScreen />', () => {
    test('opens the template picker from the create-entry action', async () => {
        render(
            <SettingsProvider>
                <ThemeProvider>
                    <HomeScreen />
                </ThemeProvider>
            </SettingsProvider>,
        );

        await waitFor(() => screen.getByText('Create new entry'));
        fireEvent.press(screen.getByText('Create new entry'));
        await waitFor(() => screen.getByText('Choose a Template'));
    });
});

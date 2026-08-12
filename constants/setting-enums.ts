export const SETTING: Record<string, string> = {
  '**customGreeting': 'text',
  '**dayStartTime': 'time',
  '**dayFormat': 'text',
  '**timeFormat': 'text',
  '**appNickname': 'text',
  '**selfNickname': 'text',
  '**settingsFolder': 'text',
  '**colourScheme': 'selection',
  '**listEntryCount': 'number',
  '**showCount': 'number',
  UUID: 'locked',
};

// options for settings whose SETTING type is "selection"
export const SETTING_OPTIONS: Record<string, { id: string; name: string }[]> = {
  '**colourScheme': [
    { id: 'dark', name: 'Dark' },
    { id: 'light', name: 'Light' },
  ],
};

// removing all reference to purchases unless APIs will require payment processing

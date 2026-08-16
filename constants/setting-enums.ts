export const SETTING: Record<string, string> = {
  '**customGreeting': 'text',
  '**dayStartTime': 'time',
  '**dayFormat': 'text',
  '**timeFormat': 'text',
  '**appNickname': 'text',
  '**selfNickname': 'text',
  '**settingsFolder': 'text',
  '**colourScheme': 'selection',
  '**image1': 'image',
  '**image2': 'image',
  '**image3': 'image',
  '**image4': 'image',
  '**image5': 'image',
  '**maxImageSize': 'number',
  '**listEntryCount': 'number',
  '**showCount': 'number',
  settingsComplete: 'locked',
  UUID: 'locked',
};

// options for settings whose SETTING type is "selection"
export const SETTING_OPTIONS: Record<string, { id: string; name: string }[]> = {
  '**colourScheme': [
    { id: 'dark', name: 'Dark' },
    { id: 'light', name: 'Light' },
  ],
  '**timeFormat': [
    { id: 'HH:MM', name: '24 hour' },
    { id: 'HH:MMmm', name: '12 hour' },
  ],
  '**dayFormat': [
    { id: 'DD/MM/YYYY', name: 'DD/MM/YYYY' },
    { id: 'MM/DD/YYYY', name: 'MM/DD/YYYY' },
    { id: 'DD of MMM, YYYY', name: 'DD of MMM, YYYY' },
  ],
};

// removing all reference to purchases unless APIs will require payment processing

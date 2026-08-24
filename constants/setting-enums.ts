export const SETTING: Record<string, string> = {
  '**customGreeting': 'text',
  '**dayStartTime': 'time',
  '**dayFormat': 'selection',
  '**timeFormat': 'selection',
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
    { id: 'HH:mm', name: '24 hour' },
    { id: 'hh:mm a', name: '12 hour' },
  ],
  '**dayFormat': [
    { id: 'dd/MM/yyyy', name: 'dd/MM/yyyy' },
    { id: 'MM/dd/yyyy', name: 'MM/dd/yyyy' },
    { id: "dd 'of' MMM, yyyy", name: 'dd of MMM, yyyy' },
  ],
};

// removing all reference to purchases unless APIs will require payment processing

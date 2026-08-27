# Architecture overview

RecordKit is currently an Expo and React Native application using `expo-router`. It targets mobile-shaped React Native components and also has a web target.

The application is local-first. Core product data is stored on-device through `@react-native-async-storage/async-storage`; RecordKit has no server component and does not make implicit network calls. A future user-configured integration may contact a third-party API, but only through explicit per-template configuration.

The active source is organised by technical role:

- `app/` contains file-based routes;
- `components/` contains reusable UI, node inputs and operations, managers, readers, and writer wrappers;
- `constants/` contains the data model, theme, and static definitions;
- `hooks/` contains component-facing hooks and the field registry;
- `utils/` contains storage, settings, and operations that do not belong to a model instance;
- `old code/` is historical reference and is not part of the active application.

The intended migration from Expo/React Native to a React + Vite PWA must occur before 2.0. Do not introduce migration-specific architecture into earlier work unless an approved version plan authorises it.


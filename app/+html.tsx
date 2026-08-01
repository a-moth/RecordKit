import { ScrollViewStyleReset } from 'expo-router/html';
import { ReactNode } from 'react';

// This file customizes the root HTML document Expo Router generates for web
// (dev server and `expo export --platform web`). It is the web equivalent of
// the app/_layout.tsx wrapper, but for the raw <html> document itself.
export default function Root({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}

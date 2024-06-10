import '@mantine/core/styles.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Provider } from 'react-redux';
import '@mantine/notifications/styles.css';

import { theme } from '../theme';
import StoreProvider from '../StoreProvider.jsx';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <StoreProvider>
      <MantineProvider theme={theme}>
        <Notifications />
        <Head>
          <title>Mantine Template</title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
          />
          <link rel="shortcut icon" href="/favicon.svg" />
        </Head>
        <Component {...pageProps} />
      </MantineProvider>
    </StoreProvider>
  );
}

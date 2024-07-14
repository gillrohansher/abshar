'use client'
import '@mantine/core/styles.css';
import Head from 'next/head';
import { ActionIcon, AppShell, Burger, Divider, Group, MantineProvider, NavLink, ScrollArea, useMantineColorScheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';

import { theme } from '../theme';
import StoreProvider from '../StoreProvider.jsx';
import './styles.css'
import { IconLayoutDashboardFilled, IconHomeFilled, IconFlaskFilled, IconSquareXFilled, IconDropletFilled, IconBrightnessFilled } from '@tabler/icons-react';
import Link from 'next/link';
import { useDisclosure } from '@mantine/hooks';
import { useEffect } from 'react';
import { useState } from 'react';
import { useAppStore, useWindowSize } from '../lib/hooks';
import { usePathname, useRouter } from 'next/navigation';
import { clearStorageRedirectLogin } from '../helpers/helpers';

export default function App({ Component, pageProps }) {
  const size = useWindowSize();
  const [opened, { toggle }] = useDisclosure();
  const pathName = usePathname();
  // const { setColorScheme } = useMantineColorScheme();
  const navList = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: IconLayoutDashboardFilled
    },
    {
      name: 'Properties',
      path: '/properties',
      icon: IconHomeFilled
    },
    {
      name: 'Surveys',
      path: '/surveys',
      icon: IconFlaskFilled
    },
    {
      name: 'Products',
      path: '/products',
      icon: IconDropletFilled
    }
  ];

  //console.log('pageProps: ', useAppStore());

  return (
    <StoreProvider>
      <MantineProvider 
      theme={theme}
      //defaultColorScheme="dark"
      >
        <Notifications />
        {(pathName !== '/login' && pathName !== '/signup' && pathName !== '/forget-password' && !pathName?.includes('/reset-password-confirmation') && !pathName?.includes('/account-confirmation')) ?
        <AppShell
          layout="alt"
          //header={{ height: '63px' }}
          navbar={{
          width: 250,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
          }}
          padding="md"
        >
            <AppShell.Header style={{padding: '0px 20px 0px 10px'}}>
              <Group style={{height: '100%'}} justify={'space-between'} align={"center"}>
                <Group style={{height: '100%'}} gap={5} align={"center"}>
                  <Burger
                  opened={opened}
                  onClick={toggle}
                  hiddenFrom="sm"
                  size="sm"
                  />
                </Group>
                {/* <ActionIcon onClick={()=> setColorScheme('auto')} variant="filled" aria-label="Add Product">
                  <IconBrightnessFilled style={{width: '70%', height: '70%'}}/>
                </ActionIcon> */}
                
              </Group>
            </AppShell.Header>

            <AppShell.Navbar style={{padding: '0px'}}>
              <AppShell.Section>
                <Group justify={'center'}>
                  <img src={'/images/aabsar_logo.png'} style={{width: '150px', height: '63px', padding: '10px'}}/>
                </Group>
                {/* <Divider/> */}
              </AppShell.Section>
              <AppShell.Section grow component={ScrollArea}>
                  {navList.map((item)=>
                  <NavLink
                  label={item.name}
                  leftSection={<item.icon size="1rem" stroke={1.5} color={'#5185a6'} />}
                  component={Link} 
                  href={item.path}
                  onClick={toggle}
                  active={pathName === item.path}
                  />)}
              </AppShell.Section>
              <AppShell.Section>
                  <NavLink
                  label={'Logout'}
                  leftSection={<IconSquareXFilled size="1rem" stroke={1.5} color={'#5185a6'} />}
                  href={'/'}
                  onClick={()=> clearStorageRedirectLogin()}
                  />
              </AppShell.Section>
            </AppShell.Navbar>

            <AppShell.Main style={{marginTop: size.width < 767 && '30px'}}>
              <Component {...pageProps} />
            </AppShell.Main>
        </AppShell>
        :
        <Component {...pageProps} />}
      </MantineProvider>
    </StoreProvider>
  );
}
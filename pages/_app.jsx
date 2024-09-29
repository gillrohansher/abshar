'use client'
import '@mantine/core/styles.css';
import Head from 'next/head';
import { ActionIcon, AppShell, Box, Burger, Divider, Group, LoadingOverlay, MantineProvider, NavLink, ScrollArea, useMantineColorScheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import '@mantine/notifications/styles.css';

import { theme } from '../theme';
import StoreProvider from '../StoreProvider.jsx';
import './styles.css'
import '@mantine/charts/styles.css';
import { IconLayoutDashboardFilled, IconHomeFilled, IconFlaskFilled, IconSquareXFilled, IconDropletFilled, IconBrightnessFilled, IconLogout, IconUserFilled, IconBuildingMosque, IconSettingsFilled, IconCirclePlusFilled, IconUsers } from '@tabler/icons-react';
import Link from 'next/link';
import { useDisclosure } from '@mantine/hooks';
import { useEffect } from 'react';
import { useState } from 'react';
import { useAppStore, useWindowSize, useAppDispatch } from '../lib/hooks';
import { usePathname, useRouter } from 'next/navigation';
import { clearStorageRedirectLogin } from '../helpers/helpers';
import { Paper } from '@mui/material';

function AppContent({ Component, pageProps }) {
  const size = useWindowSize();
  const [opened, { toggle }] = useDisclosure();
  const pathName = usePathname();
  const router = useRouter();
  const store = useAppStore();
  const { accountData, token } = store.getState().general;
  const [loader, setLoader] = useState(true);
  const [value, setValue] = useState(0);
  const navList = accountData.type === 'ADMIN' ? [ 
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: IconLayoutDashboardFilled
    },
    {
      name: 'Products',
      path: '/products',
      icon: IconDropletFilled
    },
    {
      name: 'Users',
      path: '/users',
      icon: IconUserFilled
    },
    {
      name: 'Properties',
      path: '/properties',
      icon: IconHomeFilled
    },
    {
      name: 'Mosques',
      path: '/mosques',
      icon: IconBuildingMosque
    }
  ]
  :
  [ 
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
      name: 'Mosques',
      path: '/mosques',
      icon: IconBuildingMosque
    }
  ];

  useEffect(() => {
    setLoader(true);
    console.log('token: ', token);
    console.log('accountData: ', accountData);
    if (!accountData || Object.keys(accountData).length === 0 ) {
      if(!window.location.href.includes('/account-confirmation?token=') && !window.location.href.includes('/invite-user-account?token=') && !window.location.href.includes('/reset-password-confirmation?token=') && !window.location.href.includes('/forget-password')){
        router.push('/login');
      }
      setTimeout(() => {
        setLoader(false);  
      }, (!window.location.href.includes('/account-confirmation?token=') && !window.location.href.includes('/invite-user-account?token=') && !window.location.href.includes('/reset-password-confirmation?token=') && !window.location.href.includes('/forget-password')) ? 600 : 0);
    } else {
      if(window.location.href.includes(('/login'))){
        router.push('/dashboard');
      }
      setTimeout(() => {
        setLoader(false);  
      }, 600);
    }
  }, [accountData, router]);

  return (
    <MantineProvider 
    theme={theme}
    //defaultColorScheme="dark"
    >
      <Notifications />
      {loader ?
      <Box pos="relative" style={{height: '100vh'}}>
        <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 10 }} />
      </Box>
      :
      (pathName !== '/login' && pathName !== '/signup' && pathName !== '/forget-password' && !pathName?.includes('/reset-password-confirmation') && !pathName?.includes('/account-confirmation') && !pathName?.includes('/invite-user-account')) ?
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
          {size.width > 650 &&
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
          </AppShell.Header>}

          {size.width > 650 &&
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
                rightSection={
                  item.name === 'Mosques' &&
                  <ActionIcon  
                  id='add-property-menu-button'
                  onClick={()=> {
                    router.push('/mosques');
                    setTimeout(() => {
                      document.getElementById('add-property-button').click();  
                    }, 600);
                  }} 
                  variant="filled" 
                  aria-label="Add Property">
                    <IconCirclePlusFilled style={{width: '70%', height: '70%'}}/>
                  </ActionIcon>
                }
                component={Link} 
                href={item.path}
                //onClick={toggle}
                onClick={()=> setValue(item.path)}
                active={pathName === item.path}
                />)}
            </AppShell.Section>
            <AppShell.Section>
                <NavLink
                label={'Profile'}
                leftSection={<IconSettingsFilled size="1rem" stroke={1.5} color={'#5185a6'} />}
                component={Link}
                href={'/profile'}
                onClick={()=> setValue('/profile')}
                active={pathName === '/profile'}
                />
                <NavLink
                label={'Logout'}
                leftSection={<IconSquareXFilled size="1rem" stroke={1.5} color={'#5185a6'} />}
                href={'/'}
                onClick={()=> clearStorageRedirectLogin(true)}
                />
            </AppShell.Section>
          </AppShell.Navbar>}
          
          <AppShell.Main style={{marginTop: size.width < 767 && size.width > 650 && '30px', marginBottom: size.width < 650 && '50px'}}>
            <Component {...pageProps} />
          </AppShell.Main>
          {size.width < 650 &&
          <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
            <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
              router.push(newValue);
            }}
            className="bottom-mobile-navbar"
            >
              {navList.map((item)=>
              <BottomNavigationAction label={item.name} value={item.path} icon={<item.icon size="1rem" stroke={1.5} />} />
              )}
              <BottomNavigationAction label={'Profile'} onClick={()=> setValue('/profile')} value={'/profile'} icon={<IconSettingsFilled size="1rem" stroke={1.5} />} />
              <BottomNavigationAction label={'Logout'} onClick={()=> clearStorageRedirectLogin(true)} value={'/'} icon={<IconSquareXFilled size="1rem" stroke={1.5} />} />
            </BottomNavigation>
          </Paper>}
      </AppShell>
      :
      <Component {...pageProps} />}
    </MantineProvider>
  );
}

export default function App({ Component, pageProps }) {
  return (
    <StoreProvider>
      <AppContent Component={Component} pageProps={pageProps} />
    </StoreProvider>
  );
}
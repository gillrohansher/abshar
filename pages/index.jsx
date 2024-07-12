import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppStore, useAppSelector } from '../lib/hooks';
import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { clearStorageRedirectLogin } from "../helpers/helpers";
import { AppShell, Box, Burger, Button, LoadingOverlay, NavLink } from '@mantine/core';
import { useState } from 'react';
import Link from 'next/link';
import { useDisclosure } from '@mantine/hooks';
import { IconHome2, IconGauge, IconChevronRight, IconActivity, IconCircleOff } from '@tabler/icons-react';

export default function HomePage() {
  const store = useAppStore();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loaderLocal, setLoaderLocal] = useState(false);
  const [mainVisibility, setMainVisibility] = useState(false);
  const {accountData, token, loader} = store.getState().general;

  useEffect(() => {
    setLoaderLocal(true);
    if((Object.keys(accountData).length === 0 || accountData === null)){
      router.push('/login');
    }else{
      setLoaderLocal(false);
      setMainVisibility(true);
      router.push('/dashboard');
    }
  });

  console.log('getAuthToken(): ', store.getState().general);
  return (
    <Box pos="relative" style={{visibility: !mainVisibility && 'hidden'}}>
      <LoadingOverlay visible={loaderLocal || loader} zIndex={1000} overlayProps={{ radius: "sm", blur: 10 }} />
      {/* <Welcome />
      <ColorSchemeToggle />
      <Button onClick={()=> clearStorageRedirectLogin()}>Logout</Button> */}
    </Box>
  );
}

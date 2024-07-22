import { ActionIcon, Anchor, AppShell, Box, Burger, Button, Card, Center, Fieldset, Grid, Group, Image, LoadingOverlay, NavLink, PasswordInput, SimpleGrid, Stack, Text, TextInput, useMantineColorScheme } from '@mantine/core';
import { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/navigation'

import { SignInPost } from '../../api/fetchApis/Auth';
import { useAppStore, useAppDispatch, useWindowSize } from '../../lib/hooks';
import { set_account_data, set_token } from '../../lib/generalActions/generalActions';
import DashboardPropertyTypesCard from '../../components/DashboardPropertyTypesCard/DashboardPropertyTypesCard';
import { IconMapPinFilled } from '@tabler/icons-react';
import { PropertiesGet } from '@/api/fetchApis/Properties';

function DashboardPage(props) {
    const size = useWindowSize();
    const store = useAppStore();
    const {token} = store.getState().general;
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [properties, setProperties] = useState([]);
    const [propertiesLoader, setPropertiesLoader] = useState(false);

    useEffect(() => {
        getProperties();
    }, []);

    const getProperties=()=>{
        setPropertiesLoader(true);
        PropertiesGet(null, token, res=>{
            if(res?.code === 200){
                setProperties(res?.data);
            }
            setPropertiesLoader(false);
        });
    }

    return (
        <Stack>
            <SimpleGrid cols={size.width < 650 ? 1 : size.width < 767 ? 2 : size.width < 900 ? 1 : size.width < 1300 ? 2 : 3}>
                <DashboardPropertyTypesCard properties={properties} loader={propertiesLoader}/>
            </SimpleGrid>
        </Stack>
    );
}

export default DashboardPage;
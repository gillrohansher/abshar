import { ActionIcon, Anchor, AppShell, Box, Burger, Button, Card, Center, Fieldset, Grid, Group, Image, LoadingOverlay, NavLink, PasswordInput, SimpleGrid, Stack, Text, TextInput, useMantineColorScheme } from '@mantine/core';
import { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/navigation'

import { SignInPost } from '../../api/fetchApis/Auth';
import { useAppStore, useAppDispatch, useWindowSize } from '../../lib/hooks';
import { set_account_data, set_token } from '../../lib/generalActions/generalActions';
import DashboardPropertyTypesCard from '../../components/DashboardPropertyTypesCard/DashboardPropertyTypesCard';
import { IconMapPinFilled } from '@tabler/icons-react';

function DashboardPage(props) {
    const size = useWindowSize();
    const store = useAppStore();
    const dispatch = useAppDispatch();
    const router = useRouter();

    return (
        <Stack>
            <SimpleGrid cols={size.width < 650 ? 1 : size.width < 767 ? 2 : size.width < 900 ? 1 : size.width < 1300 ? 2 : 3}>
                <DashboardPropertyTypesCard/>
            </SimpleGrid>
        </Stack>
    );
}

export default DashboardPage;
import { ActionIcon, Anchor, AppShell, Box, Burger, Button, Card, Center, Fieldset, Group, Image, LoadingOverlay, NavLink, PasswordInput, Stack, Text, TextInput, useMantineColorScheme } from '@mantine/core';
import { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/navigation'

import { SignInPost } from '../../api/fetchApis/Auth';
import { useAppStore, useAppDispatch } from '../../lib/hooks';
import { set_account_data, set_token } from '../../lib/generalActions/generalActions';
import { IconMapPinFilled } from '@tabler/icons-react';

function DashboardPage(props) {
    const store = useAppStore();
    const dispatch = useAppDispatch();
    const router = useRouter();

    return (
        <Stack>
            <Group>
                {/* <Card 
                shadow="sm"
                padding="sm"
                component="a"
                href="/dashboard">
                    <Group gap={5} align={"flex-start"}>
                        <IconMapPinFilled size={16} style={{margin: '5px 10px 5px 5px'}}/>
                        <Stack gap={5} justify={"flex-start"} align={"flex-start"}>
                            <span className='dashboard-card-main-text'>10</span>
                            <span className='mantine-TextInput-label'>Properties</span>
                        </Stack>
                    </Group>
                </Card> */}
            </Group>
        </Stack>
    );
}

export default DashboardPage;
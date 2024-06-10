import { Button, Center, Fieldset, Group, PasswordInput, Stack, TextInput } from '@mantine/core';
import { useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/navigation'

import { SignUpPost } from '../../api/fetchApis/Auth';
import { useAppStore, useAppDispatch } from '../../lib/hooks';
import { set_account_data, set_token } from '../../lib/generalActions/generalActions';

function SignUpPage(props) {
    const store = useAppStore();
    const dispatch = useAppDispatch();
    const router = useRouter();

    return (
        <Center h={'100vh'}>
            
        </Center>
    );
}

export default SignUpPage;
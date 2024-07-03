import { ActionIcon, Alert, Anchor, Box, Button, Center, Fieldset, Group, Image, LoadingOverlay, PasswordInput, Stack, TextInput, useMantineColorScheme } from '@mantine/core';
import { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/navigation'

import { ResetPasswordPost, SignInPost } from '../../api/fetchApis/Auth';
import { useAppStore, useAppDispatch } from '../../lib/hooks';
import { set_account_data, set_token } from '../../lib/generalActions/generalActions';
import { useDisclosure } from '@mantine/hooks';

function ForgetPasswordPage(props) {
    const [email, setEmail] = useState();
    const store = useAppStore();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [loader, setLoader] = useState(false);

    const resetPassword=()=>{
        setLoader(true);
        ResetPasswordPost({email}, res=>{
            if(res.code === 200){
                showNotification({
                    color: 'green',
                    message: 'An email has been sent to your email address with further details.',
                    autoClose: false
                });
                router.push('/login');
            }else{
                showNotification({
                    title: 'Failed',
                    color: 'red',
                    message: res.message
                });
            }
            setLoader(false);
        });
    }

    return (
        <Stack>
            <Center h={'100vh'}>
                <Stack>
                    <Group justify={'center'}>
                        <img src={'/images/aabsar_logo.png'} style={{width: '150px'}}/>
                    </Group>
                    <Box pos="relative">
                        <LoadingOverlay visible={loader} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                        <Fieldset style={{padding: 30}}>
                            <Stack>
                                <Stack>
                                    <TextInput 
                                    label="Email" 
                                    placeholder="Your email"
                                    value={email}
                                    onChange={(event) => setEmail(event.currentTarget.value)}
                                    />
                                </Stack>
                                <Group grow>
                                    <Button color={'#5185a6'} onClick={()=> resetPassword()}>Send reset link</Button>
                                </Group>
                            </Stack>
                        </Fieldset>
                    </Box>
                </Stack>
            </Center>
        </Stack>
    );
}

export default ForgetPasswordPage;
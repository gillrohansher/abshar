import { ActionIcon, Alert, Anchor, Box, Button, Center, Fieldset, Group, Image, LoadingOverlay, PasswordInput, Stack, TextInput, useMantineColorScheme } from '@mantine/core';
import { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/navigation'

import { EmailVerificationPut, ResendEmailVerificationPut, SignInPost } from '../../api/fetchApis/Auth';
import { useAppStore, useAppDispatch } from '../../lib/hooks';
import { set_account_data, set_token } from '../../lib/generalActions/generalActions';
import { useDisclosure } from '@mantine/hooks';

function AccountConfirmationPage(props) {
    const store = useAppStore();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [loader, setLoader] = useState(false);
    const [verificationToken, setVerificationToken] = useState(null);
    const [showEmailVerificationMessage, setShowEmailVerificationMessage] = useState(false);
    const [emailVerificationMessage, setEmailVerificationMessage] = useState(null);

    useEffect(() => {
        let url = new URL(window.location.href);
        let token= url.searchParams.get('token');
        setVerificationToken(token);
        verifyEmail(token);
    }, []);

    const verifyEmail=(token)=>{
        setLoader(true);
        EmailVerificationPut(token, res=>{
            if(res.code === 200){
                showNotification({
                    color: 'green',
                    message: 'success'
                });
                setShowEmailVerificationMessage(true);
                setEmailVerificationMessage(true);
            }else{
                if(res.code === 607){
                    setShowEmailVerificationMessage(true);
                    setEmailVerificationMessage(false)
                }else{
                    showNotification({
                        title: 'Failed',
                        color: 'red',
                        message: res.message
                    });
                }
            }
            setLoader(false);
        });
    }

    const resendVerificationEmail=()=>{
        setLoader(true);
        ResendEmailVerificationPut(verificationToken, res=>{
            if(res.code === 200){
                showNotification({
                    color: 'green',
                    message: 'Success'
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

    console.log('loader: ', loader);
    return (
        <Stack>
            <Center h={'100vh'}>
                <Stack>
                    <Group justify={'center'}>
                        <img src={'/images/aabsar_logo.png'} style={{width: '150px'}}/>
                    </Group>
                    <Box pos="relative" style={{minWidth: '320px'}}>
                        <LoadingOverlay visible={loader} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                        {showEmailVerificationMessage &&
                        <Alert variant="light" color="blue" title="Email verification">
                            <Stack>
                                <span>{emailVerificationMessage ? 'Your email is successfully verified.' : 'Your email verification token expired. Kindly click on resend email to start again.'}</span>
                                <Group justify={'flex-end'}>
                                    <Button 
                                    color={'#5185a6'}
                                    onClick={()=> emailVerificationMessage ? router.push('/login') : resendVerificationEmail()}>
                                        {emailVerificationMessage ? 'Okay' : 'Resend email'}
                                    </Button>
                                </Group>
                            </Stack>
                        </Alert>}
                    </Box>
                </Stack>
            </Center>
        </Stack>
    );
}

export default AccountConfirmationPage;
import { ActionIcon, Alert, Anchor, Box, Button, Center, Fieldset, Group, Image, LoadingOverlay, PasswordInput, Stack, TextInput, useMantineColorScheme } from '@mantine/core';
import { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/navigation'

import { EmailVerificationPut, ResendEmailVerificationPut, ResetPasswordConfirmPost, SignInPost } from '../../api/fetchApis/Auth';
import { useAppStore, useAppDispatch } from '../../lib/hooks';
import { set_account_data, set_token } from '../../lib/generalActions/generalActions';
import { useDisclosure } from '@mantine/hooks';

function InviteUserAccountPage(props) {
    const router = useRouter();
    const [loader, setLoader] = useState(false);
    const [verificationToken, setVerificationToken] = useState(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswordVerificationMessage, setShowPasswordVerificationMessage] = useState(false);

    useEffect(() => {
        let url = new URL(window.location.href);
        let token= url.searchParams.get('token');
        setVerificationToken(token);
    }, []);

    const verifyPasswordReset=()=>{
        if(password === confirmPassword){
            setLoader(true);
            ResetPasswordConfirmPost({
                token: verificationToken, 
                newPassword: password
            }, res=>{
                if(res.code === 200){
                    showNotification({
                        color: 'green',
                        message: 'success'
                    });
                    setShowPasswordVerificationMessage(true);
                }else{
                    showNotification({
                        title: 'Failed',
                        color: 'red',
                        message: res.message
                    });
                }
                setLoader(false);
            });
        }else{
            showNotification({
                color: 'red',
                message: 'Password does not match.'
            });
        }
        
    }

    return (
        <Stack>
            <Center h={'100vh'}>
                <Stack style={{width: '20%'}}>
                    <Group justify={'center'}>
                        <img src={'/images/aabsar_logo.png'} style={{width: '150px'}}/>
                    </Group>
                    <Box pos="relative" style={{minWidth: '320px'}}>
                        <LoadingOverlay visible={loader} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                        {showPasswordVerificationMessage ?
                        <Alert variant="light" color="blue" title="Set password">
                            <Stack>
                                <span>Password was successfully set. Kindly click Next to login.</span>
                                <Group justify={'flex-end'}>
                                    <Button 
                                    color={'#5185a6'}
                                    onClick={()=> router.push('/login')}>
                                        {'Next'}
                                    </Button>
                                </Group>
                            </Stack>
                        </Alert>
                        :
                        <Fieldset style={{padding: 30}}>
                            <Stack spacing="md">
                                <PasswordInput
                                label="Password"
                                placeholder="Enter your new password"
                                value={password}
                                onChange={(e) => setPassword(e.currentTarget.value)}
                                required
                                />
                                <PasswordInput
                                label="Confirm password"
                                placeholder="Enter above password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                                required
                                />
                                <Button color={'#5185a6'} onClick={()=> verifyPasswordReset()}>Set password</Button>
                            </Stack>
                        </Fieldset>}
                    </Box>
                </Stack>
            </Center>
        </Stack>
    );
}

export default InviteUserAccountPage;
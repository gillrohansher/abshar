'use client'
import { ActionIcon, Alert, Anchor, Box, Button, Center, Fieldset, Group, Image, LoadingOverlay, PasswordInput, Stack, Text, TextInput, useMantineColorScheme } from '@mantine/core';
import { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/navigation'

import { SignInPost } from '../../api/fetchApis/Auth';
import { useAppStore, useAppDispatch } from '../../lib/hooks';
//import { set_account_data, set_token } from '../../lib/generalActions/generalActions';
import { setToken, setAccountData } from '../../lib/generalSlice';
import { useDisclosure } from '@mantine/hooks';

function LoginPage(props) {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const store = useAppStore();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [loader, setLoader] = useState(false);
    const [showEmailVerificationMessage, setShowEmailVerificationMessage] = useState(false);
    const { setColorScheme } = useMantineColorScheme();

    useEffect(() => {
        // setLoader(true);
        // const {accountData, token} = store.getState();
        // if((Object.keys(accountData).length > 0 || accountData !== null)){
        //   router.push('/');
        // }else{
        //   setLoader(false);
        // }
    });

    const login=()=>{
        setLoader(true);
        SignInPost({email, password}, res=>{
            if(res.code === 200 && res.data){
                showNotification({
                    color: 'green',
                    message: 'success'
                });
                dispatch(setAccountData(res.data));
                dispatch(setToken(res.data.token));
                router.push('/dashboard');
            }else{
                if(res.code === 609){
                    setShowEmailVerificationMessage(true);
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
                        {showEmailVerificationMessage ?
                        <Alert variant="light" color="blue" title="Email verification">
                            <Stack>
                                <span>Your email is not verified. Kindly check your email to proceed further.</span>
                                <Group justify={'flex-end'}>
                                    <Button 
                                    color={'#5185a6'}
                                    onClick={()=> setShowEmailVerificationMessage(false)}>
                                        Okay
                                    </Button>
                                </Group>
                            </Stack>
                        </Alert>
                        :
                        <Fieldset style={{padding: 30}}>
                            <Stack>
                                <Stack>
                                    <TextInput 
                                    label="Email" 
                                    placeholder="Your email"
                                    value={email}
                                    onChange={(event) => setEmail(event.currentTarget.value)}
                                    />
                                    <PasswordInput
                                    label="Password"
                                    placeholder="Your password"
                                    value={password}
                                    onChange={(event) => setPassword(event.currentTarget.value)}
                                    />
                                </Stack>
                                <Stack gap={5}>
                                    <Anchor href='/forget-password' style={{fontSize: '12px', color: '#5185a6'}} underline='never'>Forget Password?</Anchor>
                                </Stack>
                                <Stack gap={8}>
                                    <Group grow>
                                        <Button color={'#5185a6'} onClick={()=> login()}>Login</Button>
                                    </Group>
                                    <Group justify={'center'}>
                                        <Text size={'xs'}>Or</Text>
                                    </Group>
                                    <Group grow>
                                        <Button color={'#5185a6'} onClick={()=> router.push('/signup')}>Create new account</Button>
                                    </Group>
                                </Stack>
                            </Stack>
                        </Fieldset>}
                    </Box>
                </Stack>
            </Center>
        </Stack>
    );
}

export default LoginPage;
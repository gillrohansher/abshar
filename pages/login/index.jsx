import { Anchor, Box, Button, Center, Fieldset, Group, LoadingOverlay, PasswordInput, Stack, TextInput } from '@mantine/core';
import { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/navigation'

import { SignInPost } from '../../api/fetchApis/Auth';
import { useAppStore, useAppDispatch } from '../../lib/hooks';
import { set_account_data, set_token } from '../../lib/generalActions/generalActions';
import { useDisclosure } from '@mantine/hooks';

function LoginPage(props) {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const store = useAppStore();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [loader, setLoader] = useState(false);

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
                dispatch(set_account_data(res.data));
                dispatch(set_token(res.data.token));
                router.push('/');
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
        <Center h={'100vh'}>
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
                            <PasswordInput
                            label="Password"
                            placeholder="Your password"
                            value={password}
                            onChange={(event) => setPassword(event.currentTarget.value)}
                            />
                        </Stack>
                        <Group>
                            <Anchor href='/signup' style={{fontSize: '12px'}} underline='never'>Create new account.</Anchor>
                        </Group>
                        <Group grow>
                            <Button onClick={()=> login()}>Login</Button>
                        </Group>
                    </Stack>
                </Fieldset>
            </Box>
        </Center>
    );
}

export default LoginPage;
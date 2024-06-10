import { Welcome } from '../../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../../components/ColorSchemeToggle/ColorSchemeToggle';
import { Button, Center, Fieldset, Group, PasswordInput, Stack, TextInput } from '@mantine/core';
import { useState } from 'react';
import { connect } from 'react-redux';
import { showNotification } from '@mantine/notifications';

import { SignInPost } from '../../api/fetchApis/Auth';
import { useAppStore, useAppDispatch } from '../../lib/hooks';
import { set_account_data, set_token } from '../../lib/generalActions/generalActions';

function LoginPage(props) {
    const [email, setEmail] = useState('test');
    const [password, setPassword] = useState();
    const store = useAppStore();
    const dispatch = useAppDispatch();

    const login=()=>{
        SignInPost({email, password}, res=>{
            if(res.data.code === 200 && res.data.data){
                showNotification({
                    color: 'green',
                    message: 'success'
                });
                dispatch(set_account_data(res.data.data));
                dispatch(set_token(res.data.data.token));
            }else{
                showNotification({
                    color: 'red',
                    message: 'failed'
                });
            }
        })
    }
    return (
        <Center h={'100vh'}>
            <Fieldset legend="Enter credentials" style={{padding: 30}}>
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
                    <Group grow>
                        <Button onClick={()=> login()}>Login</Button>
                    </Group>
                </Stack>
            </Fieldset>
        </Center>
    );
}

export default LoginPage;
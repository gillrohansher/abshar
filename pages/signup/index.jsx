import { Button, Center, PasswordInput, Stack, TextInput, Select, Fieldset, LoadingOverlay, Box } from '@mantine/core';
import { useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/navigation';

import { SignUpPost } from '../../api/fetchApis/Auth';
import { useAppStore, useAppDispatch } from '../../lib/hooks';
import { set_account_data, set_token } from '../../lib/generalActions/generalActions';
import { useDisclosure } from '@mantine/hooks';

function SignUpPage(props) {
  const store = useAppStore();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState('0'); // Default value as string
  const [visible, { toggle }] = useDisclosure(false);

  const responseHandler = (response) => {
    console.log('Response from handler: ', response);
    if (response.code === 200) {
        showNotification({
            title: 'Success',
            message: 'You have signed up successfully!',
            color: 'green',
        });
        dispatch(set_account_data(response.data));
        dispatch(set_token(response.data.token));
        router.push('/');
    } else {
        console.log('error');
        showNotification({
            title: 'Failed',
            message: response.message,
            color: 'red',
        });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      firstName,
      lastName,
      email,
      phone,
      password,
      type: Number(type), // Convert back to number when sending the data
    };

    try {
      console.log('Called');
      const response = await SignUpPost(data, responseHandler);
      
      
    } catch (error) {
      console.log(error);
      showNotification({
        title: 'Error',
        message: 'An error occurred during sign up',
        color: 'red',
      });
    }
  };

  return (
    <Center h={'100vh'}>
        <Box pos="relative">
            <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            <Fieldset style={{padding: 30}}>
                <form onSubmit={handleSubmit}>
                    <Stack spacing="md">
                    <TextInput
                        label="First Name"
                        placeholder="Enter your first name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.currentTarget.value)}
                        required
                    />
                    <TextInput
                        label="Last Name"
                        placeholder="Enter your last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.currentTarget.value)}
                        required
                    />
                    <TextInput
                        label="Email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.currentTarget.value)}
                        required
                    />
                    <TextInput
                        label="Phone"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.currentTarget.value)}
                        required
                    />
                    <PasswordInput
                        label="Password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.currentTarget.value)}
                        required
                    />
                    <Select
                        label="Type"
                        placeholder="Select type"
                        data={[
                        { value: '0', label: 'User' },
                        { value: '1', label: 'Admin' },
                        ]}
                        value={type}
                        onChange={(value) => setType(value)}
                        required
                    />
                    <Button type="submit">Sign Up</Button>
                    </Stack>
                </form>
            </Fieldset>
        </Box>
    </Center>
  );
}

export default SignUpPage;

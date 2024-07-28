import { Button, Center, PasswordInput, Stack, TextInput, Select, Fieldset, LoadingOverlay, Box, Group, Alert } from '@mantine/core';
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
  const [gender, setGender] = useState(null); // Default value as string
  const [showEmailVerificationMessage, setShowEmailVerificationMessage] = useState(false);
  const [loader, setLoader] = useState(false);

  const responseHandler = (response) => {
    console.log('Response from handler: ', response);
    if (response.code === 200) {
        showNotification({
            title: 'Success',
            message: 'You have signed up successfully!',
            color: 'green',
        });
        setShowEmailVerificationMessage(true);
        // dispatch(set_account_data(response.data));
        // dispatch(set_token(response.data.token));
        //router.push('/login');
    } else {
        console.log('error');
        showNotification({
            title: 'Failed',
            message: response.message,
            color: 'red',
        });
    }
    setLoader(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      firstName,
      lastName,
      email,
      phone,
      password,
      countryCode: '+92',
      gender
      //type: 'ADMIN'//Number(type), // Convert back to number when sending the data
    };

    try {
      console.log('Called');
      setLoader(true);
      const response = await SignUpPost(data, responseHandler);
      
      
    } catch (error) {
      console.log(error);
      setLoader(false);
      showNotification({
        title: 'Error',
        message: 'An error occurred during sign up',
        color: 'red',
      });
    }
  };

  return (
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
              <span>An email for verification has been sent. Kindly check your email to proceed further.</span>
              <Group justify={'flex-end'}>
                <Button 
                color={'#5185a6'}
                onClick={()=> router.push('/login')}>
                  Okay
                </Button>
              </Group>
            </Stack>
          </Alert>
          :
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
                  <Select
                      label="Gender"
                      placeholder="Select gender"
                      data={[
                      { value: 'MALE', label: 'Male' },
                      { value: 'FEMALE', label: 'Female' },
                      { value: 'OTHER', label: 'Other' }
                      ]}
                      value={gender}
                      onChange={(value) => setGender(value)}
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
                  <Button color={'#5185a6'} type="submit">Sign Up</Button>
                  </Stack>
              </form>
          </Fieldset>
          }
        </Box>
      </Stack>
    </Center>
  );
}

export default SignUpPage;

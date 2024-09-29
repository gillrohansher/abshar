import { ActionIcon, Anchor, AppShell, Box, Burger, Button, Card, Center, Container, Divider, Fieldset, Grid, Group, Image, Loader, LoadingOverlay, NavLink, PasswordInput, Select, SimpleGrid, Stack, Text, TextInput, Title, useMantineColorScheme } from '@mantine/core';
import { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/navigation'

import { SignInPost } from '../../api/fetchApis/Auth';
import { useAppStore, useAppDispatch, useWindowSize } from '../../lib/hooks';
import { set_account_data, set_token } from '../../lib/generalActions/generalActions';
import DashboardPropertyTypesCard from '../../components/DashboardPropertyTypesCard/DashboardPropertyTypesCard';
import DashboardWaterFlowRate from '../../components/DashboardWaterFlowRate/DashboardWaterFlowRate';
import DashboardUsersCard from '../../components/DashboardUsersCard/DashboardUsersCard';
import DashboardLeakAlert from '../../components/DashboardLeakAlert/DashboardLeakAlert';
import PropertiesEstimationBarChart from '../../components/PropertiesEstimationBarChart/PropertiesEstimationBarChart';
import { IconMapPinFilled, IconSettingsFilled } from '@tabler/icons-react';
import { PropertiesBillEstimateGet, PropertiesCountGet } from '@/api/fetchApis/Properties';
import dayjs from 'dayjs';
import { UsersGet } from '@/api/fetchApis/Users';
import { setAccountData } from '../../lib/generalSlice';
import { UserPut } from '../../api/fetchApis/Users';

function ProfilePage(props) {
    const size = useWindowSize();
    const store = useAppStore();
    const {token, accountData} = store.getState().general;
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [firstName, setFirstName] = useState(accountData.firstName);
    const [lastName, setLastName] = useState(accountData.lastName);
    const [email, setEmail] = useState(accountData.email);
    const [phone, setPhone] = useState(accountData.phone);
    // const [password, setPassword] = useState('');
    const [gender, setGender] = useState(accountData.gender); // Default value as string
    const [validationFailed, setValidationFailed] = useState(false);
    const [loader, setLoader] = useState(false);
    // const [type, setType] = useState(accountData.type);

    useEffect(() => {
        console.log('accountData: ', accountData);
    }, []);
    
    const validate=()=>{
        if(firstName && lastName && gender && phone){
            if(accountData.firstName !== firstName || accountData.lastName !== lastName || accountData.gender !== gender || accountData.phone !== phone){
                putUser();
            }
        }else{
            setValidationFailed(true);
        }
    }

    const putUser=()=>{
        setLoader(true);
        UserPut({
            userId: accountData.id,
            firstName,
            lastName,
            gender,
            countryCode: accountData.countryCode,
            phone,
            type: accountData.type
        }, token, res=>{
            if(res?.code === 200){
                showNotification({
                    message: 'Profile updated successfully.',
                    color: 'green',
                    id: 'profileUpdated'
                });
                dispatch(setAccountData({...accountData, firstName, lastName, gender, phone}));
            }
            setLoader(false);
        });
    }

    return (
        <Stack gap={'md'}>
            <Group gap={'xs'}>
                <IconSettingsFilled size="1.125rem" stroke={1.5} color={'#5185a6'} />
                <Title order={4}>Profile</Title>
            </Group>
            <Divider/>
            <Stack gap={'sm'} style={{width: '300px'}}>
                <Group>
                    <Title order={5}>Profile information</Title>
                </Group>
                {loader ?
                <Group justify={'center'} align={'center'} style={{height: '360px'}}>
                    <Loader/>
                </Group>
                :
                <>
                    <TextInput
                        label="Email"
                        placeholder="Enter your email"
                        value={email}
                        disabled={true}
                    />
                    <TextInput
                        label="First Name"
                        placeholder="Enter your first name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.currentTarget.value)}
                        required
                        error={firstName === null && validationFailed}
                    />
                    <TextInput
                        label="Last Name"
                        placeholder="Enter your last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.currentTarget.value)}
                        required
                        error={lastName === null && validationFailed}
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
                        error={gender === null && validationFailed}
                    />
                    <TextInput
                        label="Phone"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.currentTarget.value)}
                        required
                        error={phone === null && validationFailed}
                    />
                </>}
                <Button disabled={validationFailed || (accountData.firstName === firstName && accountData.lastName === lastName && accountData.gender === gender && accountData.phone === phone) || loader} onClick={()=> validate()}>Save</Button>
            </Stack>
        </Stack>
    );
}

export default ProfilePage;
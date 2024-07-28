import { Button, Fieldset, Group, Modal, Select, Stack, TextInput, useMantineColorScheme } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useEffect } from 'react';
import { useState } from 'react';
import { UserPost } from '../../api/fetchApis/Users';
import { useAppStore } from '../../lib/hooks';

export function AddUserModal({opened, onClose, getUsers}) {
    const store = useAppStore();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState(null); // Default value as string
    const [type, setType] = useState(null);
    const [showEmailVerificationMessage, setShowEmailVerificationMessage] = useState(false);
    const [loader, setLoader] = useState(false);
    const {token, accountData} = store.getState().general;

    const postUser=()=>{
        setLoader(true);
        UserPost({
            firstName,
            lastName,
            email,
            gender,
            countryCode: '+92',
            phone,
            type
        }, token, res=>{
            if(res?.code === 200){
                showNotification({
                    message: 'User added successfully.',
                    color: 'green',
                    id: 'userAdded'
                });
                getUsers(res.data);
            }
            setLoader(false);
        });
    }

    return (
    <Modal opened={opened} onClose={onClose} title="Add user" centered>
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
            <Select
                label="Type"
                placeholder="Select user type"
                data={[
                { value: 'ADMIN', label: 'Admin' },
                { value: 'CLIENT', label: 'Client' },
                { value: 'SURVEYOR', label: 'Surveyor' }
                ]}
                value={type}
                onChange={(value) => setType(value)}
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
            <Button onClick={()=> postUser()}>Create user</Button>
        </Stack>
    </Modal>
    );
}

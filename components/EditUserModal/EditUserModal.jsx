import { Button, Fieldset, Group, Modal, Select, Stack, TextInput, useMantineColorScheme } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useEffect } from 'react';
import { useState } from 'react';
import { UserPost, UserPut } from '../../api/fetchApis/Users';
import { useAppStore } from '../../lib/hooks';

export function EditUserModal({opened, onClose, getUsers, userData}) {
    const store = useAppStore();
    const [firstName, setFirstName] = useState(userData.firstName);
    const [lastName, setLastName] = useState(userData.lastName);
    const [phone, setPhone] = useState(userData.phone);
    const [gender, setGender] = useState(userData.gender); // Default value as string
    const [type, setType] = useState(userData.type);
    const [showEmailVerificationMessage, setShowEmailVerificationMessage] = useState(false);
    const [loader, setLoader] = useState(false);
    const {token, accountData} = store.getState().general;

    const putUser=()=>{
        setLoader(true);
        UserPut({
            userId: userData.id,
            firstName,
            lastName,
            gender,
            countryCode: '+92',
            phone,
            type
        }, token, res=>{
            if(res?.code === 200){
                showNotification({
                    message: 'User updated successfully.',
                    color: 'green',
                    id: 'userUpdated'
                });
                getUsers(res.data);
            }
            setLoader(false);
        });
    }

    return (
    <Modal opened={opened} onClose={onClose} title="Edit user" centered>
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
                label="Phone"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.currentTarget.value)}
                required
            />
            <Button onClick={()=> putUser()}>Save</Button>
        </Stack>
    </Modal>
    );
}

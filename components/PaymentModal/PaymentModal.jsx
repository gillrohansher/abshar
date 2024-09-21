import { Button, Center, FileInput, Group, Loader, Modal, Radio, Select, Stack, Text, TextInput, useMantineColorScheme } from '@mantine/core';
import { useEffect, useState } from 'react';
import { IconPhotoOff } from '@tabler/icons-react';
import { PropertyUploadFeatureImagePost } from '@/api/fetchApis/Properties';
import { compressImage } from '@/helpers/helpers';
import { useAppStore } from '@/lib/hooks';
import { showNotification } from '@mantine/notifications';
import { PageRedirectionRequestPost, PaymentPost } from '../../api/fetchApis/Payments';
import Script from 'next/script';

export function PaymentModal({opened, onClose}) {
    const store = useAppStore();
    const {token, accountData} = store.getState().general;
    const [paymentPostResponse, setPaymentPostResponse] = useState(null);
    const data = [
        {
            label: 'Alfa Wallet',
            value: 'ALFA_WALLET',
        },
        {
            label: 'Alfalah Bank Account',
            value: 'ALFA_BANK_ACCOUNT',
        },
        {
            label: 'Credit/Debit Card',
            value: 'ALFA_CREDIT_DEBIT',
        },
    ];
    const [value, setValue] = useState('');

    // useEffect(() => {
    // }, []);

    const establishConnection=()=>{
        PaymentPost({totalAmount: 1000, paymentMethod: value, redirection: 0}, 
        token, 
        res=>{
            if(res?.code === 200){
                showNotification({
                    message: 'Payment created.',
                    color: 'green',
                    id: 'paymentCreated'
                });

                setPaymentPostResponse(res?.data);

                PageRedirectionRequestPost({...res?.data, transactionTypeId: value}, 
                null, 
                res=>{
                    console.log('PageRedirectionRequestPost: ', res);
                });
            }
            // setLoader(false);
        });
    }
    return (
    <Modal opened={opened} onClose={onClose} size='auto' title="Select Payment Method" centered>

        <Stack>
            <Group>
                <Select
                data={data} 
                value={value} 
                onChange={(value)=> {
                    setValue(value);
                }}
                />
            </Group> 
            <Group justify={'space-between'} style={{width: '100%'}}>
                <Button color={'gray'} onClick={()=> onClose()}>Close</Button>
                <Button onClick={()=> establishConnection()}>Next</Button>
            </Group>
        </Stack>
    </Modal>
    );
}

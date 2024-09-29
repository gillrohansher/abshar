import { Button, Center, FileInput, Grid, Group, Loader, Modal, NumberInput, Radio, Select, Stack, Text, TextInput, Title, useMantineColorScheme } from '@mantine/core';
import { useEffect, useState } from 'react';
import { IconPhotoOff } from '@tabler/icons-react';
import { PropertyUploadFeatureImagePost } from '@/api/fetchApis/Properties';
import { compressImage } from '@/helpers/helpers';
import { useAppStore } from '@/lib/hooks';
import { showNotification } from '@mantine/notifications';
import { CheckoutAddItemsPost, PageRedirectionRequestPost, PaymentPost } from '../../api/fetchApis/Payments';
import Script from 'next/script';

export function SubscriptionSelectionModal({opened, onClose, propertyData}) {
    const store = useAppStore();
    const {token, accountData} = store.getState().general;
    const [paymentPostResponse, setPaymentPostResponse] = useState(null);
    const [totalPayableAmount, setTotalPayableAmount] = useState();

    const [firstNameBillingInfo, setFirstNameBillingInfo] = useState(null);
    const [lastNameBillingInfo, setLastNameBillingInfo] = useState(null);
    const [countryCodeBillingInfo, setCountryCodeBillingInfo] = useState(null);
    const [phoneNoBillingInfo, setPhoneNoBillingInfo] = useState(null);
    const [streetBillingInfo, setStreetBillingInfo] = useState(null);
    const [blockBillingInfo, setBlockBillingInfo] = useState(null);
    const [areaBillingInfo, setAreaBillingInfo] = useState(null);
    const [postalCodeBillingInfo, setPostalCodeBillingInfo] = useState(null);
    const [cityBillingInfo, setCityBillingInfo] = useState(null);
    const [countryBillingInfo, setCountryBillingInfo] = useState(null);
    const [emailBillingInfo, setEmailBillingInfo] = useState(null);

    const [firstNameShippingInfo, setFirstNameShippingInfo] = useState(null);
    const [lastNameShippingInfo, setLastNameShippingInfo] = useState(null);
    const [countryCodeShippingInfo, setCountryCodeShippingInfo] = useState(null);
    const [phoneNoShippingInfo, setPhoneNoShippingInfo] = useState(null);
    const [streetShippingInfo, setStreetShippingInfo] = useState(null);
    const [blockShippingInfo, setBlockShippingInfo] = useState(null);
    const [areaShippingInfo, setAreaShippingInfo] = useState(null);
    const [postalCodeShippingInfo, setPostalCodeShippingInfo] = useState(null);
    const [cityShippingInfo, setCityShippingInfo] = useState(null);
    const [countryShippingInfo, setCountryShippingInfo] = useState(null);

    const paymentMethod = [
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

    const subscriptions = [
        {
            label: '1 Month',
            value: 'ONE_MONTH',//.reduce((partialSum, a) => (partialSum ? partialSum : null) + (a.isOptimizer ? ), 0)
            numberOfMonths: 1
        },
        {
            label: '3 Months',
            value: 'THREE_MONTHS',
            numberOfMonths: 3
        },
        {
            label: '6 Months',
            value: 'SIX_MONTHS',
            numberOfMonths: 6
        },
        {
            label: '12 Months',
            value: 'TWELVE_MONTHS',
            numberOfMonths: 12
        }
    ];
    const [subscriptionValue, setSubscriptionValue] = useState("ONE_MONTH");
    const [paymentValue, setPaymentValue] = useState('');
    const [validationFailed, setValidationFailed] = useState(false);

    const establishConnection=()=>{
        CheckoutAddItemsPost(
        {
        userId: accountData.id,
        email: emailBillingInfo,
        items: [
            {
            id: propertyData.id,
            type: "PROPERTY"
            }
        ],
        totalPayableAmount: totalPayableAmount,
        billingInfo: {
            firstName: firstNameBillingInfo,
            lastName: lastNameBillingInfo,
            countryCode: countryCodeBillingInfo,
            phoneNo: phoneNoBillingInfo,
            street: streetBillingInfo,
            block: blockBillingInfo,
            area: areaBillingInfo,
            postalCode: postalCodeBillingInfo,
            city: cityBillingInfo,
            country: countryBillingInfo
        },
        deliveryInfo: {
            firstName: firstNameBillingInfo,
            lastName: lastNameBillingInfo,
            countryCode: countryCodeBillingInfo,
            phoneNo: phoneNoBillingInfo,
            street: streetBillingInfo,
            block: blockBillingInfo,
            area: areaBillingInfo,
            postalCode: postalCodeBillingInfo,
            city: cityBillingInfo,
            country: countryBillingInfo
        },
        paymentMethod: paymentValue,
        paymentDuration: subscriptionValue,
        paymentModel: "SUBSCRIPTION"
        }, 
        token, 
        res=>{
            console.log('CheckoutAddItemsPost: ', res);
            if(res?.code === 200){
                PaymentPost({checkoutId: res.data.checkoutId, redirectionUrl: 'https://app.aabshar.net/mosques'}, token, res1=>{
                    console.log('PaymentPost: ', res1);
                    if(res?.code === 200){
                        window.open(res1.data, '_blank');
                    }
                });
            }
        });
    }

    const validation=()=>{
        if(paymentValue && subscriptionValue && firstNameBillingInfo && lastNameBillingInfo && emailBillingInfo && streetBillingInfo){
            establishConnection();
            setValidationFailed(false);
        }else{
            setValidationFailed(true);
            showNotification({
                message: 'Data missing', 
                color: 'red', 
                id: 'formValidation'
            });
        }
    }

    useEffect(()=> {
        let quantity = propertyData.products.filter((product)=> product.isOptimizer).reduce((partialSum, a) => (partialSum ? partialSum : null) + (a.quantity), 0);
        setTotalPayableAmount((quantity <= 15 ? 1500 : quantity <= 25 ? 3500 : quantity <= 35 ? 5000 : quantity <= 40 ? 10000 : quantity > 40 ? 12500 : 0) * subscriptions.find((subscription)=> subscription.value === subscriptionValue).numberOfMonths);
    }, [subscriptionValue])
    return (
    <Modal opened={opened} onClose={onClose} size='auto' title="Subscription" centered>

        <Stack gap={'xl'}>
            <Stack>
                <Title order={5}>Billing information</Title>
                
                <TextInput
                label="First Name"
                placeholder="First Name"
                value={firstNameBillingInfo}
                error={!firstNameBillingInfo && validationFailed}
                withAsterisk
                onChange={(event) => setFirstNameBillingInfo(event.currentTarget.value)}
                />

                <TextInput
                label="Last Name"
                placeholder="Last Name"
                value={lastNameBillingInfo}
                error={!lastNameBillingInfo && validationFailed}
                withAsterisk
                onChange={(event) => setLastNameBillingInfo(event.currentTarget.value)}
                />

                <TextInput
                label="Email"
                placeholder="Email"
                value={emailBillingInfo}
                error={!emailBillingInfo && validationFailed}
                withAsterisk
                onChange={(event) => setEmailBillingInfo(event.currentTarget.value)}
                />

                <Grid>
                    <Grid.Col span={3}>
                        <TextInput
                        label="Country code"
                        placeholder="+92"
                        value={countryCodeBillingInfo}
                        error={!countryCodeBillingInfo && validationFailed}
                        withAsterisk
                        onChange={(event) => setCountryCodeBillingInfo(event.currentTarget.value)}
                        />
                    </Grid.Col>
                    <Grid.Col span={9}>
                        <TextInput
                        label="Phone number"
                        placeholder="XXXXXXXXXX"
                        value={phoneNoBillingInfo}
                        error={!phoneNoBillingInfo && validationFailed}
                        withAsterisk
                        onChange={(event) => setPhoneNoBillingInfo(event.currentTarget.value)}
                        />
                    </Grid.Col>
                </Grid>

                <TextInput
                label="Street"
                placeholder="Street"
                value={streetBillingInfo}
                error={!streetBillingInfo && validationFailed}
                withAsterisk
                onChange={(event) => setStreetBillingInfo(event.currentTarget.value)}
                />

                <TextInput
                label="Area"
                placeholder="Area"
                value={areaBillingInfo}
                error={!areaBillingInfo && validationFailed}
                withAsterisk
                onChange={(event) => setAreaBillingInfo(event.currentTarget.value)}
                />

                <TextInput
                label="Block"
                placeholder="Block"
                value={blockBillingInfo}
                error={!blockBillingInfo && validationFailed}
                withAsterisk
                onChange={(event) => setBlockBillingInfo(event.currentTarget.value)}
                />

                <TextInput
                label="Postal Code"
                placeholder="Postal Code"
                value={postalCodeBillingInfo}
                error={!postalCodeBillingInfo && validationFailed}
                withAsterisk
                onChange={(event) => setPostalCodeBillingInfo(event.currentTarget.value)}
                />

                <TextInput
                label="City"
                placeholder="City"
                value={cityBillingInfo}
                error={!cityBillingInfo && validationFailed}
                withAsterisk
                onChange={(event) => setCityBillingInfo(event.currentTarget.value)}
                />

                <TextInput
                label="Country"
                placeholder="Country"
                value={countryBillingInfo}
                error={!countryBillingInfo && validationFailed}
                withAsterisk
                onChange={(event) => setCountryBillingInfo(event.currentTarget.value)}
                />
            </Stack>
            <Stack>
                <Title order={5}>Payment information</Title>

                <Select
                data={paymentMethod} 
                value={paymentValue}
                label={'Select payment method'}
                placeholder={'Select payment method'} 
                withAsterisk
                error={!paymentValue && validationFailed}
                onChange={setPaymentValue}
                />

                <Select
                data={subscriptions} 
                value={subscriptionValue}
                label={'Select subscription'} 
                placeholder={'Select subscription'} 
                withAsterisk
                error={!subscriptionValue && validationFailed}
                onChange={setSubscriptionValue}
                />

                <NumberInput
                label="Total payable amount"
                value={totalPayableAmount}
                disabled
                prefix={'Rs. '}
                hideControls
                styles={{
                    input: {
                        opacity: 1
                    }
                }}
                />
            </Stack>
            <Group justify={'space-between'} style={{width: '100%'}}>
                <Button color={'gray'} onClick={()=> onClose()}>Close</Button>
                <Button onClick={()=> validation()}>Next</Button>
            </Group>
        </Stack>
    </Modal>
    );
}

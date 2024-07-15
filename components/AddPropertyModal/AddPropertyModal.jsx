import { useAppStore } from '@/lib/hooks';
import { Anchor, Button, Center, Divider, FileInput, Group, InputLabel, Loader, Modal, MultiSelect, NumberInput, Select, SimpleGrid, Stack, Text, Textarea, TextInput, useMantineColorScheme } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconTrashFilled } from '@tabler/icons-react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useGeolocated } from "react-geolocated";

import { ProductGet } from "../../api/fetchApis/Products";
import { PropertiesPost } from "../../api/fetchApis/Properties";

export function AddPropertyModal({opened, onClose, getProperties}) {
const store = useAppStore();
const { coords, isGeolocationAvailable, isGeolocationEnabled, getPosition } =
    useGeolocated({
        positionOptions: {
            enableHighAccuracy: true,
        },
        //userDecisionTimeout: 5000,
    });
const [name, setName] = useState(null);
const [nameError, setNameError] = useState(false);
const [typeOptions, setTypeOptions] = useState(['COMMERCIAL', 'MOSQUE', 'RESIDENTIAL']);
const [selectedType, setSelectedType] = useState(null);
const [typeError, setTypeError] = useState(false);
const [street, setStreet] = useState(null);
const [area, setArea] = useState(null);
const [phase, setPhase] = useState(null);
const [zipCode, setZipCode] = useState(null);
const [city, setCity] = useState(null);
const [country, setCountry] = useState('Pakistan');
const [sourceOfWaterOptions, setSourceOfWaterOptions] = useState(['LINE', 'BORE', 'TANKER']);
const [selectedSourceOfWater, setSelectedSourceOfWater] = useState(null);
const [estimatedConsumption, setEstimatedConsumption] = useState(null);
const [numberOfPeople, setNumberOfPeople] = useState(null);
const [waterBill, setWaterBill] = useState(0);
const [electricityBill, setElectricityBill] = useState(0);
const [pocName, setPocName] = useState(null);
const [pocContact, setPocContact] = useState(null);
const [pocCommitteeName, setPocCommitteeName] = useState(null);
const [pocCommitteeContact, setPocCommitteeContact] = useState(null);
const [pocDesignation, setPocDesignation] = useState(null);
const [remarks, setRemarks] = useState(null);
const [products, setProducts] = useState([]);
const [selectedProducts, setSelectedProducts] = useState([]);
const [newProducts, setNewProducts] = useState(null);
const {token} = store.getState().general;
const [loader, setLoader] = useState(false);
const [files, setFiles] = useState([]);


console.log('files: ', files);

const getProducts=()=>{
    ProductGet(null, token, res=>{
        if(res?.code === 200){
            setProducts(res.data.map((product)=> ({...product, value: product.id, label: `${product.category}, type: ${product.type}, making: ${product.making}`})));
        }
    });
}

const postProperty=()=>{
    setLoader(true);
    PropertiesPost({
        name,
        type: selectedType,
        street,
        area,
        phase,
        zipCode,
        city,
        country,
        latitude: coords.latitude,
        longitude: coords.longitude,
        sourceOfWater: [selectedSourceOfWater],
        estimatedConsumption,
        noOfPeople: numberOfPeople,
        waterBill,
        electricityBill,
        pocName,
        pocContact,
        pocCommitteeName,
        pocCommitteeContact,
        pocContactCountryCode: '+92',
        pocCommitteeCountryCode: '+92',
        pocDesignation,
        products: selectedProducts.map((selectedProduct)=> ({productId: selectedProduct.id, quantity: selectedProduct.quantity})),
        // .map((selectedProduct)=> {
        //     return{
        //         category: products.find((product)=> product.id === selectedProduct.id)?.category,
        //         type: products.find((product)=> product.id === selectedProduct.id)?.type,
        //         making: products.find((product)=> product.id === selectedProduct.id)?.making,
        //         quantity: selectedProduct.quantity,
        //     }
        // }),
        remarks
    }, token, res=>{
        if(res?.code === 200){
            showNotification({
                message: 'Property added successfully.',
                color: 'green'
            });
            getProperties();
            onClose();
        }
        setLoader(false);
    })
}

const validate=()=>{
    setNameError(name ? false : 'required');
    setTypeError(selectedType ? false : 'required');

    if(name && selectedType){
        return true;
    }else{
        return false;
    }
}

const renderSelectOption = ({ option }) => (
    <Group gap="sm">
      <Stack gap={10}>
        <Text size="sm">{option.category}</Text>
        <Group>
            <Text size="xs" opacity={0.5}>
            {option.type}
            </Text>
            <Text size="xs" opacity={0.5}>
            {option.making}
            </Text>
        </Group>
      </Stack>
    </Group>
  );

useEffect(() => {
    if(selectedType){
        setTypeError(false);
    }
}, [selectedType]);

useEffect(() => {
    getProducts();
}, []);
  return (
    <Modal opened={opened} size='lg' onClose={onClose} title="Add Property" centered>
        {loader ?
        <Center h={'100vh'} w={'100%'}>
            <Loader/>
        </Center>
        :
        <Stack>
            <Stack gap={8}>
                <Text size={'sm'} fw={600}>Images</Text>
                <FileInput clearable multiple value={files} onChange={setFiles} />
                {files.map((file)=> <img src={file.name} style={{width: '100px', height: '100px', objectFit: 'cover'}}/>)}

                
                <Text size={'sm'} fw={600}>Details</Text>
                <SimpleGrid cols={2}>
                {/* Name */}
                <TextInput
                label="Name"
                value={name}
                required
                error={nameError}
                onChange={(event) => {
                    setNameError(false);
                    setName(event.currentTarget.value);
                }}
                />

                {/* Type */}
                <Select
                label="Type"
                searchable
                data={typeOptions}
                value={selectedType}
                required
                error={typeError}
                onChange={setSelectedType}
                />

                {/* Street */}
                <TextInput
                label="Street"
                value={street}
                onChange={(event) => setStreet(event.currentTarget.value)}
                />

                {/* Area */}
                <TextInput
                label="Area"
                value={area}
                onChange={(event) => setArea(event.currentTarget.value)}
                />

                {/* Phase */}
                <TextInput
                label="Phase"
                value={phase}
                onChange={(event) => setPhase(event.currentTarget.value)}
                />

                {/* Zip Code */}
                <TextInput
                label="Zip code"
                value={zipCode}
                onChange={(event) => setZipCode(event.currentTarget.value)}
                />

                {/* City */}
                <TextInput
                label="City"
                value={city}
                onChange={(event) => setCity(event.currentTarget.value)}
                />

                {/* Country */}
                <TextInput
                label="Country"
                value={country}
                onChange={(event) => setCountry(event.currentTarget.value)}
                disabled={true}
                />

                {/* Location */}
                <Stack gap={0}>
                    <Text className='mantine-TextInput-label'>Location</Text>
                    <Group align={'flex-end'} style={{height: '100%'}}>
                        <Text size="sm">
                            {(coords?.latitude && coords?.longitude) ?
                            <Anchor style={{wordBreak: 'break-all'}} href={`http://maps.google.com/maps?q=${coords?.latitude},${coords?.longitude}`} target={'_blank'}>
                                {`http://maps.google.com/maps?q=${coords?.latitude},${coords?.longitude}`}
                            </Anchor>
                            :
                            <Anchor onClick={()=> getPosition()}>{'Enable location services'}</Anchor>}
                        </Text>
                    </Group>
                </Stack>

                {/* Source of Water */}
                <Select
                label="Source of water"
                searchable
                data={sourceOfWaterOptions}
                value={selectedSourceOfWater}
                onChange={setSelectedSourceOfWater}
                />
                

                {/* Estimated comsumption */}
                <NumberInput
                label="Estimated comsumption"
                value={estimatedConsumption}
                onChange={setEstimatedConsumption}
                hideControls
                />

                {/* Number of people */}
                <NumberInput
                label="Number of people"
                value={numberOfPeople}
                onChange={setNumberOfPeople}
                />

                {/* Water bill */}
                <NumberInput
                label="Water bill"
                value={waterBill}
                onChange={setWaterBill}
                prefix={'Rs. '}
                allowDecimal
                allowNegative={false}
                hideControls
                />

                {/* Electricity bill */}
                <NumberInput
                label="Electricity bill"
                value={electricityBill}
                onChange={setElectricityBill}
                prefix={'Rs. '}
                allowDecimal
                allowNegative={false}
                hideControls
                />

                {/* Point of contact name */}
                <TextInput
                label="Point of contact name"
                value={pocName}
                onChange={(event) => setPocName(event.currentTarget.value)}
                />

                {/* Point of contact number */}
                <TextInput
                label="Point of contact number"
                value={pocContact}
                onChange={(event) => setPocContact(event.currentTarget.value)}
                />

                {/* Point of contact designation */}
                <TextInput
                label="Point of contact designation"
                value={pocDesignation}
                onChange={(event) => setPocDesignation(event.currentTarget.value)}
                />

                {/* Point of committee name */}
                <TextInput
                label="Committee name"
                value={pocCommitteeName}
                onChange={(event) => setPocCommitteeName(event.currentTarget.value)}
                />

                {/* Point of committee number */}
                <TextInput
                label="Committee number"
                value={pocCommitteeContact}
                onChange={(event) => setPocCommitteeContact(event.currentTarget.value)}
                />
                </SimpleGrid>
            </Stack>
            {/* <Divider/> */}
            <Stack gap={8}>
                <Text size={'sm'} fw={600}>Products</Text>
                <SimpleGrid cols={2}>
                    {newProducts > 0 &&
                    [...Array(newProducts)].map((_, index)=>
                    <>
                        <Select
                        label={`Product ${index + 1}`}
                        searchable
                        data={products}
                        value={selectedProducts[index].id}
                        onChange={(value)=> setSelectedProducts(selectedProducts.map((selectedProduct, index_s_product)=> {
                            if(index === index_s_product){
                                return {
                                    ...selectedProduct,
                                    id: value
                                }
                            }else{
                                return selectedProduct;
                            }
                        }))}
                        renderOption={renderSelectOption}
                        />
                        <Group align={'flex-end'}>
                            <NumberInput
                            label="quantity"
                            value={selectedProducts[index].quantity}
                            onChange={(value)=> setSelectedProducts(selectedProducts.map((selectedProduct, index_s_product)=> {
                                if(index === index_s_product){
                                    return {
                                        ...selectedProduct,
                                        quantity: value,
                                    }
                                }else{
                                    return selectedProduct;
                                }
                            }))}
                            />
                            <Group 
                            onClick={()=> {
                                setNewProducts(newProducts - 1);
                                setSelectedProducts(selectedProducts.filter((selectedProduct, index_s_product)=> index !== index_s_product));
                            }} style={{marginBottom: '10px', cursor: 'pointer'}}>
                                <IconTrashFilled color='grey' size={'18px'}/>
                            </Group>
                        </Group>
                        
                    </>)}
                </SimpleGrid>
            </Stack>
            <Stack>
                <Group>
                    <Button 
                    onClick={()=> {
                        setNewProducts(newProducts + 1);
                        setSelectedProducts([...selectedProducts, {quantity: 0, id: null}])
                    }}>Add product</Button>
                </Group>
            </Stack>
            {/* <Divider/> */}
                
            <Stack>
                <Textarea
                label="Remarks"
                value={remarks}
                onChange={(event) => setRemarks(event.currentTarget.value)}
                />
            </Stack>
            
            <Group justify={'space-between'}>
                <Button style={{background: 'rgba(0, 0, 0, 0.39)'}} className='general-buttons' onClick={()=> onClose()}>
                    Cancel
                </Button>
                <Button className='general-buttons' onClick={()=> validate() && postProperty()}>
                    {'Add'}
                </Button>
            </Group>
            
        </Stack>}
    </Modal>
  );
}

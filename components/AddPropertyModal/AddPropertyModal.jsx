import { useAppStore } from '@/lib/hooks';
import { Anchor, Button, Center, Divider, FileInput, Group, InputLabel, Loader, Modal, MultiSelect, NumberInput, Select, SimpleGrid, Stack, Text, Textarea, TextInput, useMantineColorScheme } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconTrashFilled, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useGeolocated } from "react-geolocated";
import { Slide } from 'react-slideshow-image';

import { ProductGet } from "../../api/fetchApis/Products";
import { PropertiesPost, PropertyUploadImagePost } from "../../api/fetchApis/Properties";
import { compressImage } from '@/helpers/helpers';
import cities from '../../public/assets/cities.json';

const buttonStyle = {
    width: "30px",
    background: 'none',
    border: '0px'
};

const properties = {
    prevArrow: <button style={{ ...buttonStyle }}><IconChevronLeft color='white'/></button>,
    nextArrow: <button style={{ ...buttonStyle }}><IconChevronRight color='white'/></button>
}

export function AddPropertyModal({opened, onClose, getProperties}) {
const store = useAppStore();
const { coords, isGeolocationAvailable, isGeolocationEnabled, getPosition } =
    useGeolocated({
        positionOptions: {
            enableHighAccuracy: true,
        },
        suppressLocationOnMount: true
        //userDecisionTimeout: 5000,
    });
const [name, setName] = useState(null);
const [nameError, setNameError] = useState(false);
const [typeOptions, setTypeOptions] = useState(['COMMERCIAL', 'MOSQUE', 'RESIDENTIAL']);
const [selectedType, setSelectedType] = useState(null);
const [typeError, setTypeError] = useState(false);
const [street, setStreet] = useState(null);
const [streetError, setStreetError] = useState(null);
const [area, setArea] = useState(null);
const [areaError, setAreaError] = useState(null);
const [phase, setPhase] = useState(null);
const [phaseError, setPhaseError] = useState(null);
const [zipCode, setZipCode] = useState(null);
const [zipCodeError, setZipCodeError] = useState(null);
const [city, setCity] = useState(null);
const [cityError, setCityError] = useState(null);
const [country, setCountry] = useState('Pakistan');
const [sourceOfWaterOptions, setSourceOfWaterOptions] = useState(['LINE', 'BORE', 'TANKER']);
const [selectedSourceOfWater, setSelectedSourceOfWater] = useState([]);
const [sourceOfWaterError, setSourceOfWaterError] = useState(false);
const [estimatedConsumption, setEstimatedConsumption] = useState(null);
const [estimatedConsumptionError, setEstimatedConsumptionError] = useState(null);
const [numberOfPeople, setNumberOfPeople] = useState(null);
const [numberOfPeopleError, setNumberOfPeopleError] = useState(null);
const [waterBill, setWaterBill] = useState(null);
const [electricityBill, setElectricityBill] = useState(null);
const [pocName, setPocName] = useState(null);
const [pocContact, setPocContact] = useState(null);
const [pocContactError, setPocContactError] = useState(null);
const [pocCommitteeName, setPocCommitteeName] = useState(null);
const [pocCommitteeContact, setPocCommitteeContact] = useState(null);
const [pocCommitteeContactError, setPocCommitteeContactError] = useState(null);
const [pocDesignation, setPocDesignation] = useState(null);
const [remarks, setRemarks] = useState(null);
const [products, setProducts] = useState([]);
const [selectedProducts, setSelectedProducts] = useState([]);
const [newProducts, setNewProducts] = useState(null);
const {token} = store.getState().general;
const [loader, setLoader] = useState(false);
const [files, setFiles] = useState([]);


console.log('files: ', files);
console.log('cities: ', cities);

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
        latitude: coords?.latitude,
        longitude: coords?.longitude,
        sourceOfWater: selectedSourceOfWater,
        estimatedConsumption,
        noOfPeople: numberOfPeople,
        waterBill,
        electricityBill,
        pocName,
        pocContact: pocContact.toString(),
        pocCommitteeName,
        pocCommitteeContact: pocCommitteeContact.toString(),
        pocContactCountryCode: '+92',
        pocCommitteeCountryCode: '+92',
        pocDesignation,
        products: selectedProducts.map((selectedProduct)=> ({productId: selectedProduct.id, quantity: selectedProduct.quantity})),
        remarks
    }, token, res=>{
        if(res?.code === 200){
            showNotification({
                message: 'Property created successfully.',
                color: 'green'
            });
            if(files.length === 0){
                getProperties();
                onClose();
            }else{
                postPropertyImages(res?.data[0]?.id);
            }
        }else{
            setLoader(false);
        }

        if(files.length === 0){
            setLoader(false);
        }
    })
}



const postPropertyImages=(id)=>{
    const callApi=(data)=>{
        PropertyUploadImagePost(data, token, res=>{
            if(res?.code === 200){
                showNotification({
                    message: 'Property images uploaded successfully.',
                    color: 'green'
                });
                getProperties();
                onClose();
            }
            setLoader(false);
        })
    }
    let data = new FormData();
    data.append('propertyId', id);
    
    files.map((file, index)=> {
        if(file.size > 10000){
            compressImage(file).then(value=> {
                console.log('compressImage: ', value);
                data.append('images', value);
                if(files.length === (index+1)){
                    callApi(data);
                }
            });
        }else{
            data.append('images', file);
            if(files.length === (index+1)){
                callApi(data);
            }
        }
    });


    

}

const validate=()=>{
    // console.log('validate: ', '92'+pocContact.toString(), /^\\d{7,15}$/.test('92'+pocContact.toString()));
    setNameError(name ? false : 'required');
    setTypeError(selectedType ? false : 'required');
    setStreetError(street ? false : 'required');
    setAreaError(area ? false : 'required');
    setPhaseError(phase ? false : 'required');
    setZipCodeError(zipCode ? false : 'required');
    setCityError(city ? false : 'required');
    setSourceOfWaterError(selectedSourceOfWater.length > 0 ? false : 'required');
    setEstimatedConsumptionError(estimatedConsumption ? false : 'required');
    setNumberOfPeopleError(numberOfPeople ? false : 'required');
    // setPocCommitteeContactError(pocCommitteeContact.toString().length > 0 ? (/^\\d{7,15}$/.test('+92'+pocCommitteeContact.toString()) ? false : 'phone number incorrect') : false);
    // setPocContactError(pocContact.toString().length > 0 ? (/^\\d{7,15}$/.test('+92'+pocContact.toString()) ? false : 'phone number incorrect') : false);

    if(name && selectedType && street && area && phase && zipCode && city && selectedSourceOfWater.length > 0 && estimatedConsumption && numberOfPeople //&& (pocCommitteeContact ? /^\\d{7,15}$/.test(pocCommitteeContact) : true) && (pocContact ? /^\\d{7,15}$/.test(pocContact) : true)
    ){
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

// useEffect(() => {
//     validate();
// }, [name, selectedType, street, area, phase, zipCode, city, selectedSourceOfWater, estimatedConsumption, numberOfPeople]);

useEffect(() => {
    getProducts();
}, []);
  return (
    <Modal opened={opened} size='lg' onClose={onClose} title="Add property" centered>
        {loader ?
        <Center h={'100vh'} w={'100%'}>
            <Loader/>
        </Center>
        :
        <Stack>
            <Stack gap={8}>
                <Text size={'sm'} fw={600}>Images</Text>
                <FileInput clearable multiple value={files} onChange={setFiles} accept="image/png,image/jpeg" />
                {files.length > 0 &&
                <Group grow style={{background: 'grey', padding: '10px', borderRadius: '4px'}}>
                    <Slide {...properties}>
                        {files.map((file)=> {
                            let url = URL.createObjectURL(file);
                            return(
                                <Group justify={'center'}>
                                    <img src={url} style={{borderRadius: '2px', height: '237px', objectFit: 'cover'}} />
                                </Group>
                            );
                        })}
                    </Slide>
                </Group>}
                
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
                required
                error={streetError}
                value={street}
                onChange={(event) => setStreet(event.currentTarget.value)}
                />

                {/* Area */}
                <TextInput
                label="Area"
                value={area}
                required
                error={areaError}
                onChange={(event) => setArea(event.currentTarget.value)}
                />

                {/* Phase */}
                <TextInput
                label="Phase"
                value={phase}
                required
                error={phaseError}
                onChange={(event) => setPhase(event.currentTarget.value)}
                />

                {/* Zip Code */}
                <TextInput
                label="Zip code"
                value={zipCode}
                required
                error={zipCodeError}
                onChange={(event) => setZipCode(event.currentTarget.value)}
                />

                {/* City */}
                <Select
                label="City"
                value={city}
                searchable
                data={cities.map((city)=> ({label: city.name, value: city.name}))}
                required
                error={cityError}
                onChange={setCity}
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
                <MultiSelect
                label="Source of water"
                searchable
                required
                error={sourceOfWaterError}
                data={sourceOfWaterOptions}
                value={selectedSourceOfWater}
                onChange={setSelectedSourceOfWater}
                />
                

                {/* Estimated comsumption */}
                <NumberInput
                label="Estimated comsumption"
                value={estimatedConsumption}
                required
                error={estimatedConsumptionError}
                onChange={setEstimatedConsumption}
                hideControls
                />

                {/* Number of people */}
                <NumberInput
                label="Number of people"
                value={numberOfPeople}
                required
                error={numberOfPeopleError}
                onChange={setNumberOfPeople}
                />

                {/* Water bill */}
                <NumberInput
                label="Water bill"
                value={waterBill}
                onChange={setWaterBill}
                prefix={'Rs. '}
                placeholder={'Rs. 0'}
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
                placeholder={'Rs. 0'}
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
                <NumberInput
                label="Point of contact number"
                value={pocContact}
                prefix={'+92-'}
                placeholder={'+92-XXXXXXXXXX'}
                error={pocContactError}
                onChange={setPocContact}
                hideControls
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
                <NumberInput
                label="Committee number"
                value={pocCommitteeContact}
                prefix={'+92-'}
                placeholder={'+92-XXXXXXXXXX'}
                error={pocCommitteeContactError}
                onChange={setPocCommitteeContact}
                hideControls
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

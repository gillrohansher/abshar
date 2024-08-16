import { useAppStore } from '@/lib/hooks';
import { ActionIcon, Anchor, AspectRatio, Badge, Button, Center, Divider, FileInput, Grid, Group, InputLabel, Loader, Modal, MultiSelect, NumberInput, Overlay, Select, SimpleGrid, Stack, Text, Textarea, TextInput, useMantineColorScheme } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconTrashFilled, IconChevronLeft, IconChevronRight, IconReplace } from '@tabler/icons-react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useGeolocated } from "react-geolocated";
import { Slide } from 'react-slideshow-image';

import { ProductGet } from "../../api/fetchApis/Products";
import { PropertiesPost, PropertiesPut, PropertyDeleteImages, PropertyUploadImagePost } from "../../api/fetchApis/Properties";
import { compressImage } from '@/helpers/helpers';
import cities from '../../public/assets/cities.json';
import { AddFeatureImageModal } from '../AddFeatureImageModal/AddFeatureImageModal';

const buttonStyle = {
    width: "30px",
    background: 'none',
    border: '0px'
};

const properties = {
    prevArrow: <button style={{ ...buttonStyle }}><IconChevronLeft color='white'/></button>,
    nextArrow: <button style={{ ...buttonStyle }}><IconChevronRight color='white'/></button>
}

export function AddPropertyModal({opened, onClose, getProperties, users, edit, type, isProperties}) {
const store = useAppStore();
const { coords, isGeolocationAvailable, isGeolocationEnabled, getPosition } =
    useGeolocated({
        positionOptions: {
            enableHighAccuracy: true,
        },
        suppressLocationOnMount: true
        //userDecisionTimeout: 5000,
    });
const [name, setName] = useState(edit ? edit.name : null);
const [nameError, setNameError] = useState(false);
const [typeOptions, setTypeOptions] = useState(type ? ['COMMERCIAL', 'MOSQUE', 'RESIDENTIAL'] : ['COMMERCIAL', 'RESIDENTIAL']);
const [selectedType, setSelectedType] = useState(type ? type : (edit ? edit.type : null));
const [typeError, setTypeError] = useState(false);
const [street, setStreet] = useState(edit ? edit.street : null);
const [streetError, setStreetError] = useState(null);
const [area, setArea] = useState(edit ? edit.area : null);
const [areaError, setAreaError] = useState(null);
const [phase, setPhase] = useState(edit ? edit.phase : null);
const [phaseError, setPhaseError] = useState(null);
const [zipCode, setZipCode] = useState(edit ? edit.zipCode : null);
const [zipCodeError, setZipCodeError] = useState(null);
const [city, setCity] = useState(edit ? edit.city : null);
const [cityError, setCityError] = useState(null);
const [country, setCountry] = useState('Pakistan');
const [sourceOfWaterOptions, setSourceOfWaterOptions] = useState(['LINE', 'BORE', 'TANKER']);
const [selectedSourceOfWater, setSelectedSourceOfWater] = useState(edit ? edit.sourceOfWater : []);
const [sourceOfWaterError, setSourceOfWaterError] = useState(false);
const [estimatedConsumption, setEstimatedConsumption] = useState(edit ? edit.estimatedConsumption : null);
const [estimatedConsumptionError, setEstimatedConsumptionError] = useState(null);
const [numberOfPeople, setNumberOfPeople] = useState(edit ? edit.noOfPeople : null);
const [numberOfPeopleError, setNumberOfPeopleError] = useState(null);
const [waterBill, setWaterBill] = useState(edit ? edit.waterBill : null);
const [electricityBill, setElectricityBill] = useState(edit ? edit.electricityBill : null);
const [pocName, setPocName] = useState(edit ? edit.pocName : null);
const [pocContact, setPocContact] = useState(edit ? edit.pocContact : null);
const [pocContactError, setPocContactError] = useState(null);
const [pocCommitteeName, setPocCommitteeName] = useState(edit ? edit.pocCommitteeName : null);
const [pocCommitteeContact, setPocCommitteeContact] = useState(edit ? edit.pocCommitteeContact : null);
const [pocCommitteeContactError, setPocCommitteeContactError] = useState(null);
const [pocDesignation, setPocDesignation] = useState(edit ? edit.pocDesignation : null);
const [remarks, setRemarks] = useState(edit ? edit.remarks : null);
const [products, setProducts] = useState([]);
const [selectedProducts, setSelectedProducts] = useState(edit ? edit.products : []);
const [newProducts, setNewProducts] = useState(null);
const {token, accountData} = store.getState().general;
const [loader, setLoader] = useState(false);
const [files, setFiles] = useState(edit ? edit?.image?.otherImages : []);
const [firstLoadOfData, setFirstLoadOfData] = useState(true);
const [selectedUser, setSelectedUser] = useState(edit ? edit.requestedUserInfo?.id : null);
const [userError, setUserError] = useState(null);
const [selectedSurveyor, setSelectedSurveyor] = useState(edit ? edit.assignedUserInfo?.id : accountData.type === 'SURVEYOR' ? accountData.id : null);
const [surveyorError, setSurveyorError] = useState(null);
const [openAddFeatureImageModal, setOpenAddFeatureImageModal] = useState(false);


console.log('files: ', files);
console.log('cities: ', cities);

console.log('users: ', users);

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
        pocContact: pocContact?.toString(),
        pocCommitteeName,
        pocCommitteeContact: pocCommitteeContact?.toString(),
        pocContactCountryCode: '+92',
        pocCommitteeCountryCode: '+92',
        pocDesignation,
        products: selectedProducts.map((selectedProduct)=> ({productId: selectedProduct.id, quantity: selectedProduct.quantity})),
        requestedId: accountData.type === 'CLIENT' ? accountData.id : selectedUser,
        assignedId: accountData.type === 'CLIENT' ? null : selectedSurveyor,
        remarks
    }, token, res=>{
        if(res?.code === 200){
            showNotification({
                message: 'Property created successfully.',
                color: 'green'
            });
            if(files.length === 0 || files.find((file)=> file.id === undefined) === undefined){
                getProperties();
                onClose();
            }else {
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

const putProperty=()=>{
    setLoader(true);
    PropertiesPut({
        propertyId: edit.id,
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
        pocContact: pocContact?.toString(),
        pocCommitteeName,
        pocCommitteeContact: pocCommitteeContact?.toString(),
        pocContactCountryCode: '+92',
        pocCommitteeCountryCode: '+92',
        pocDesignation,
        products: selectedProducts.map((selectedProduct)=> ({productId: selectedProduct.id, quantity: selectedProduct.quantity})),
        requestedId: selectedUser,
        assignedId: selectedSurveyor,
        remarks
    }, token, res=>{
        if(res?.code === 200){
            showNotification({
                message: 'Property updated successfully.',
                color: 'green'
            });
            if(files.length === 0 || files.find((file)=> file.id === undefined) === undefined){
                getProperties();
                onClose();
            }else {
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
        if(file.id === undefined){
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
        }
    });


    

}

const deletePropertyImage=(propertyId, imageId)=>{
    PropertyDeleteImages(propertyId, imageId, token, res=>{
        if(res?.code === 200){
            showNotification({
                message: 'Property image deleted successfully.',
                color: 'green'
            });
            getProperties();
        }
    })
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
    accountData.type !== 'CLIENT' && setUserError(selectedUser ? false : 'required');
    accountData.type !== 'CLIENT' && setSurveyorError(selectedSurveyor ? false : 'required');
    // setSourceOfWaterError(selectedSourceOfWater.length > 0 ? false : 'required');
    // setEstimatedConsumptionError(estimatedConsumption ? false : 'required');
    // setNumberOfPeopleError(numberOfPeople ? false : 'required');

    // setPocCommitteeContactError(pocCommitteeContact.toString().length > 0 ? (/^\\d{7,15}$/.test('+92'+pocCommitteeContact.toString()) ? false : 'phone number incorrect') : false);
    // setPocContactError(pocContact.toString().length > 0 ? (/^\\d{7,15}$/.test('+92'+pocContact.toString()) ? false : 'phone number incorrect') : false);
    setFirstLoadOfData(false);
    if(name && selectedType && street && area && phase && zipCode && city && (accountData.type !== 'CLIENT' ? selectedUser : true) && (accountData.type !== 'CLIENT' ? selectedSurveyor : true)
        //&& selectedSourceOfWater.length > 0 && estimatedConsumption && numberOfPeople //&& (pocCommitteeContact ? /^\\d{7,15}$/.test(pocCommitteeContact) : true) && (pocContact ? /^\\d{7,15}$/.test(pocContact) : true)
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

useEffect(() => {
    if(firstLoadOfData === false){
        validate();
    }
}, [name, selectedType, street, area, phase, zipCode, city, selectedUser, selectedSurveyor]);

useEffect(() => {
    setFiles(edit ? edit?.image?.otherImages : []);
}, [edit]);

useEffect(() => {
    getProducts();
}, []);
  return (
    <Modal opened={opened} size='lg' onClose={onClose} title={accountData.type === 'CLIENT' ? (type ? "Request mosque survey" : "Request property survey") : (edit ? "Edit property" : "Add property")} centered>
        {loader ?
        <Center h={'100vh'} w={'100%'}>
            <Loader/>
        </Center>
        :
        <Stack>
            <Stack gap={8}>
                {/* {(accountData.type === 'ADMIN' && edit && edit?.image?.featuredImage) &&
                <>
                    <Text size={'sm'} fw={600}>Featured image</Text>
                    <FileInput clearable={!edit} multiple value={edit?.image?.featuredImage} //onChange={setFiles} 
                    accept="image/png,image/jpeg" />
                    {edit?.image?.featuredImage?.path &&
                    <Group grow style={{background: 'grey', padding: '10px', borderRadius: '4px'}}>    
                        <Group justify={'center'}>
                            <div style={{position: 'relative'}}>
                                <img src={edit?.image?.featuredImage?.path} style={{borderRadius: '2px', height: '237px', objectFit: 'cover'}} />
                            </div>
                        </Group>
                    </Group>}
                </>} */}
                {accountData.type !== 'CLIENT' &&
                <>
                    <Text size={'sm'} fw={600}>Images</Text>
                    <FileInput clearable={!edit} multiple value={files} onChange={(newFiles)=> files.length === 0 ? setFiles(newFiles) : setFiles([...files, ...newFiles])} accept="image/png,image/jpeg" />
                    {/* {files.length > 0 &&
                    <Group grow style={{background: 'grey', padding: '10px', borderRadius: '4px'}}>
                        <Slide {...properties}>
                            {files.map((file)=> {
                                let url = file?.id !== undefined ? file.path : URL.createObjectURL(file);
                                return(
                                    <Group justify={'center'}>
                                        {file?.id !== undefined ?
                                        <div style={{position: 'relative'}}>
                                            <img src={url} style={{borderRadius: '2px', height: '237px', objectFit: 'cover'}} />
                                            {edit && file?.id &&
                                            <div style={{position: 'absolute', top: 5, right: 5}}>
                                                <ActionIcon color={'red'} onClick={()=> deletePropertyImage(edit?.id, file?.id)}>
                                                    <IconTrashFilled style={{width: '70%'}}/>
                                                </ActionIcon>
                                            </div>}
                                        </div>
                                        :
                                        <img src={url} style={{borderRadius: '2px', height: '237px', objectFit: 'cover'}} />
                                        }
                                    </Group>
                                );
                            })}
                        </Slide>
                    </Group>} */}
                    {(files.length > 0 || edit?.image?.featuredImage) &&
                    <Group grow style={{background: 'grey', padding: '10px', borderRadius: '4px'}}>
                        <SimpleGrid cols={3}>
                            {edit?.image?.featuredImage &&
                                <Group justify={'center'}>
                                    <div style={{position: 'relative'}}>
                                        <Group style={{borderRadius: '2px', height: '200px', backgroundColor: 'black'}} align='center' justify={'center'}>
                                            <img src={edit?.image?.featuredImage.path} style={{maxHeight: '200px', minWidth: '100px', maxWidth: '150px', objectFit: 'cover'}} />
                                        </Group>
                                        {<div style={{position: 'absolute', top: 5, right: 5}}>
                                            <ActionIcon  onClick={()=> setOpenAddFeatureImageModal(true)}>
                                                <IconReplace style={{width: '70%'}}/>
                                            </ActionIcon>
                                        </div>}
                                        {<div style={{position: 'absolute', top: 5, left: 5}}>
                                            <Badge>Featured</Badge>
                                        </div>}
                                    </div>
                                </Group>
                            }
                            { files.map((file)=> {
                                let url = file?.id !== undefined ? file.path : URL.createObjectURL(file);
                                return(
                                    <Group justify={'center'}>
                                        <div style={{position: 'relative'}}>
                                            <Group style={{borderRadius: '2px', height: '200px', backgroundColor: 'black'}} align='center' justify={'center'}>
                                                <img src={url} style={{borderRadius: '2px', maxHeight: '200px', minWidth: '100px', maxWidth: '150px', objectFit: 'cover'}} />
                                            </Group>
                                            {<div style={{position: 'absolute', top: 5, right: 5}}>
                                                <ActionIcon color={'red'} onClick={()=> file.id !== undefined ? deletePropertyImage(edit?.id, file?.id) : setFiles(files.filter((filterFile)=> filterFile.name !== file.name))}>
                                                    <IconTrashFilled style={{width: '70%'}}/>
                                                </ActionIcon>
                                            </div>}
                                        </div>
                                    </Group>
                                );
                            })}
                        </SimpleGrid>
                    </Group>}
                </>}
                
                
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

                {/* Requested from user */}
                {accountData.type !== 'CLIENT' &&
                <Select
                label="Requested from user"
                searchable
                data={users.filter((user)=> user.type === 'CLIENT')}
                value={selectedUser}
                required
                error={userError}
                onChange={setSelectedUser}
                />}

                {/* Assigned to surveyor */}
                {(accountData.type !== 'CLIENT' && accountData.type !== 'SURVEYOR') &&
                <Select
                label="Assigned to surveyor"
                searchable
                data={users.filter((user)=> user.type === 'SURVEYOR')}
                value={selectedSurveyor}
                required
                error={surveyorError}
                onChange={setSelectedSurveyor}
                />}

                {/* Type */}
                <Select
                label="Type"
                searchable
                data={typeOptions}
                value={selectedType}
                required
                error={typeError}
                disabled={type}
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
                {accountData.type !== 'CLIENT' &&
                <>
                    {/* Source of Water */}
                    <MultiSelect
                    label="Source of water"
                    searchable
                    error={sourceOfWaterError}
                    data={sourceOfWaterOptions}
                    value={selectedSourceOfWater}
                    onChange={setSelectedSourceOfWater}
                    />
                    

                    {/* Estimated comsumption */}
                    <NumberInput
                    label="Estimated comsumption"
                    value={estimatedConsumption}
                    error={estimatedConsumptionError}
                    onChange={setEstimatedConsumption}
                    suffix={' Liters'}
                    placeholder={'0 Liters'}
                    hideControls
                    />

                    {/* Number of people */}
                    <NumberInput
                    label="Number of people"
                    value={numberOfPeople}
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
                    {!isProperties && <TextInput
                    label="Committee name"
                    value={pocCommitteeName}
                    onChange={(event) => setPocCommitteeName(event.currentTarget.value)}
                    />}

                    {/* Point of committee number */}
                    {!isProperties && <NumberInput
                    label="Committee number"
                    value={pocCommitteeContact}
                    prefix={'+92-'}
                    placeholder={'+92-XXXXXXXXXX'}
                    error={pocCommitteeContactError}
                    onChange={setPocCommitteeContact}
                    hideControls
                    />}
                </>}
                </SimpleGrid>
            </Stack>
            {accountData.type !== 'CLIENT' &&
            <>
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
            </>}
            
            <Group justify={'space-between'}>
                <Button style={{background: 'rgba(0, 0, 0, 0.39)'}} className='general-buttons' onClick={()=> onClose()}>
                    Cancel
                </Button>
                <Button className='general-buttons' onClick={()=> validate() ? (edit ? putProperty() : postProperty()) : showNotification({message: 'Please first fill in required information to save.', color: 'red', id: 'informationMissing'})}>
                    {edit ? 'Save' : 'Add'}
                </Button>
            </Group>
            
        </Stack>}
        {openAddFeatureImageModal &&
        <AddFeatureImageModal
        opened={openAddFeatureImageModal}
        onClose={()=> setOpenAddFeatureImageModal(false)}
        propertyId={edit?.id}
        editFeatureImage={edit?.image?.featuredImage}
        getProperties={()=> getProperties()}
        />}
    </Modal>
  );
}

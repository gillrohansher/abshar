import { useAppStore } from '@/lib/hooks';
import { ActionIcon, Anchor, AspectRatio, Badge, Button, Center, Divider, FileInput, Grid, Group, InputLabel, Loader, Modal, MultiSelect, NumberInput, Overlay, Select, SimpleGrid, Stack, Stepper, Text, Textarea, TextInput, useMantineColorScheme } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconTrashFilled, IconChevronLeft, IconChevronRight, IconReplace } from '@tabler/icons-react';
import { useEffect, useRef } from 'react';
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
console.log('edit: ', edit, type, selectedType, typeOptions);
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

const [frontGateImage, setFrontGateImage] = useState(null);
const [insideGateImage, setInsideGateImage] = useState(null);
const [wuzuAreaImage, setWuzuAreaImage] = useState(null);
const [washroomAreaImage, setWashroomAreaImage] = useState(null);

const [active, setActive] = useState(0);
const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));


console.log('files: ', files);
console.log('cities: ', cities);

console.log('users: ', users);

console.log('type: ', type);

const getProducts=()=>{
    ProductGet(null, token, res=>{
        if(res?.code === 200){
            setProducts(res.data.map((product)=> ({...product, value: product.id, label: `${product.category}, type: ${product.type}, making: ${product.making}`})));
            setNewProducts(newProducts + 1);
            setSelectedProducts([...selectedProducts, {quantity: 1, id: res.data.find((product)=> product.category === 'TAP')?.id}]);
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
            if(files.length === 0 || files.find((file)=> file.id === undefined) === undefined || (frontGateImage !== null || insideGateImage !== null || wuzuAreaImage !== null || washroomAreaImage !== null)){
                getProperties();
                onClose();
            }else {
                setFiles([...frontGateImage, ...insideGateImage, ...wuzuAreaImage, ...washroomAreaImage]);
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
            onClose();
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

const validate=(validateOnNext=false)=>{
    // console.log('validate: ', '92'+pocContact.toString(), /^\\d{7,15}$/.test('92'+pocContact.toString()));
    if(validateOnNext && active === 1){
        setNameError(name ? false : 'required');
        setTypeError(selectedType ? false : 'required');
        setStreetError(street ? false : 'required');
        setAreaError(area ? false : 'required');
        setPhaseError(phase ? false : 'required');
        setZipCodeError(zipCode ? false : 'required');
        setCityError(city ? false : 'required');
        accountData.type !== 'CLIENT' && setUserError(selectedUser ? false : 'required');
        accountData.type !== 'CLIENT' && setSurveyorError(selectedSurveyor ? false : 'required');
    }
    // setSourceOfWaterError(selectedSourceOfWater.length > 0 ? false : 'required');
    // setEstimatedConsumptionError(estimatedConsumption ? false : 'required');
    // setNumberOfPeopleError(numberOfPeople ? false : 'required');

    // setPocCommitteeContactError(pocCommitteeContact.toString().length > 0 ? (/^\\d{7,15}$/.test('+92'+pocCommitteeContact.toString()) ? false : 'phone number incorrect') : false);
    // setPocContactError(pocContact.toString().length > 0 ? (/^\\d{7,15}$/.test('+92'+pocContact.toString()) ? false : 'phone number incorrect') : false);
    setFirstLoadOfData(false);
    if(active === 0){
        if(edit ? files.length > 0 : (frontGateImage || insideGateImage || wuzuAreaImage || washroomAreaImage)){
            return true;
        }else{
            validateOnNext && showNotification({message: 'Please select atleast one image to move forward.', color: 'red', id: 'informationMissing'});
            return false;
        }
    }

    if(active === 1){
        if(name && selectedType && street && area && phase && zipCode && city && (accountData.type !== 'CLIENT' ? selectedUser : true) && (accountData.type !== 'CLIENT' ? selectedSurveyor : true)){
            return true;
        }else{
            validateOnNext && showNotification({message: 'Please fill in required information to move forward.', color: 'red', id: 'informationMissing'});
            return false;
        }
    }

    if(active === 2){
        console.log('products.length: ', products.length);
        if(selectedProducts.length > 0){
            return true;
        }else{
            validateOnNext && showNotification({message: 'Please select atleast one product to move forward.', color: 'red', id: 'informationMissing'});
            return false;
        }
    }

    if(active === 3){
        return true;
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

    console.log('selectedProducts: ', selectedProducts);

    const getFilesUrlByIndex=(index)=> {
        let url = files[index]?.id !== undefined ? files[index]?.path : URL.createObjectURL(files[index]);
        return url;
    }
    const renderImageFileByIndex=(file, url)=>{
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
        )
    }

    const renderImage=(imageFile)=>{
        let url = URL.createObjectURL(imageFile);
        return(
        <Group grow style={{background: 'grey', padding: '10px', borderRadius: '4px', marginTop: '20px'}}>
            <Group justify={'center'}>
                <div style={{position: 'relative'}}>
                    <Group style={{borderRadius: '2px', height: '200px', backgroundColor: 'black'}} align='center' justify={'center'}>
                        <img src={url} style={{borderRadius: '2px', maxHeight: '200px', minWidth: '100px', maxWidth: '150px', objectFit: 'cover'}} />
                    </Group>
                </div>
            </Group>
        </Group>
        )
    }
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

                <Stepper active={active} onStepClick={setActive} allowNextStepsSelect={false}>
                    <Stepper.Step label="First step" description="Select images">
                        {<>
                            <Text size={'sm'} fw={600}>Images</Text>
                            {selectedType !== '' ?
                            <>
                                {edit ?
                                <FileInput style={{marginTop: '20px'}} clearable={!edit} multiple value={files} onChange={(newFiles)=> files.length === 0 ? setFiles(newFiles) : setFiles([...files, ...newFiles])} accept="image/png,image/jpeg" />
                                :
                                <>
                                    <FileInput label={'Front gate'} style={{marginTop: '20px'}} styles={{section: {width: 'fit-content', marginTop: '20px'}}} clearable={!edit} value={frontGateImage} onChange={(newFile)=> setFrontGateImage(newFile)} accept="image/png,image/jpeg"/>
                                    {frontGateImage && renderImage(frontGateImage)}
                                    <FileInput label={'Inside gate'} style={{marginTop: '20px'}} clearable={!edit} value={insideGateImage} onChange={(newFile)=> setInsideGateImage(newFile)} accept="image/png,image/jpeg" />
                                    {insideGateImage && renderImage(insideGateImage)}
                                    <FileInput label={'Wuzu Area'} style={{marginTop: '20px'}} clearable={!edit} value={wuzuAreaImage} onChange={(newFile)=> setWuzuAreaImage(newFile)} accept="image/png,image/jpeg" />
                                    {wuzuAreaImage && renderImage(wuzuAreaImage)}
                                    <FileInput label={'Washroom Area'} style={{marginTop: '20px'}} clearable={!edit} value={washroomAreaImage} onChange={(newFile)=> setWashroomAreaImage(newFile)} accept="image/png,image/jpeg" />
                                    {washroomAreaImage && renderImage(washroomAreaImage)}
                                </>}
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
                                        {files.map((file)=> {
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
                            </>
                            :
                            <>
                                <SimpleGrid style={{marginTop: '20px'}} cols={2}>
                                    <Group 
                                    className='image-card' 
                                    justify={'center'} 
                                    align='center'
                                    onClick={()=> {
                                        var selectImage= document.getElementById('select-image');
                                        selectImage.click();
                                    }}>
                                        {(files[0] && getFilesUrlByIndex(0))
                                        ?
                                        renderImageFileByIndex(files[0], getFilesUrlByIndex(0))
                                        :
                                        <>
                                            <span>Front Gate</span>
                                            <FileInput id='select-image' style={{visibility: 'hidden', position: 'absolute'}} clearable={!edit} multiple value={files} onChange={(newFiles)=> files.length === 0 ? setFiles(newFiles) : setFiles([...files, ...newFiles])} accept="image/png,image/jpeg" />
                                        </>}
                                    </Group>
                                    <Group 
                                    className='image-card' 
                                    justify={'center'} 
                                    align='center'
                                    onClick={()=> {
                                        var selectImage= document.getElementById('select-image');
                                        selectImage.click();
                                    }}>
                                        {(files[1] && getFilesUrlByIndex(1))
                                        ?
                                        renderImageFileByIndex(files[1], getFilesUrlByIndex(1))
                                        :
                                        <>
                                            <span>Inside Gate</span>
                                            <FileInput id='select-image' style={{visibility: 'hidden', position: 'absolute'}} clearable={!edit} multiple value={files} onChange={(newFiles)=> files.length === 0 ? setFiles(newFiles) : setFiles([...files, ...newFiles])} accept="image/png,image/jpeg" />
                                        </>}
                                    </Group>
                                    <Group 
                                    className='image-card' 
                                    justify={'center'} 
                                    align='center'
                                    onClick={()=> {
                                        var selectImage= document.getElementById('select-image');
                                        selectImage.click();
                                    }}>
                                        {(files[2] && getFilesUrlByIndex(2))
                                        ?
                                        renderImageFileByIndex(files[2], getFilesUrlByIndex(2))
                                        :
                                        <>
                                            <span>Wuzu Area</span>
                                            <FileInput id='select-image' style={{visibility: 'hidden', position: 'absolute'}} clearable={!edit} multiple value={files} onChange={(newFiles)=> files.length === 0 ? setFiles(newFiles) : setFiles([...files, ...newFiles])} accept="image/png,image/jpeg" />
                                        </>}
                                    </Group>
                                    <Group 
                                    className='image-card' 
                                    justify={'center'} 
                                    align='center'
                                    onClick={()=> {
                                        var selectImage= document.getElementById('select-image');
                                        selectImage.click();
                                    }}>
                                        {(files[3] && getFilesUrlByIndex(3))
                                        ?
                                        renderImageFileByIndex(files[3], getFilesUrlByIndex(3))
                                        :
                                        <>
                                            <span>Washroom Area</span>
                                            <FileInput id='select-image' style={{visibility: 'hidden', position: 'absolute'}} clearable={!edit} multiple value={files} onChange={(newFiles)=> files.length === 0 ? setFiles(newFiles) : setFiles([...files, ...newFiles])} accept="image/png,image/jpeg" />
                                        </>}
                                    </Group>
                                </SimpleGrid>
                                <SimpleGrid cols={1}>
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
                                    </Group>}
                                </SimpleGrid>
                            </>}
                        </>}
                    </Stepper.Step>
                    <Stepper.Step label="Second step" description="Property details">
                        <Text size={'sm'} fw={600}>Details</Text>
                        <Stack>
                            <SimpleGrid cols={2}>
                            {/* Name */}
                            <TextInput
                            label="Buliding name"
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
                            </>}
                            {(accountData.type !== 'CLIENT' || (accountData.type === 'CLIENT' && type === 'MOSQUE')) && <>

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
                            <Group style={{width: '100%'}}>
                                <Textarea
                                label="Remarks"
                                value={remarks}
                                style={{width: '100%'}}
                                onChange={(event) => setRemarks(event.currentTarget.value)}
                                />
                            </Group>
                        </Stack>
                    </Stepper.Step>
                    <Stepper.Step label="Final step" description="Products">
                        <Stack gap={8}>
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
                                            onChange={(value)=> {
                                                if(newProducts > 1 && selectedProducts.length > 1){
                                                    setSelectedProducts(selectedProducts.map((selectedProduct, index_s_product)=> {
                                                        if(index === index_s_product){
                                                            return {
                                                                ...selectedProduct,
                                                                quantity: value,
                                                            }
                                                        }else{
                                                            return selectedProduct;
                                                        }
                                                    }));
                                                }else{
                                                    if(value > 0){
                                                        setSelectedProducts(selectedProducts.map((selectedProduct, index_s_product)=> {
                                                            if(index === index_s_product){
                                                                return {
                                                                    ...selectedProduct,
                                                                    quantity: value,
                                                                }
                                                            }else{
                                                                return selectedProduct;
                                                            }
                                                        }));
                                                    }else{
                                                        showNotification({message: 'Atleast one product is required to move forward.', color: 'red', id: 'informationMissing'});
                                                    }
                                                }
                                            }}
                                            min={1}
                                            />
                                            <Group 
                                            onClick={()=> {
                                                if(newProducts > 1 && selectedProducts.length > 1){
                                                    setNewProducts(newProducts - 1);
                                                    setSelectedProducts(selectedProducts.filter((selectedProduct, index_s_product)=> index !== index_s_product));
                                                }else{
                                                    showNotification({message: 'Atleast one product is required to move forward.', color: 'red', id: 'informationMissing'});
                                                }
                                            }} style={{marginBottom: '10px', cursor: 'pointer', opacity: (newProducts < 2 && selectedProducts.length < 2) ? 0.5 : 1}}>
                                                <IconTrashFilled color='grey' size={'18px'} style={{opacity: (newProducts < 2 && selectedProducts.length < 2) ? 0.5 : 1 }}/>
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
                                        setSelectedProducts([...selectedProducts, {quantity: 1, id: products[0].value}])
                                    }}>Add product</Button>
                                </Group>
                            </Stack>
                            {/* <Divider/> */}
                        </Stack>
                    </Stepper.Step>
                    <Stepper.Completed>
                        Completed, click back button to get to previous step
                    </Stepper.Completed>
                </Stepper>

                <Group justify="space-between" mt="xl">
                    <Button variant="default" onClick={()=> active === 0 ? onClose() : prevStep()}>{active === 0 ? 'Cancel' : 'Back'}</Button>
                    <Button onClick={()=> active === 3 ? (validate(true) ? (edit ? putProperty() : postProperty()) : showNotification({message: 'Please first fill in required information to save.', color: 'red', id: 'informationMissing'})) : validate(true) && nextStep()}>{active === 3 ? edit ? 'Save' : 'Add' : 'Next step'}</Button>
                </Group>
                    
                    
                    
                </Stack>
                
                
                
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

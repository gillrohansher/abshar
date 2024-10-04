import { Anchor, Badge, Button, Divider, Group, Image, Modal, NumberFormatter, Select, SimpleGrid, Stack, Text, TextInput, useMantineColorScheme } from '@mantine/core';
import { useEffect } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Slide } from 'react-slideshow-image';
import { IconChevronRight, IconChevronLeft, IconPhotoOff, IconPencil, IconEdit, IconTrashFilled, IconArrowLeft } from '@tabler/icons-react';
import 'react-slideshow-image/dist/styles.css'

import { useAppStore } from '@/lib/hooks';
import { PropertiesBillEstimateGet } from '@/api/fetchApis/Properties';
import dayjs from 'dayjs';
import { AddFeatureImageModal } from '../../components/AddFeatureImageModal/AddFeatureImageModal';
import { ExpandImageModal } from '../../components/ExpandImageModal/ExpandImageModal';
import PropertiesEstimationBarChart from '../../components/PropertiesEstimationBarChart/PropertiesEstimationBarChart';
import { setSelectedProperty } from '../../lib/propertySlice';
import { useAppDispatch } from '../../lib/hooks';
import { AddPropertyModal } from '../AddPropertyModal/AddPropertyModal';
import { UsersGet } from '../../api/fetchApis/Users';

const buttonStyle = {
    width: "30px",
    background: 'none',
    border: '0px'
};

const properties = {
    prevArrow: <button style={{ ...buttonStyle }}><IconChevronLeft color='white'/></button>,
    nextArrow: <button style={{ ...buttonStyle }}><IconChevronRight color='white'/></button>
}


export default function PropertyDetailsComponent({opened, onClose, publishButtonClick}) {
    const store = useAppStore();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [openAddFeatureImageModal, setOpenAddFeatureImageModal] = useState(false);
    
    const [publishOnFollow, setPublishOnFollow] = useState(false);
    const [openExpandImageModal, setOpenExpandImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const {accountData, token} = store.getState().general;
    const {selectedProperty} = store.getState().property;
    const [currentProperty, setCurrentProperty] = useState(selectedProperty);
    const [propertiesEstimation, setPropertiesEstimation] = useState(null);
    const [openAddPropertyModal, setOpenAddPropertyModal] = useState(false);
    const [editProperty, setEditProperty] = useState(null);
    const [users, setUsers] = useState([]);

const validate=()=>{
    return true;
}

useEffect(() => {
    setCurrentProperty(selectedProperty);
    console.log('selectedProperty: ', selectedProperty);
    console.log('selectedProperty: currentProperty: ', currentProperty);
    selectedProperty?.propertyStatus === 'COMPLETED' && getPropertiesBillEstimate();

    console.log('store.getState().general: ', store.getState());
}, [selectedProperty]);

useEffect(() => {
    getUsers();
    return () => {
        dispatch(setSelectedProperty(null));
    }
}, []);

const getUsers=()=>{
    UsersGet(null, token, res=>{
        if(res?.code === 200){
            setUsers(res.data.map((user)=> ({...user, value: user.id, label: `${user.firstName} ${user.lastName}`})));
        }
    });
}

const getPropertiesBillEstimate=()=>{
    PropertiesBillEstimateGet({startDate: dayjs().startOf('year').format('YYYY-MM-DD'), endDate: dayjs().endOf('year').format('YYYY-MM-DD'), propertyId: selectedProperty?.id}, token, res=>{
        if(res?.code === 200){
            res?.data.length > 0 && setPropertiesEstimation(res?.data[0]);
            console.log('getPropertiesBillEstimate: ', res?.data);
        }
    })
}

const mapPropertyStatusValues=(propertyStatus)=>{
    switch (propertyStatus) {
        case 'UNASSIGNED':
            return 'Unassigned';

        case 'ASSIGNED':
            return 'Assigned';

        case 'IN_REVIEW':
            return 'In review';
    
        case 'COMPLETED':
            return 'Completed';
            
        default:
            return 'Unassigned';
    }
}

const handleEditProperty=()=>{
    setEditProperty(currentProperty);
    setOpenAddPropertyModal(true);
}

console.log('images_124: ', currentProperty?.image?.featuredImage?.path ? true : false , currentProperty?.image?.otherImages.map((image)=> image?.path).length > 0);

  return (
    <>
        <Stack>
            <Group>
                <IconArrowLeft color='#5185a6' style={{cursor: 'pointer'}} onClick={()=> router.back()}/>
                <Group>
                    {currentProperty?.name}
                    <Group wrap='nowrap' gap='xs'>
                        <Badge color={currentProperty?.propertyStatus === "ASSIGNED" ? "#5185a6" : currentProperty?.propertyStatus === "COMPLETED" ? "#10516f" : currentProperty?.propertyStatus === "IN_REVIEW" ? "#9baebc" : "gray"}>{mapPropertyStatusValues(currentProperty?.propertyStatus)}</Badge>
                        {accountData.type !== 'CLIENT' && <IconEdit color='#5185a6' size={'18px'} style={{cursor: 'pointer'}} onClick={()=> handleEditProperty()}/>}
                    </Group>
                </Group>
            </Group>
            <Divider/>
            {currentProperty &&
             (currentProperty?.image?.featuredImage?.path ? true : false , currentProperty?.image?.otherImages.map((image)=> image?.path).length > 0) ?
            <EmblaCarousel 
            images={[currentProperty?.image?.featuredImage, ...currentProperty?.image?.otherImages].map((image)=> image.path)}  
            options={OPTIONS}
            onClick={(image)=> {
                setOpenExpandImageModal(true);
                setSelectedImage(image);
            }} />
            :
            <Group grow style={{background: 'grey', padding: '10px', borderRadius: '4px'}}>
                <Stack style={{height: '237px', borderRadius: '2px'}} justify='center' align={'center'}>
                    <IconPhotoOff
                    color={'white'}
                    />
                    <Text size={'xs'} style={{color: 'white'}}>{"No image available"}</Text>
                    {accountData.type !== 'CLIENT' && <Button onClick={()=> setOpenAddFeatureImageModal(true)}>Add image</Button>}
                </Stack>
            </Group>
            }
            {/* <Group grow style={{background: 'grey', padding: '10px', borderRadius: '4px'}}>
                <Slide {...properties}>
                    {currentProperty &&
                    [currentProperty?.image?.featuredImage, ...currentProperty?.image?.otherImages].map((image, index)=>
                    <Group justify={'center'}>
                        {image ? 
                        <div style={{position: 'relative'}}>
                            <img src={image.path} 
                            onClick={()=> {
                                setOpenExpandImageModal(true);
                                setSelectedImage(image.path);
                            }} 
                            style={{borderRadius: '2px', height: '237px', objectFit: 'cover', cursor: 'pointer'}}/>
                            {index === 0 && <Badge style={{position: 'absolute', top: 10, right: 10}}>Featured</Badge>}
                        </div>
                        
                        :
                        <Stack style={{height: '237px', borderRadius: '2px'}} justify='center' align={'center'}>
                            <IconPhotoOff
                            color={'white'}
                            />
                            <Text size={'xs'} style={{color: 'white'}}>{index === 0 ? "No featured image available" : "No image available"}</Text>
                            {index === 0 && accountData.type !== 'CLIENT' && <Button onClick={()=> setOpenAddFeatureImageModal(true)}>Add image</Button>}
                        </Stack>
                        }
                    </Group>)}
                </Slide>
            </Group> */}
            <SimpleGrid cols={2}>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Name</Text>
                    <Text size="sm">{currentProperty?.name ? currentProperty?.name : '-'}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Request from:</Text>
                    <Text size="sm">{currentProperty?.requestedUserInfo?.name ? currentProperty?.requestedUserInfo?.name : '-'}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Assigned to:</Text>
                    <Text size="sm">{currentProperty?.assignedUserInfo?.name ? currentProperty?.assignedUserInfo?.name : '-'}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Type</Text>
                    <Text size="sm">{currentProperty?.type ? currentProperty?.type : '-'}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Street</Text>
                    <Text size="sm">{currentProperty?.street ? currentProperty?.street : '-'}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Area</Text>
                    <Text size="sm">{currentProperty?.area ? currentProperty?.area : '-'}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Phase</Text>
                    <Text size="sm">{currentProperty?.phase ? currentProperty?.phase : '-'}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Zip code</Text>
                    <Text size="sm">{currentProperty?.zipCode ? currentProperty?.zipCode : '-'}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">City</Text>
                    <Text size="sm">{currentProperty?.city ? currentProperty?.city : '-'}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Country</Text>
                    <Text size="sm">{currentProperty?.country ? currentProperty?.country : '-'}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Location</Text>
                    <Text size="sm">
                        {(currentProperty?.latitude && currentProperty?.longitude) //&& (currentProperty?.latitude === 0 && currentProperty?.longitude === 0) 
                        ? 
                        <Anchor style={{wordBreak: 'break-all'}} href={`http://maps.google.com/maps?q=${currentProperty?.latitude},${currentProperty?.longitude}`} target={'_blank'}>{`http://maps.google.com/maps?q=${currentProperty?.latitude},${currentProperty?.longitude}`}</Anchor>
                        :
                        'Location not available'}
                    </Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Source of water</Text>
                    <Text size="sm">{currentProperty?.sourceOfWater.length > 0 ? currentProperty?.sourceOfWater.map((waterSource, index)=> index > 0 ? `, ${waterSource.toLowerCase()}` : waterSource.toLowerCase()) : '-'}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Estimated comsumption</Text>
                    <Text size="sm">{currentProperty?.estimatedConsumption ? currentProperty?.estimatedConsumption : '-'}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Number of people</Text>
                    <Text size="sm">{currentProperty?.noOfPeople ? currentProperty?.noOfPeople : '-'}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Water bill</Text>
                    <Text size="sm">
                        {currentProperty?.waterBill ? <NumberFormatter prefix='Rs. ' value={currentProperty?.waterBill} decimalScale={2} fixedDecimalScale/> : '-'}
                    </Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Electricity bill</Text>
                    <Text size="sm">
                        {currentProperty?.electricityBill ? <NumberFormatter prefix='Rs. ' value={currentProperty?.electricityBill} decimalScale={2} fixedDecimalScale/> : '-'}
                    </Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Point of contact name</Text>
                    <Text size="sm">{currentProperty?.pocName ? currentProperty?.pocName : '-'}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Point of contact number</Text>
                    <Text size="sm">{currentProperty?.pocContact ? currentProperty?.pocContactCountryCode + currentProperty?.pocContact : '-'}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Point of contact designation</Text>
                    <Text size="sm">{currentProperty?.pocDesignation ? currentProperty?.pocDesignation : '-'}</Text>
                </Stack>
                {selectedProperty?.type === 'MOSQUE' &&
                <>
                    <Stack gap={0}>
                        <Text c={'dimmed'} size="xs">Committee name</Text>
                        <Text size="sm">{currentProperty?.pocCommitteeName}</Text>
                    </Stack>
                    <Stack gap={0}>
                        <Text c={'dimmed'} size="xs">Committee number</Text>
                        <Text size="sm">{currentProperty?.pocCommitteeCountryCode + currentProperty?.pocCommitteeContact}</Text>
                    </Stack>
                </>}
            </SimpleGrid>
            <Stack gap={8}>
                <Text size={'sm'} fw={600}>Products</Text>
                <SimpleGrid cols={2}>
                    {currentProperty?.products?.length > 0 ? currentProperty?.products?.map((product, index)=> 
                    <Stack gap={0}>
                        <Text c={'blue'} size="xs">{`Product ${index+1}`}</Text>
                        <Group wrap='nowrap' gap={2}><Text c={'dimmed'} size="xs">Category:</Text><Text size={'xs'}>{product.category}</Text></Group>
                        <Group wrap='nowrap' gap={2}><Text c={'dimmed'} size="xs">Type:</Text><Text size={'xs'}>{product.type}</Text></Group>
                        <Group wrap='nowrap' gap={2}><Text c={'dimmed'} size="xs">Making:</Text><Text size={'xs'}>{product.making}</Text></Group>
                        <Group wrap='nowrap' gap={2}><Text c={'dimmed'} size="xs">Quantity:</Text><Text size={'xs'}>{product.quantity}</Text></Group>
                    </Stack>
                    )
                    : '-'}
                </SimpleGrid>
            </Stack>
            <Stack gap={0}>
                <Text c={'dimmed'} size="xs">Remarks</Text>
                <Text size="sm">{currentProperty?.remarks ? currentProperty?.remarks : '-'}</Text>
            </Stack>
            {selectedProperty?.propertyStatus === 'COMPLETED' && <Group style={{marginTop: '40px'}} grow>
                <PropertiesEstimationBarChart propertiesEstimation={propertiesEstimation} loader={false}/>
            </Group>}
        </Stack>
        {openAddFeatureImageModal &&
        <AddFeatureImageModal
        opened={openAddFeatureImageModal}
        onClose={()=> setOpenAddFeatureImageModal(false)}
        propertyId={currentProperty?.id}
        getProperties={()=> router.back()}
        publishOnFollow={publishOnFollow}
        //publishProperty={()=> publishButtonClick()}
        />}
        {openExpandImageModal &&
        <ExpandImageModal
        opened={openExpandImageModal}
        onClose={()=> {
            setOpenExpandImageModal(false);
            setSelectedImage(null);
        }}
        image={selectedImage}
        />}

        {openAddPropertyModal &&
        <AddPropertyModal
        opened={openAddPropertyModal}
        edit={editProperty}
        users={users}
        onClose={()=> {
            setOpenAddPropertyModal(false);
            setEditProperty(null);
        }}
        getProperties={()=> router.back()}
        isProperties={true}
        />}
    </>
  );
}

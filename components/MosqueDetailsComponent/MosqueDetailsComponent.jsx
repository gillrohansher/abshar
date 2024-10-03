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
import { PropertyGet } from '../../api/fetchApis/Properties';
import { SubscriptionSelectionModal } from '../SubscriptionSelectionModal/SubscriptionSelectionModal';

const buttonStyle = {
    width: "30px",
    background: 'none',
    border: '0px'
};

const properties = {
    prevArrow: <button style={{ ...buttonStyle }}><IconChevronLeft color='white'/></button>,
    nextArrow: <button style={{ ...buttonStyle }}><IconChevronRight color='white'/></button>
}


export default function MosqueDetailsComponent({opened, onClose, publishButtonClick}) {
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
    const [openPaymentModal, setOpenPaymentModal] = useState(false);
    const [selectedPropertyForPayment, setSelectedPropertyForPayment] = useState(null);

const validate=()=>{
    return true;
}

useEffect(() => {
    if(selectedProperty){
        setCurrentProperty(selectedProperty);
        console.log('selectedProperty: ', selectedProperty);
        console.log('selectedProperty: currentProperty: ', currentProperty);
        selectedProperty?.propertyStatus === 'COMPLETED' && getPropertiesBillEstimate();
    }else{
        const urlSplit = window.location.href.split('/');
        const propertyId = urlSplit[urlSplit.length - 1];
        
        getProperty(propertyId);
    }
    

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

const getProperty=(propertyId)=>{
    PropertyGet(propertyId, token, res=>{
        if(res?.code === 200){
            setCurrentProperty(res.data.length > 0 ? res.data[0] : null);
            if(res.data.length > 0 && res.data[0]?.propertyStatus === 'COMPLETED'){
                getPropertiesBillEstimate();
            }
        }
    })
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

console.log('currentProperty_1213: ', currentProperty);

  return (
    <>
        <Stack>
            <Group>
                <IconArrowLeft color='#5185a6' style={{cursor: 'pointer'}} onClick={()=> router.back()}/>
                {/* <Group>
                    {currentProperty?.name}
                    <Group wrap='nowrap' gap='xs'>
                        <Badge color={currentProperty?.propertyStatus === "ASSIGNED" ? "#5185a6" : currentProperty?.propertyStatus === "COMPLETED" ? "#10516f" : currentProperty?.propertyStatus === "IN_REVIEW" ? "#9baebc" : "gray"}>{mapPropertyStatusValues(currentProperty?.propertyStatus)}</Badge>
                        {accountData.type !== 'CLIENT' && <IconEdit color='#5185a6' size={'18px'} style={{cursor: 'pointer'}} onClick={()=> handleEditProperty()}/>}
                    </Group>
                </Group> */}
            </Group>
            <Divider/>

            <Stack gap={'80px'} style={{marginTop: '60px'}}>
                <Stack style={{width: '100%'}} align={'center'} gap='lg' justify='center'>
                    <Text fw={'500'} size="50px" c={'#5185a6'}>{currentProperty?.name}</Text>
                    <Text fw={'500'} size="sm" c={'dimmed'} ta='center' w='580px'>Our comprehensive guide to strategies for entrepreneurs and leaders offer valuable insights, practical advice.</Text>
                </Stack>
                <Stack style={{width: '100%'}}>
                    <SimpleGrid cols={2} spacing={'xl'}>
                        <Stack gap={'sm'} justify={'center'}>
                            <Text fw={'600'} size="sm" c={"dark"}>Get Success Together!</Text>
                            <Text fw={'500'} size="50px" c={"dark"} w='400px' lh={'60px'}>Adapting and Thriving in a Changing World</Text>
                            <Text fw={'500'} size="sm" c={'dimmed'}>Our comprehensive guide to strategies for entrepreneurs and leaders offer valuable insights, practical advice.</Text>
                        </Stack>
                        <Stack>
                            <img src={currentProperty?.image?.featuredImage?.path} 
                            onClick={()=> {
                                setOpenExpandImageModal(true);
                                setSelectedImage(currentProperty?.image?.featuredImage?.path);
                            }}
                            style={{borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px', height: '450px', objectFit: 'cover', cursor: 'pointer'}}/>
                        </Stack>
                    </SimpleGrid>
                </Stack>

                <Stack style={{width: '100%'}}>
                    <SimpleGrid cols={2} spacing={'xl'}>
                        {(selectedProperty?.propertyStatus === 'COMPLETED' || currentProperty?.propertyStatus === 'COMPLETED') && 
                        <Stack justify={'center'}>
                            <PropertiesEstimationBarChart propertiesEstimation={propertiesEstimation} loader={false} mosqueDetail={true}/>
                        </Stack>}
                        <Stack gap={'sm'} justify={'center'}>
                            <Text fw={'600'} size="sm" c={"dark"}>Get Success Together!</Text>
                            <Text fw={'500'} size="40px" c={"dark"} lh={'60px'}>Your Social Impact</Text>
                            <Text fw={'500'} size="sm" c={'dimmed'}>Our comprehensive guide to strategies for entrepreneurs and leaders offer valuable insights, practical advice.</Text>
                        </Stack>
                    </SimpleGrid>
                </Stack>
                
                <Stack style={{width: '100%'}} align='center'>
                    <Group wrap='nowrap' gap={'60px'}>
                        <Text fw={'600'} size="sm" c={"dark"} td='underline' style={{cursor: 'pointer'}} onClick={()=> router.back()}>Cancel</Text>
                        <Button onClick={()=> {
                            setOpenPaymentModal(true);
                            setSelectedPropertyForPayment(currentProperty);
                        }}>Contribute</Button>
                    </Group>
                </Stack>

                <Stack align={'center'} gap='60px'>
                    <Text fw={'500'} size="20px" c={"dark"} lh={'60px'}>The Impact We Have Created</Text>
                    <Group h={'80px'} w={'100%'} style={{backgroundColor: '#5185a6'}} justify='center'>
                        <Group h={'100px'} p='xl' gap={'xl'} justify={'center'} align='center' style={{backgroundColor: 'white', marginTop: '-80px'}}>
                            <Group>
                                <Group h={'50px'} w={'50px'} style={{backgroundColor: '#5185a6', borderRadius: '100px'}}></Group>
                                <Stack justify={'center'} align='center' gap={5}>
                                    <Text fw={'bold'} size="15px" c={"dark"}>1.3</Text>
                                    <Text fw={'bold'} size="9px" c={"dark"}>Billion liters</Text>
                                    <Text fw={'600'} size="8px" c={"dark"}>Water saved</Text>
                                </Stack>
                            </Group>

                            <Group>
                                <Group h={'50px'} w={'50px'} style={{backgroundColor: '#5185a6', borderRadius: '100px'}}></Group>
                                <Stack justify={'center'} align='center' gap={5}>
                                    <Text fw={'bold'} size="15px" c={"dark"}>1</Text>
                                    <Text fw={'bold'} size="9px" c={"dark"}>Billion</Text>
                                    <Text fw={'600'} size="8px" c={"dark"}>Tree saved</Text>
                                </Stack>
                            </Group>

                            <Group>
                                <Group h={'50px'} w={'50px'} style={{backgroundColor: '#5185a6', borderRadius: '100px'}}></Group>
                                <Stack justify={'center'} align='center' gap={5}>
                                    <Text fw={'bold'} size="15px" c={"dark"}>286</Text>
                                    <Text fw={'bold'} size="9px" c={"dark"}>Million</Text>
                                    <Text fw={'600'} size="8px" c={"dark"}>Lives impacted</Text>
                                </Stack>
                            </Group>

                            <Group>
                                <Group h={'50px'} w={'50px'} style={{backgroundColor: '#5185a6', borderRadius: '100px'}}></Group>
                                <Stack justify={'center'} align='center' gap={5}>
                                    <Text fw={'bold'} size="15px" c={"dark"}>23</Text>
                                    <Text fw={'bold'} size="9px" c={"dark"}>Million tons</Text>
                                    <Text fw={'600'} size="8px" c={"dark"}>CO<sub>2</sub> reduced</Text>
                                </Stack>
                            </Group>
                        </Group>
                    </Group>
                </Stack>
                
                {/* old stuff */}
                <Stack gap={20}>
                    <Text size={'sm'} fw={600}>Property images</Text>
                    <Group grow style={{background: 'grey', padding: '10px', borderRadius: '4px'}}>
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
                    </Group>
                </Stack>
                <Stack gap={20}>
                    <Text size={'sm'} fw={600}>Property information</Text>
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
                            <Text size="sm">{currentProperty?.sourceOfWater?.length > 0 ? currentProperty?.sourceOfWater.map((waterSource, index)=> index > 0 ? `, ${waterSource.toLowerCase()}` : waterSource.toLowerCase()) : '-'}</Text>
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
                </Stack>
                <Stack gap={20}>
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
                <Stack gap={20}>
                <Text size={'sm'} fw={600}>Remarks</Text>
                    <Text size="sm">{currentProperty?.remarks ? currentProperty?.remarks : '-'}</Text>
                </Stack>
            </Stack>
        
            {/* {(selectedProperty?.propertyStatus === 'COMPLETED' || currentProperty?.propertyStatus === 'COMPLETED') && <Group style={{marginTop: '40px'}} grow>
                <PropertiesEstimationBarChart propertiesEstimation={propertiesEstimation} loader={false}/>
            </Group>} */}
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

        {openPaymentModal &&
        <SubscriptionSelectionModal
        opened={openPaymentModal}
        propertyData={selectedPropertyForPayment}
        onClose={()=> {
            setOpenPaymentModal(false);
            setSelectedPropertyForPayment(false);
        }}
        />}
    </>
  );
}

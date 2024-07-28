import { Anchor, Badge, Button, Group, Image, Modal, NumberFormatter, Select, SimpleGrid, Stack, Text, TextInput, useMantineColorScheme } from '@mantine/core';
import { useEffect } from 'react';
import { useState } from 'react';
import { Slide } from 'react-slideshow-image';
import { IconChevronRight, IconChevronLeft, IconPhotoOff, IconPencil, IconEdit } from '@tabler/icons-react';
import 'react-slideshow-image/dist/styles.css'

import {AddFeatureImageModal} from '../AddFeatureImageModal/AddFeatureImageModal';
import {ExpandImageModal} from '../ExpandImageModal/ExpandImageModal';

const buttonStyle = {
    width: "30px",
    background: 'none',
    border: '0px'
};

const properties = {
    prevArrow: <button style={{ ...buttonStyle }}><IconChevronLeft color='white'/></button>,
    nextArrow: <button style={{ ...buttonStyle }}><IconChevronRight color='white'/></button>
}


export function PropertyDetailsModal({opened, onClose, selectedProperty, publishButtonClick, getProperties, editProperty}) {
    const [openAddFeatureImageModal, setOpenAddFeatureImageModal] = useState(false);
    const [currentProperty, setCurrentProperty] = useState(selectedProperty);
    const [publishOnFollow, setPublishOnFollow] = useState(false);
    const [openExpandImageModal, setOpenExpandImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

const validate=()=>{
    return true;
}

useEffect(() => {
    setCurrentProperty(selectedProperty);
    console.log('selectedProperty: ', selectedProperty);
    console.log('selectedProperty: currentProperty: ', currentProperty);
}, [selectedProperty]);
  return (
    <Modal size={'lg'} opened={opened} lockScroll={true} onClose={onClose} 
    title={
    <Group>
        {currentProperty?.name}
        <Group wrap='nowrap' gap='xs'>
            <Badge color={currentProperty?.propertyStatus === "ASSIGNED" ? "#5185a6" : "gray"}>{currentProperty?.propertyStatus}</Badge>
            <IconEdit color='#5185a6' size={'18px'} style={{cursor: 'pointer'}} onClick={()=> editProperty(currentProperty)}/>
        </Group>
    </Group>
    } 
    centered>
        <Stack>
            <Group grow style={{background: 'grey', padding: '10px', borderRadius: '4px'}}>
                <Slide {...properties}>
                    {[currentProperty.image.featuredImage, ...currentProperty.image.otherImages].map((image, index)=>
                    <Group justify={'center'}>
                        {image ? <img src={image.path} 
                        onClick={()=> {
                            setOpenExpandImageModal(true);
                            setSelectedImage(image.path);
                        }} 
                        style={{borderRadius: '2px', height: '237px', objectFit: 'cover', cursor: 'pointer'}} />
                        :
                        <Stack style={{height: '237px', borderRadius: '2px'}} justify='center' align={'center'}>
                            <IconPhotoOff
                            color={'white'}
                            />
                            <Text size={'xs'} style={{color: 'white'}}>{index === 0 ? "No featured image available" : "No image available"}</Text>
                            {index === 0 && <Button onClick={()=> setOpenAddFeatureImageModal(true)}>Add image</Button>}
                        </Stack>
                        }
                    </Group>)}
                </Slide>
            </Group>
            <SimpleGrid cols={2}>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Name</Text>
                    <Text size="sm">{currentProperty?.name}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Request from:</Text>
                    <Text size="sm">{currentProperty?.requestedUserInfo?.name}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Assigned to:</Text>
                    <Text size="sm">{currentProperty?.assignedUserInfo?.name}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Type</Text>
                    <Text size="sm">{currentProperty?.type}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Street</Text>
                    <Text size="sm">{currentProperty?.street}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Area</Text>
                    <Text size="sm">{currentProperty?.area}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Phase</Text>
                    <Text size="sm">{currentProperty?.phase}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Zip code</Text>
                    <Text size="sm">{currentProperty?.zipCode}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">City</Text>
                    <Text size="sm">{currentProperty?.city}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Country</Text>
                    <Text size="sm">{currentProperty?.country}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Location</Text>
                    <Text size="sm">
                        {(currentProperty?.latitude === 0 && currentProperty?.longitude === 0) ? 
                        'Location not available' 
                        : 
                        <Anchor style={{wordBreak: 'break-all'}} href={`http://maps.google.com/maps?q=${currentProperty?.latitude},${currentProperty?.longitude}`} target={'_blank'}>{`http://maps.google.com/maps?q=${currentProperty?.latitude},${currentProperty?.longitude}`}</Anchor>}
                    </Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Source of water</Text>
                    <Text size="sm">{currentProperty?.sourceOfWater.map((waterSource, index)=> index > 0 ? `, ${waterSource.toLowerCase()}` : waterSource.toLowerCase())}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Estimated comsumption</Text>
                    <Text size="sm">{currentProperty?.estimatedConsumption}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Number of people</Text>
                    <Text size="sm">{currentProperty?.noOfPeople}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Water bill</Text>
                    <Text size="sm">
                        <NumberFormatter prefix='Rs. ' value={currentProperty?.waterBill} decimalScale={2} fixedDecimalScale/>
                    </Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Electricity bill</Text>
                    <Text size="sm">
                        <NumberFormatter prefix='Rs. ' value={currentProperty?.electricityBill} decimalScale={2} fixedDecimalScale/>
                    </Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Point of contact name</Text>
                    <Text size="sm">{currentProperty?.pocName}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Point of contact number</Text>
                    <Text size="sm">{currentProperty?.pocContactCountryCode + currentProperty?.pocContact}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Point of contact designation</Text>
                    <Text size="sm">{currentProperty?.pocDesignation}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Committee name</Text>
                    <Text size="sm">{currentProperty?.pocCommitteeName}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Committee number</Text>
                    <Text size="sm">{currentProperty?.pocCommitteeCountryCode + currentProperty?.pocCommitteeContact}</Text>
                </Stack>
            </SimpleGrid>
            <Stack gap={8}>
                <Text size={'sm'} fw={600}>Products</Text>
                <SimpleGrid cols={2}>
                    {currentProperty?.products.length > 0 && currentProperty?.products.map((product, index)=> 
                    <Stack gap={0}>
                        <Text c={'blue'} size="xs">{`Product ${index+1}`}</Text>
                        <Group wrap='nowrap' gap={2}><Text c={'dimmed'} size="xs">Category:</Text><Text size={'xs'}>{product.category}</Text></Group>
                        <Group wrap='nowrap' gap={2}><Text c={'dimmed'} size="xs">Type:</Text><Text size={'xs'}>{product.type}</Text></Group>
                        <Group wrap='nowrap' gap={2}><Text c={'dimmed'} size="xs">Making:</Text><Text size={'xs'}>{product.making}</Text></Group>
                        <Group wrap='nowrap' gap={2}><Text c={'dimmed'} size="xs">Quantity:</Text><Text size={'xs'}>{product.quantity}</Text></Group>
                    </Stack>
                    )}
                </SimpleGrid>
            </Stack>
            <Stack gap={0}>
                <Text c={'dimmed'} size="xs">Remarks</Text>
                <Text size="sm">{currentProperty?.remarks}</Text>
            </Stack>
            <Group grow>
                {/* <Button fullWidth mt="md" radius="md" onClick={()=> {
                    if(currentProperty.image.featuredImage){
                        publishButtonClick();
                    }else{
                        setPublishOnFollow(true);
                        setOpenAddFeatureImageModal(true);
                    }
                }}>
                    {currentProperty?.propertyStatus === 'UNPUBLISHED' ? 'Publish' : 'Unpublish'}
                </Button> */}
            </Group>
        </Stack>
        {openAddFeatureImageModal &&
        <AddFeatureImageModal
        opened={openAddFeatureImageModal}
        onClose={()=> setOpenAddFeatureImageModal(false)}
        propertyId={currentProperty?.id}
        getProperties={()=> getProperties()}
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
    </Modal>
  );
}

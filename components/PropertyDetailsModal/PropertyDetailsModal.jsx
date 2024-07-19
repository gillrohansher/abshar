import { Anchor, Badge, Button, Group, Image, Modal, NumberFormatter, Select, SimpleGrid, Stack, Text, TextInput, useMantineColorScheme } from '@mantine/core';
import { useEffect } from 'react';
import { useState } from 'react';
import { Slide } from 'react-slideshow-image';
import { IconChevronRight, IconChevronLeft, IconPhotoOff } from '@tabler/icons-react';
import 'react-slideshow-image/dist/styles.css'

const buttonStyle = {
    width: "30px",
    background: 'none',
    border: '0px'
};

const properties = {
    prevArrow: <button style={{ ...buttonStyle }}><IconChevronLeft color='white'/></button>,
    nextArrow: <button style={{ ...buttonStyle }}><IconChevronRight color='white'/></button>
}


export function PropertyDetailsModal({opened, onClose, selectedProperty, publishButtonClick}) {


const validate=()=>{
    return true;
}

useEffect(() => {
    
}, []);
  return (
    <Modal size={'lg'} opened={opened} lockScroll={true} onClose={onClose} 
    title={
    <Group>
        {selectedProperty?.name}
        <Badge color="blue">{selectedProperty?.propertyStatus}</Badge>
    </Group>
    } 
    centered>
        <Stack>
            <Group grow style={{background: 'grey', padding: '10px', borderRadius: '4px'}}>
                <Slide {...properties}>
                    {[selectedProperty.image.featuredImage, ...selectedProperty.image.otherImages].map((image)=>
                    <Group justify={'center'}>
                        {image ? <img src={image.path} style={{borderRadius: '2px', height: '237px', objectFit: 'cover'}} />
                        :
                        <Stack style={{height: '237px', borderRadius: '2px'}} justify='center' align={'center'}>
                            <IconPhotoOff
                            color={'white'}
                            />
                            <Text size={'xs'} style={{color: 'white'}}>No image available</Text>
                        </Stack>
                        }
                    </Group>)}
                </Slide>
            </Group>
            <SimpleGrid cols={2}>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Name</Text>
                    <Text size="sm">{selectedProperty?.name}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Type</Text>
                    <Text size="sm">{selectedProperty?.type}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Street</Text>
                    <Text size="sm">{selectedProperty?.street}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Area</Text>
                    <Text size="sm">{selectedProperty?.area}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Phase</Text>
                    <Text size="sm">{selectedProperty?.phase}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Zip code</Text>
                    <Text size="sm">{selectedProperty?.zipCode}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">City</Text>
                    <Text size="sm">{selectedProperty?.city}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Country</Text>
                    <Text size="sm">{selectedProperty?.country}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Location</Text>
                    <Text size="sm">
                        {(selectedProperty?.latitude === 0 && selectedProperty?.longitude === 0) ? 
                        'Location not available' 
                        : 
                        <Anchor style={{wordBreak: 'break-all'}} href={`http://maps.google.com/maps?q=${selectedProperty?.latitude},${selectedProperty?.longitude}`} target={'_blank'}>{`http://maps.google.com/maps?q=${selectedProperty?.latitude},${selectedProperty?.longitude}`}</Anchor>}
                    </Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Source of water</Text>
                    <Text size="sm">{selectedProperty?.sourceOfWater.map((waterSource, index)=> index > 0 ? `, ${waterSource.toLowerCase()}` : waterSource.toLowerCase())}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Estimated comsumption</Text>
                    <Text size="sm">{selectedProperty?.estimatedConsumption}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Number of people</Text>
                    <Text size="sm">{selectedProperty?.noOfPeople}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Water bill</Text>
                    <Text size="sm">
                        <NumberFormatter prefix='Rs. ' value={selectedProperty?.waterBill} decimalScale={2} fixedDecimalScale/>
                    </Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Electricity bill</Text>
                    <Text size="sm">
                        <NumberFormatter prefix='Rs. ' value={selectedProperty?.electricityBill} decimalScale={2} fixedDecimalScale/>
                    </Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Point of contact name</Text>
                    <Text size="sm">{selectedProperty?.pocName}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Point of contact number</Text>
                    <Text size="sm">{selectedProperty?.pocContactCountryCode + selectedProperty?.pocContact}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Point of contact designation</Text>
                    <Text size="sm">{selectedProperty?.pocDesignation}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Committee name</Text>
                    <Text size="sm">{selectedProperty?.pocCommitteeName}</Text>
                </Stack>
                <Stack gap={0}>
                    <Text c={'dimmed'} size="xs">Committee number</Text>
                    <Text size="sm">{selectedProperty?.pocCommitteeCountryCode + selectedProperty?.pocCommitteeContact}</Text>
                </Stack>
            </SimpleGrid>
            <Stack gap={8}>
                <Text size={'sm'} fw={600}>Products</Text>
                <SimpleGrid cols={2}>
                    {selectedProperty?.products.length > 0 && selectedProperty?.products.map((product, index)=> 
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
                <Text size="sm">{selectedProperty?.remarks}</Text>
            </Stack>
            <Group grow>
                <Button fullWidth mt="md" radius="md" onClick={()=> publishButtonClick()}>
                    {selectedProperty?.propertyStatus === 'UNPUBLISHED' ? 'Publish' : 'Unpublish'}
                </Button>
            </Group>
        </Stack>
    </Modal>
  );
}

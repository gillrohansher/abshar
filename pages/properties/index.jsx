import { ActionIcon, Anchor, AppShell, Badge, Box, Burger, Button, Card, Center, Checkbox, Fieldset, Group, Image, Loader, LoadingOverlay, Menu, NavLink, PasswordInput, SimpleGrid, Stack, Table, Text, TextInput, useMantineColorScheme } from '@mantine/core';
import { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/navigation'


import { SignInPost } from '../../api/fetchApis/Auth';
import { useAppStore, useAppDispatch, useWindowSize} from '../../lib/hooks';
import { IconCirclePlusFilled, IconTrashFilled, IconLineDotted, IconPencil, IconDotsCircleHorizontal, IconChevronRight, IconChevronLeft } from '@tabler/icons-react';
import { PropertiesDelete, PropertiesGet, PropertiesPost, PropertyChangeStatusPut, PropertyUploadFeatureImagePost, PropertyUploadImagePost } from '../../api/fetchApis/Properties';
import { AddPropertyModal } from '../../components/AddPropertyModal/AddPropertyModal';
import { PropertyDetailsModal } from '../../components/PropertyDetailsModal/PropertyDetailsModal';



function PropertiesPage(props) {
    const size = useWindowSize();
    const store = useAppStore();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [properties, setProperties] = useState([]);
    const [loader, setLoader] = useState(false);
    const [contextMenu, setContextMenu] = useState(false); 
    const [openAddPropertyModal, setOpenAddPropertyModal] = useState(false);
    const [openPropertyDetailsModal, setOpenPropertyDetailsModal] = useState(false);
    const [selectedPropertyForDetails, setSelectedPropertyForDetails] = useState(null);
    const [selectedProperties, setSelectedProperties] = useState([]);
    const [editProperty, setEditProperty] = useState(null);
    const [search, setSearch] = useState(null);
    const {token} = store.getState().general;

    useEffect(() => {
        setLoader(true);
        setTimeout(() => {
            getProperties();    
        }, 1000);
    },[]);

    console.log('selectedProperties: ', selectedProperties);
    const getProperties=()=>{
        setLoader(true);
        PropertiesGet(null, token, res=>{
            if(res?.code === 200){
                setProperties(res.data);
            }
            setLoader(false);
        });
    }
    
    const postProperty=(category, type, making)=>{
        setLoader(true);
        PropertiesPost({
            category, 
            type, 
            making
        }, token, res=>{
            if(res?.code === 200){
                showNotification({
                    message: 'Property added successfully.',
                    color: 'green',
                    id: 'propertyAdded'
                });
                getProperties();
            }
            setLoader(false);
        });
    }

    const deleteProperty=(id)=>{
        setLoader(true);
        PropertiesDelete(id, token, res=>{
            if(res?.code === 200){
                showNotification({
                    message: 'Property deleted successfully.',
                    color: 'green',
                    id: 'propertyDeleted'
                });
                setSelectedProperties([]);
                getProperties();
            }
            setLoader(false);
        });
    }
    const publishProperty=(ids)=>{
        setLoader(true);
        PropertyChangeStatusPut(ids, 'PUBLISHED', token, res=>{
            if(res?.code === 200){
                showNotification({
                    message: 'Property updated successfully',
                    color: 'green',
                    id: 'propertyUpdated'
                });
                getProperties();
            }
            setLoader(false);
        });
    }

    const unpublishProperty=(ids)=>{
        setLoader(true);
        PropertyChangeStatusPut(ids, 'UNPUBLISHED', token, res=>{
            if(res?.code === 200){
                showNotification({
                    message: 'Property updated successfully.',
                    color: 'green',
                    id: 'propertyUpdated'
                });
                getProperties();
            }
            setLoader(false);
        });
    }

    const handleOpenSelectedProperty=(property)=>{
        setSelectedPropertyForDetails(property);
        setOpenPropertyDetailsModal(true);    
    }


    const renderPropertyCard=(property)=>{
        return(
            <Card 
            shadow="sm" 
            padding="lg" 
            radius="md" 
            withBorder 
            style={{cursor: 'pointer', minWidth: '100%'}}>
                <Card.Section>
                    <Badge style={{position: 'absolute', top: 10, right: 10}} color="blue">{property.propertyStatus}</Badge>
                    <Checkbox
                    style={{position: 'absolute', top: 10, left: 10}}
                    styles={{input: {cursor: 'pointer'}}}
                    checked={selectedProperties.find((selectedProperty)=> selectedProperty === property.id)}
                    onChange={()=> setSelectedProperties(selectedProperties.find((selectedProperty)=> selectedProperty === property.id) !== undefined ? selectedProperties.filter((selectedProperty)=> selectedProperty !== property.id) : [...selectedProperties, property.id])}
                    />
                    <Image
                        src={property.image.featuredImage ? property.image.featuredImage : "/images/no_image_available.png"}
                        height={160}
                        alt="No image"
                        onClick={()=> handleOpenSelectedProperty(property)}
                    />
                </Card.Section>
                <Stack onClick={()=> handleOpenSelectedProperty(property)}>
                    <Group justify="space-between" mt="md" mb="xs">
                        <Text fw={500}>{property.name}</Text>
                        <Badge color="grey">{property.type}</Badge>
                    </Group>

                    <Text size="sm" c="dimmed">{`${property.street+','} ${property.area+','} ${property.phase+','} ${property.zipCode+','} ${property.city}`}</Text>
                </Stack>

                <Button fullWidth mt="md" radius="md" onClick={()=> property.propertyStatus === 'UNPUBLISHED' ? publishProperty([property.id]) : unpublishProperty([property.id])}>
                    {property.propertyStatus === 'UNPUBLISHED' ? 'Publish' : 'Unpublish'}
                </Button>
            </Card>
        )
    }

    return (
        <Stack>
            <Group justify={'space-between'}>
                <Group>
                    <TextInput
                    value={search}
                    onChange={(event) => setSearch(event.currentTarget.value)}
                    placeholder={'Search property name or address...'}
                    styles={{
                        input: {
                            minWidth: '260px'
                        }
                    }}
                    />
                </Group>
                <Group>
                    <ActionIcon onClick={()=> setOpenAddPropertyModal(true)} variant="filled" aria-label="Add Property">
                        <IconCirclePlusFilled style={{width: '70%', height: '70%'}}/>
                    </ActionIcon>
                    <ActionIcon disabled={selectedProperties.length === 0} color={'red'} onClick={()=> selectedProperties.length > 0 ? selectedProperties.map((id)=> deleteProperty(id)) : showNotification({message: 'No properties selected yet', color: 'red', id: 'noPropertiesSelected'})} variant="filled" aria-label="Delete Property">
                        <IconTrashFilled style={{width: '70%', height: '70%'}}/>
                    </ActionIcon>
                </Group>
            </Group>
            <Group>
                {loader ?
                <Center h={'100vh'} w={'100%'}>
                    <Loader/>
                </Center>
                :
                properties.length > 0 ?
                <Group w={'100%'}>
                    <SimpleGrid cols={size.width < 650 ? 1 : size.width < 1100 ? 2 : 3} style={{minWidth: '100%'}}>
                        {properties.filter((property)=> search ? (property.name.toLowerCase().includes(search.toLowerCase()) || property.street.toLowerCase().includes(search.toLowerCase()) || property.phase.toLowerCase().includes(search.toLowerCase()) || property.area.toLowerCase().includes(search.toLowerCase()) || property.zipCode.toLowerCase().includes(search.toLowerCase()) || property.city.toLowerCase().includes(search.toLowerCase()) || property.type.toLowerCase().includes(search.toLowerCase())) : property)
                        .map((property)=> 
                        <Group key={property.id} style={{minWidth: '100%'}}>
                            {renderPropertyCard(property)}
                        </Group>)}
                    </SimpleGrid>
                </Group>
                :
                <Center h={'100vh'} w={'100%'}>
                    No data available.
                </Center>
                }
            </Group>
            {/* {openAddPropertyModal &&
            <AddPropertyModal
            opened={openAddPropertyModal}
            edit={editProperty}
            properties={properties}
            onClose={()=> {setOpenAddPropertyModal(false); setEditProperty(null);}}
            addProperty={(category, type, making)=> {
                postProperty(category, type, making);
                setOpenAddPropertyModal(false);
                setEditProperty(null);
            }}
            editProperty={(category, type, making, id)=> {
                putProperty(category, type, making, id);
                setOpenAddPropertyModal(false);
                setEditProperty(null);
            }}
            />} */}
            {openAddPropertyModal &&
            <AddPropertyModal
            opened={openAddPropertyModal}
            onClose={()=> setOpenAddPropertyModal(false)}
            getProperties={()=> getProperties()}
            />}

            {openPropertyDetailsModal &&
            <PropertyDetailsModal
            selectedProperty={selectedPropertyForDetails}
            opened={openPropertyDetailsModal}
            onClose={()=> setOpenPropertyDetailsModal(false)}
            publishButtonClick={()=> {
                if(selectedPropertyForDetails.propertyStatus === 'UNPUBLISHED'){
                    publishProperty([selectedPropertyForDetails.id]);
                }else{
                    unpublishProperty([selectedPropertyForDetails.id]);
                }
                setOpenPropertyDetailsModal(false);
            }}
            />}
        </Stack>
    );
}

export default PropertiesPage;
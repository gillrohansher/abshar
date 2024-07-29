import { ActionIcon, Anchor, AppShell, Badge, Box, Burger, Button, Card, Center, Checkbox, Divider, Fieldset, Group, Image, Loader, LoadingOverlay, Menu, NavLink, PasswordInput, SimpleGrid, Stack, Table, Text, TextInput, useMantineColorScheme } from '@mantine/core';
import { useEffect, useState } from 'react';
import { hideNotification, showNotification } from '@mantine/notifications';
import { useRouter } from 'next/navigation'


import { SignInPost } from '../../api/fetchApis/Auth';
import { useAppStore, useAppDispatch, useWindowSize} from '../../lib/hooks';
import { IconCirclePlusFilled, IconTrashFilled, IconLineDotted, IconPencil, IconDotsCircleHorizontal, IconChevronRight, IconChevronLeft, IconPhotoOff } from '@tabler/icons-react';
import { PropertiesDelete, PropertiesGet, PropertiesPost, PropertyChangeStatusPut, PropertyUploadFeatureImagePost, PropertyUploadImagePost } from '../../api/fetchApis/Properties';
import { UsersGet } from '../../api/fetchApis/Users';
import { AddPropertyModal } from '../../components/AddPropertyModal/AddPropertyModal';
import { PropertyDetailsModal } from '../../components/PropertyDetailsModal/PropertyDetailsModal';
import { AddFeatureImageModal } from '@/components/AddFeatureImageModal/AddFeatureImageModal';



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
    const [openAddFeatureImageModal, setOpenAddFeatureImageModal] = useState(false);
    const [publishOnFollow, setPublishOnFollow] = useState(null);
    const {token} = store.getState().general;
    const [filterPropertyType, setFilterPropertyType] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        setLoader(true);
        setTimeout(() => {
            getProperties();
            getUsers();
        }, 1000);
    },[]);

    const getUsers=()=>{
        setLoader(true);
        UsersGet(null, token, res=>{
            if(res?.code === 200){
                setUsers(res.data.map((user)=> ({...user, value: user.id, label: `${user.firstName} ${user.lastName}`})));
            }
            setLoader(false);
        });
    }

    console.log('selectedProperties: ', selectedProperties);
    const getProperties=()=>{
        setLoader(true);
        PropertiesGet(null, token, res=>{
            if(res?.code === 200){
                setProperties(res.data.filter((property)=> property.type !== 'MOSQUE'));
                openPropertyDetailsModal && setSelectedPropertyForDetails(res.data.find((property)=> property.id === selectedPropertyForDetails?.id));
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
    // const publishProperty=(ids)=>{
    //     setLoader(true);
    //     PropertyChangeStatusPut(ids, 'PUBLISHED', token, res=>{
    //         if(res?.code === 200){
    //             hideNotification('propertyPublised');
    //             hideNotification('propertyUnpublised');
    //             showNotification({
    //                 message: 'Property publised.',
    //                 color: 'green',
    //                 id: 'propertyPublised'
    //             });
    //             getProperties();
    //         }
    //         setLoader(false);
    //     });
    // }

    // const unpublishProperty=(ids)=>{
    //     setLoader(true);
    //     PropertyChangeStatusPut(ids, 'UNPUBLISHED', token, res=>{
    //         if(res?.code === 200){
    //             hideNotification('propertyPublised');
    //             hideNotification('propertyUnpublised');
    //             showNotification({
    //                 message: 'Property unpublised.',
    //                 color: 'green',
    //                 id: 'propertyUnpublised'
    //             });
    //             getProperties();
    //         }
    //         setLoader(false);
    //     });
    // }

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
                    <Badge style={{position: 'absolute', top: 10, right: 10}} color={property.propertyStatus === "ASSIGNED" ? "#5185a6" : "gray"}>{property.propertyStatus}</Badge>
                    <Checkbox
                    style={{position: 'absolute', top: 10, left: 10}}
                    styles={{input: {cursor: 'pointer'}}}
                    checked={selectedProperties.find((selectedProperty)=> selectedProperty === property.id)}
                    onChange={()=> setSelectedProperties(selectedProperties.find((selectedProperty)=> selectedProperty === property.id) !== undefined ? selectedProperties.filter((selectedProperty)=> selectedProperty !== property.id) : [...selectedProperties, property.id])}
                    />
                    {property.image.featuredImage ?
                    <Image
                    src={property.image.featuredImage.path}
                    height={160}
                    style={{objectFit: !property.image.featuredImage && 'fill'}}
                    alt="No image"
                    onClick={()=> handleOpenSelectedProperty(property)}
                    />
                    :
                    <Stack onClick={()=> handleOpenSelectedProperty(property)} style={{height: 160}} align='center' justify={'center'}>
                        <IconPhotoOff
                        style={{borderRadius: '2px'}}
                        />
                        <Text size={'xs'}>No featured image available</Text>
                    </Stack>
                    }
                </Card.Section>
                <Divider/>
                <Stack onClick={()=> handleOpenSelectedProperty(property)}>
                    <Group justify="space-between" mt="md" mb="xs">
                        <Text fw={500}>{property.name}</Text>
                        <Badge color="grey">{property.type}</Badge>
                    </Group>
                    <Stack gap={2}>
                        <Text size="sm" c="dimmed">{`${property.street && 'Street '+property.street+','} ${property.area && property.area+','} ${property.phase && 'phase '+property.phase+','} ${property.zipCode && property.zipCode+','} ${property.city && property.city+','} ${property.country && property.country}`}</Text>
                        <Group wrap='nowrap' align={'flex-start'} gap='xs'>
                            <Text size="sm" c="#5185a6">Requested from:</Text>{property.requestedUserInfo && <Text size="sm" c="dimmed">{`${property.requestedUserInfo.name}`}</Text>}
                        </Group>
                        <Group wrap='nowrap' align={'flex-start'} gap='xs'>
                            <Text size="sm" c="#5185a6">Assigned to:</Text>{property.assignedUserInfo && <Text size="sm" c="dimmed">{`${property.assignedUserInfo.name}`}</Text>}
                        </Group>
                    </Stack>
                    
                </Stack>

                {/* <Button fullWidth mt="md" radius="md" onClick={()=> {
                    if(property.image.featuredImage){
                        property.propertyStatus === 'UNPUBLISHED' ? publishProperty([property.id]) : unpublishProperty([property.id])
                    }else{
                        setPublishOnFollow(property.id);
                        setOpenAddFeatureImageModal(true);
                    }
                }}>
                    {property.propertyStatus === 'UNPUBLISHED' ? 'Publish' : 'Unpublish'}
                </Button> */}
            </Card>
        )
    }

    const renderFilterBadges=()=>{
        return (
            <Group>
                {/* <Badge 
                style={{cursor: 'pointer'}} 
                color={filterPropertyType.length > 0 && filterPropertyType.find((filter)=> filter === 'MOSQUE') === undefined && 'gray'}
                onClick={()=> {
                    if(filterPropertyType.find((filter)=> filter === 'MOSQUE') === undefined){
                        setFilterPropertyType([...filterPropertyType, 'MOSQUE']);
                    }else{
                        setFilterPropertyType(filterPropertyType.filter((filter)=> filter !== 'MOSQUE'));
                    }
                }}
                >
                    MOSQUE
                </Badge> */}
                <Badge 
                style={{cursor: 'pointer'}} 
                color={filterPropertyType.length > 0 && filterPropertyType.find((filter)=> filter === 'RESIDENTIAL') === undefined && 'gray'}
                onClick={()=> {
                    if(filterPropertyType.find((filter)=> filter === 'RESIDENTIAL') === undefined){
                        setFilterPropertyType([...filterPropertyType, 'RESIDENTIAL']);
                    }else{
                        setFilterPropertyType(filterPropertyType.filter((filter)=> filter !== 'RESIDENTIAL'));
                    }
                }}
                >
                    RESIDENTIAL
                </Badge>
                <Badge 
                style={{cursor: 'pointer'}} 
                color={filterPropertyType.length > 0 && filterPropertyType.find((filter)=> filter === 'COMMERCIAL') === undefined && 'gray'}
                onClick={()=> {
                    if(filterPropertyType.find((filter)=> filter === 'COMMERCIAL') === undefined){
                        setFilterPropertyType([...filterPropertyType, 'COMMERCIAL']);
                    }else{
                        setFilterPropertyType(filterPropertyType.filter((filter)=> filter !== 'COMMERCIAL'));
                    }
                }}
                >
                    COMMERCIAL
                </Badge>
            </Group>
        );
    }

    return (
        <Stack>
            <Group justify={'space-between'}>
                <Group style={{flex: size.width < 650 && 1}}>
                    <TextInput
                    value={search}
                    onChange={(event) => setSearch(event.currentTarget.value)}
                    placeholder={'Search property name or address...'}
                    styles={{
                        input: {
                            minWidth: '260px'
                        }
                    }}
                    style={{flex: size.width < 650 && 1}}
                    />
                    {size.width > 650 && renderFilterBadges()}
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
            {size.width < 650 && renderFilterBadges()}
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
                        .filter((property)=> filterPropertyType.length > 0 ? filterPropertyType.find((filter)=> property.type === filter) !== undefined : property)
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
            edit={editProperty}
            users={users}
            onClose={()=> {
                setOpenAddPropertyModal(false);
                setEditProperty(null);
            }}
            getProperties={()=> getProperties()}
            />}

            {openPropertyDetailsModal &&
            <PropertyDetailsModal
            selectedProperty={selectedPropertyForDetails}
            opened={openPropertyDetailsModal}
            onClose={()=> setOpenPropertyDetailsModal(false)}
            publishButtonClick={()=> {
                // if(selectedPropertyForDetails.propertyStatus === 'UNPUBLISHED'){
                //     publishProperty([selectedPropertyForDetails.id]);
                // }else{
                //     unpublishProperty([selectedPropertyForDetails.id]);
                // }
                setOpenPropertyDetailsModal(false);
            }}
            editProperty={(propertyToEdit)=> {
                setEditProperty(propertyToEdit);
                setOpenAddPropertyModal(true);
                setOpenPropertyDetailsModal(false);
            }}
            getProperties={()=> getProperties()}
            />}
            {openAddFeatureImageModal &&
            <AddFeatureImageModal
            opened={openAddFeatureImageModal}
            onClose={()=> {
                setOpenAddFeatureImageModal(false);
                setPublishOnFollow(null);
            }}
            propertyId={publishOnFollow}
            getProperties={()=> getProperties()}
            publishOnFollow={publishOnFollow}
            // publishProperty={()=> {
            //     let publishOnFollowProperty = properties.find((property)=> property.id === publishOnFollow);
            //     if(publishOnFollowProperty !== undefined){
            //         publishOnFollowProperty.propertyStatus === 'UNPUBLISHED' ? publishProperty([publishOnFollowProperty.id]) : unpublishProperty([publishOnFollowProperty.id])
            //     }
            // }}
            />}
        </Stack>
    );
}

export default PropertiesPage;
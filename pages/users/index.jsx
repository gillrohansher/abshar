import { ActionIcon, Anchor, AppShell, Badge, Box, Burger, Button, Card, Center, Checkbox, Fieldset, Group, Image, Loader, LoadingOverlay, Menu, NavLink, PasswordInput, Stack, Table, Text, TextInput, useMantineColorScheme } from '@mantine/core';
import { use, useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/navigation'

import { SignInPost } from '../../api/fetchApis/Auth';
import { useAppStore, useAppDispatch, useWindowSize } from '../../lib/hooks';
import { IconCirclePlusFilled, IconTrashFilled, IconLineDotted, IconPencil, IconDotsCircleHorizontal, IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import { ProductDelete, ProductGet, ProductPost, ProductPut } from '../../api/fetchApis/Products';
import { AddProductModal } from '../../components/AddProductModal/AddProductModal';
import { UserDelete, UsersGet } from '../../api/fetchApis/Users';
import { AddUserModal } from '../../components/AddUserModal/AddUserModal';

function UsersPage(props) {
    const size = useWindowSize();
    const store = useAppStore();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [loader, setLoader] = useState(false);
    const [contextMenu, setContextMenu] = useState(false); 
    const [openAddUserModal, setOpenAddUserModal] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [search, setSearch] = useState(null);
    const [activeSorting, setActiveSorting] = useState(null);
    const [onHoverSort, setOnHoverSort] = useState(false);
    const {token, accountData} = store.getState().general;

    useEffect(() => {
        setLoader(true);
        setTimeout(() => {
            getUsers();    
        }, 1000);
    },[]);

    console.log('selectedUsers: ', selectedUsers);
    console.log('openAddUserModal: ', openAddUserModal);
    const getUsers=()=>{
        setLoader(true);
        UsersGet(null, token, res=>{
            if(res?.code === 200){
                setUsers(res.data);
            }
            setLoader(false);
        });
    }

    const deleteUser=(id)=>{
        setLoader(true);
        UserDelete(id, token, res=>{
            if(res?.code === 200){
                showNotification({
                    message: 'User deleted successfully.',
                    color: 'green',
                    id: 'userDeleted'
                });
                getUsers();
            }
            setLoader(false);
        });
    }

    const putUser=(category, type, making, id)=>{
        setLoader(true);
        ProductPut({
            id,
            category, 
            type, 
            making
        }, token, res=>{
            if(res?.code === 200){
                showNotification({
                    message: 'Product updated successfully.',
                    color: 'green',
                    id: 'productUpdated'
                });
                getUsers();
            }
            setLoader(false);
        });
    }

    return (
        <Stack>
            <Group justify={'space-between'}>
                <Group style={{flex: size.width < 650 && 1}}>
                    <TextInput
                    value={search}
                    onChange={(event) => setSearch(event.currentTarget.value)}
                    placeholder={'Search first name, last name, email...'}
                    styles={{
                        input: {
                            minWidth: '250px'
                        }
                    }}
                    style={{flex: size.width < 650 && 1}}
                    />
                </Group>
                <Group>
                    <ActionIcon onClick={()=> setOpenAddUserModal(true)} variant="filled" aria-label="Add User">
                        <IconCirclePlusFilled style={{width: '70%', height: '70%'}}/>
                    </ActionIcon>
                    <ActionIcon disabled={selectedUsers.length === 0} color={'red'} onClick={()=> selectedUsers.length > 0 ? selectedUsers.map((id)=> deleteUser(id)) : showNotification({message: 'No users selected yet', color: 'red', id: 'noProductsSelected'})} variant="filled" aria-label="Delete Product">
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
                users.length > 0 ?
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th style={{width: '30px'}}>
                                <Checkbox styles={{input: {cursor: 'pointer'}}} indeterminate={selectedUsers.length > 0 && selectedUsers.length !== users.length} checked={selectedUsers.length === users.length}  onChange={() => setSelectedUsers(selectedUsers.length === users.length ? [] : users.map((user)=> user.id))}/>
                            </Table.Th>
                            <Table.Th>
                                First name
                            </Table.Th>
                            <Table.Th>
                                Last name
                            </Table.Th>
                            <Table.Th>
                                Gender
                            </Table.Th>
                            <Table.Th>
                                Email
                            </Table.Th>
                            <Table.Th>
                                Type
                            </Table.Th>
                            <Table.Th>
                                Phone
                            </Table.Th>
                            <Table.Th/>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {users.filter((user)=> search ? (user?.firstName?.toLowerCase().includes(search.toLowerCase()) || user?.lastName?.toLowerCase().includes(search.toLowerCase()) || user?.gender?.toLowerCase().includes(search.toLowerCase()) || user?.phone?.toLowerCase().includes(search.toLowerCase()) || user?.email?.toLowerCase().includes(search.toLowerCase()) || user?.type?.toLowerCase().includes(search.toLowerCase()) || user?.status?.toLowerCase().includes(search.toLowerCase())) : user)
                        // .filter((user)=> search ? user.type.includes(search) : user)
                        // .filter((user)=> search ? user.making.includes(search) : user)
                        .map((user)=>
                        <Table.Tr>
                            <Table.Td>
                                <Checkbox 
                                styles={{input: {cursor: 'pointer'}}}
                                checked={selectedUsers.find((selectedProduct)=> selectedProduct === user.id) !== undefined ? true : false}  
                                onChange={() => {
                                    if(selectedUsers.find((selectedProduct)=> selectedProduct === user.id) !== undefined){
                                        setSelectedUsers(selectedUsers.filter((selectedProduct)=> selectedProduct !== user.id))
                                    }else{
                                        // var newSelectedProducts = selectedUsers;
                                        // newSelectedProducts.push(user.id);
                                        setSelectedUsers([...selectedUsers, user.id]);
                                    }
                                }}/>
                            </Table.Td>
                            <Table.Td>
                                <Group wrap='nowrap'>
                                    {user.firstName}
                                    {accountData.id === user.id && <Badge>Current login account</Badge>}
                                </Group>
                                
                            </Table.Td>
                            <Table.Td>
                                {user.lastName}
                            </Table.Td>
                            <Table.Td>
                                {user.gender}
                            </Table.Td>
                            <Table.Td>
                                {user.email}
                            </Table.Td>
                            <Table.Td>
                                {user.phone}
                            </Table.Td>
                            <Table.Td>
                                {user.type}
                            </Table.Td>
                            <Table.Td style={{textAlign: 'right'}}>
                                {accountData.id !== user.id && <Menu>
                                    <Menu.Target>
                                        <ActionIcon onClick={()=> setContextMenu(!contextMenu)} variant="transparent" aria-label="Add Product">
                                            <IconDotsCircleHorizontal style={{width: '80%', height: '80%'}}/>
                                        </ActionIcon>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Item 
                                        onClick={()=> {
                                            setOpenAddUserModal(true);
                                            setEditUser(user);
                                        }}>
                                            <Group wrap={'nowrap'} gap='xs'>
                                                <ActionIcon variant="filled" aria-label="Delete Product">
                                                    <IconPencil style={{width: '60%', height: '60%'}}/>
                                                </ActionIcon>
                                                <Text size={'md'}>Edit</Text>
                                            </Group>
                                        </Menu.Item>
                                        <Menu.Item onClick={()=> deleteUser(user.id)}>
                                            <Group wrap={'nowrap'} gap='xs'>
                                                <ActionIcon color={'red'} variant="filled" aria-label="Delete Product">
                                                    <IconTrashFilled style={{width: '60%', height: '60%'}}/>
                                                </ActionIcon>
                                                <Text size={'md'}>Delete</Text>
                                            </Group>
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>}
                            </Table.Td>
                        </Table.Tr>)}
                    </Table.Tbody>
                </Table>
                :
                <Center h={'100vh'} w={'100%'}>
                    No data available.
                </Center>
                }
            </Group>
            {openAddUserModal &&
            <AddUserModal
            opened={openAddUserModal}
            onClose={()=> setOpenAddUserModal(false)}
            getUsers={()=> { 
                getUsers();
                setOpenAddUserModal(false);
            }}
            />}
        </Stack>
    );
}

export default UsersPage;
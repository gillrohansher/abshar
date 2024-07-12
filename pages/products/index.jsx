import { ActionIcon, Anchor, AppShell, Box, Burger, Button, Card, Center, Checkbox, Fieldset, Group, Image, Loader, LoadingOverlay, Menu, NavLink, PasswordInput, Stack, Table, Text, TextInput, useMantineColorScheme } from '@mantine/core';
import { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/navigation'

import { SignInPost } from '../../api/fetchApis/Auth';
import { useAppStore, useAppDispatch } from '../../lib/hooks';
import { IconCirclePlusFilled, IconTrashFilled, IconLineDotted, IconPencil } from '@tabler/icons-react';
import { ProductDelete, ProductGet, ProductPost, ProductPut } from '../../api/fetchApis/Products';
import { AddProductModal } from '../../components/AddProductModal/AddProductModal';

function ProductsPage(props) {
    const store = useAppStore();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [loader, setLoader] = useState(false);
    const [contextMenu, setContextMenu] = useState(false); 
    const [openAddProductModal, setOpenAddProductModal] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [editProduct, setEditProduct] = useState(null);
    const {token} = store.getState().general;

    useEffect(() => {
        setLoader(true);
        setTimeout(() => {
            getProducts();    
        }, 1000);
    },[]);

    const getProducts=()=>{
        setLoader(true);
        ProductGet(null, token, res=>{
            if(res?.code === 200){
                setProducts(res.data);
            }
            setLoader(false);
        });
    }
    
    const postProduct=(category, type, making)=>{
        setLoader(true);
        ProductPost({
            category, 
            type, 
            making
        }, token, res=>{
            if(res?.code === 200){
                getProducts();
            }
            setLoader(false);
        });
    }

    const deleteProduct=(id)=>{
        setLoader(true);
        ProductDelete(id, token, res=>{
            if(res?.code === 200){
                getProducts();
            }
            setLoader(false);
        });
    }

    const putProduct=(category, type, making, id)=>{
        setLoader(true);
        ProductPut({
            id,
            category, 
            type, 
            making
        }, token, res=>{
            if(res?.code === 200){
                getProducts();
            }
            setLoader(false);
        });
    }

    return (
        <Stack>
            <Group justify={'flex-end'}>
                <ActionIcon onClick={()=> setOpenAddProductModal(true)} variant="filled" aria-label="Add Product">
                    <IconCirclePlusFilled style={{width: '70%', height: '70%'}}/>
                </ActionIcon>
                <ActionIcon onClick={()=> selectedProducts.length > 0 ? selectedProducts.map((id)=> deleteProduct(id)) : showNotification({message: 'No products selected yet', color: 'red', id: 'noProductsSelected'})} variant="filled" aria-label="Delete Product">
                    <IconTrashFilled style={{width: '70%', height: '70%'}}/>
                </ActionIcon>
            </Group>
            <Group>
                {loader ?
                <Center h={'100vh'} w={'100%'}>
                    <Loader/>
                </Center>
                :
                products.length > 0 ?
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>
                                <Checkbox checked={selectedProducts.length === products.length}  onChange={() => setSelectedProducts(selectedProducts.length === products.length ? [] : products.map((product)=> product.id))}/>
                            </Table.Th>
                            <Table.Th>
                                Category
                            </Table.Th>
                            <Table.Th>
                                Type
                            </Table.Th>
                            <Table.Th>
                                Making
                            </Table.Th>
                            <Table.Th/>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {products.map((product)=>
                        <Table.Tr>
                            <Table.Td>
                                <Checkbox checked={selectedProducts.find((selectedProduct)=> selectedProduct.id === product.id) !== undefined ? true : false}  onChange={() => setSelectedProducts(selectedProducts.find((selectedProduct)=> selectedProduct.id === product.id) !== undefined ? selectedProducts.filter((selectedProduct)=> selectedProduct.id !== product.id) : [...selectedProducts, product.id])}/>
                            </Table.Td>
                            <Table.Td>
                                {product.category}
                            </Table.Td>
                            <Table.Td>
                                {product.type}
                            </Table.Td>
                            <Table.Td>
                                {product.making}
                            </Table.Td>
                            <Table.Td>
                                <Menu>
                                    <Menu.Target>
                                        <ActionIcon onClick={()=> setContextMenu(!contextMenu)} variant="transparent" aria-label="Add Product">
                                            <IconLineDotted style={{width: '60%', height: '60%'}}/>
                                        </ActionIcon>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Item>
                                            <ActionIcon onClick={()=> deleteProduct(product.id)} variant="filled" aria-label="Delete Product">
                                                <IconTrashFilled style={{width: '60%', height: '60%'}}/>
                                            </ActionIcon>
                                        </Menu.Item>
                                        <Menu.Item>
                                            <ActionIcon 
                                            onClick={()=> {
                                                setOpenAddProductModal(true);
                                                setEditProduct(product);
                                            }} variant="filled" aria-label="Delete Product">
                                                <IconPencil style={{width: '60%', height: '60%'}}/>
                                            </ActionIcon>
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                                
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
            {openAddProductModal &&
            <AddProductModal
            opened={openAddProductModal}
            edit={editProduct}
            onClose={()=> setOpenAddProductModal(false)}
            addProduct={(category, type, making)=> {
                postProduct(category, type, making);
                setOpenAddProductModal(false);
            }}
            editProduct={(category, type, making, id)=> {
                putProduct(category, type, making, id);
                setOpenAddProductModal(false);
            }}
            />}
        </Stack>
    );
}

export default ProductsPage;
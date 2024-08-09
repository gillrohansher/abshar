import { ActionIcon, Anchor, AppShell, Box, Burger, Button, Card, Center, Checkbox, Fieldset, Group, Image, Loader, LoadingOverlay, Menu, NavLink, PasswordInput, Stack, Table, Text, TextInput, useMantineColorScheme } from '@mantine/core';
import { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/navigation'

import { SignInPost } from '../../api/fetchApis/Auth';
import { useAppStore, useAppDispatch, useWindowSize } from '../../lib/hooks';
import { IconCirclePlusFilled, IconTrashFilled, IconLineDotted, IconPencil, IconDotsCircleHorizontal } from '@tabler/icons-react';
import { ProductDelete, ProductGet, ProductPost, ProductPut } from '../../api/fetchApis/Products';
import { AddProductModal } from '../../components/AddProductModal/AddProductModal';

function ProductsPage(props) {
    const size = useWindowSize();
    const store = useAppStore();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [loader, setLoader] = useState(false);
    const [contextMenu, setContextMenu] = useState(false); 
    const [openAddProductModal, setOpenAddProductModal] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [editProduct, setEditProduct] = useState(null);
    const [search, setSearch] = useState(null);
    const {token} = store.getState().general;

    useEffect(() => {
        setLoader(true);
        setTimeout(() => {
            getProducts();    
        }, 1000);
    },[]);

    console.log('selectedProducts: ', selectedProducts);
    const getProducts=()=>{
        setLoader(true);
        ProductGet(null, token, res=>{
            if(res?.code === 200){
                setProducts(res.data);
            }
            setLoader(false);
        });
    }
    
    const postProduct=(category, type, making, isOptimizer)=>{
        setLoader(true);
        ProductPost({
            category, 
            type, 
            making,
            isOptimizer
        }, token, res=>{
            if(res?.code === 200){
                showNotification({
                    message: 'Product added successfully.',
                    color: 'green',
                    id: 'productAdded'
                });
                getProducts();
            }
            setLoader(false);
        });
    }

    const deleteProduct=(id)=>{
        setLoader(true);
        ProductDelete(id, token, res=>{
            if(res?.code === 200){
                showNotification({
                    message: 'Product deleted successfully.',
                    color: 'green',
                    id: 'productDeleted'
                });
                getProducts();
            }
            setLoader(false);
        });
    }

    const putProduct=(category, type, making, isOptimizer, id)=>{
        setLoader(true);
        ProductPut({
            id,
            category, 
            type, 
            making,
            isOptimizer
        }, token, res=>{
            if(res?.code === 200){
                showNotification({
                    message: 'Product updated successfully.',
                    color: 'green',
                    id: 'productUpdated'
                });
                getProducts();
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
                    placeholder={'Search category, type or making...'}
                    styles={{
                        input: {
                            minWidth: '250px'
                        }
                    }}
                    style={{flex: size.width < 650 && 1}}
                    />
                </Group>
                <Group>
                    <ActionIcon onClick={()=> setOpenAddProductModal(true)} variant="filled" aria-label="Add Product">
                        <IconCirclePlusFilled style={{width: '70%', height: '70%'}}/>
                    </ActionIcon>
                    <ActionIcon disabled={selectedProducts.length === 0} color={'red'} onClick={()=> selectedProducts.length > 0 ? selectedProducts.map((id)=> deleteProduct(id)) : showNotification({message: 'No products selected yet', color: 'red', id: 'noProductsSelected'})} variant="filled" aria-label="Delete Product">
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
                products.length > 0 ?
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th style={{width: '30px'}}>
                                <Checkbox styles={{input: {cursor: 'pointer'}}} indeterminate={selectedProducts.length > 0 && selectedProducts.length !== products.length} checked={selectedProducts.length === products.length}  onChange={() => setSelectedProducts(selectedProducts.length === products.length ? [] : products.map((product)=> product.id))}/>
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
                        {products.filter((product)=> search ? (product.category.toLowerCase().includes(search.toLowerCase()) || product.type.toLowerCase().includes(search.toLowerCase()) || product.making.toLowerCase().includes(search.toLowerCase())) : product)
                        // .filter((product)=> search ? product.type.includes(search) : product)
                        // .filter((product)=> search ? product.making.includes(search) : product)
                        .map((product)=>
                        <Table.Tr>
                            <Table.Td>
                                <Checkbox 
                                styles={{input: {cursor: 'pointer'}}}
                                checked={selectedProducts.find((selectedProduct)=> selectedProduct === product.id) !== undefined ? true : false}  
                                onChange={() => {
                                    if(selectedProducts.find((selectedProduct)=> selectedProduct === product.id) !== undefined){
                                        setSelectedProducts(selectedProducts.filter((selectedProduct)=> selectedProduct !== product.id))
                                    }else{
                                        // var newSelectedProducts = selectedProducts;
                                        // newSelectedProducts.push(product.id);
                                        setSelectedProducts([...selectedProducts, product.id]);
                                    }
                                }}/>
                            </Table.Td>
                            <Table.Td>
                                {product.category}
                            </Table.Td>
                            <Table.Td>
                                {product.type}
                            </Table.Td>
                            <Table.Td>
                                {product.making === 'OUTSOURCE' ? 'Outsource' : product.making === 'IN_HOUSE' && 'In house'}
                            </Table.Td>
                            <Table.Td style={{textAlign: 'right'}}>
                                <Menu>
                                    <Menu.Target>
                                        <ActionIcon onClick={()=> setContextMenu(!contextMenu)} variant="transparent" aria-label="Add Product">
                                            <IconDotsCircleHorizontal style={{width: '80%', height: '80%'}}/>
                                        </ActionIcon>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Item 
                                        onClick={()=> {
                                            setOpenAddProductModal(true);
                                            setEditProduct(product);
                                        }}>
                                            <Group wrap={'nowrap'} gap='xs'>
                                                <ActionIcon variant="filled" aria-label="Delete Product">
                                                    <IconPencil style={{width: '60%', height: '60%'}}/>
                                                </ActionIcon>
                                                <Text size={'md'}>Edit</Text>
                                            </Group>
                                        </Menu.Item>
                                        <Menu.Item onClick={()=> deleteProduct(product.id)}>
                                            <Group wrap={'nowrap'} gap='xs'>
                                                <ActionIcon color={'red'} variant="filled" aria-label="Delete Product">
                                                    <IconTrashFilled style={{width: '60%', height: '60%'}}/>
                                                </ActionIcon>
                                                <Text size={'md'}>Delete</Text>
                                            </Group>
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
            products={products}
            onClose={()=> {setOpenAddProductModal(false); setEditProduct(null);}}
            addProduct={(category, type, making, isOptimizer)=> {
                postProduct(category, type, making, isOptimizer);
                setOpenAddProductModal(false);
                setEditProduct(null);
            }}
            editProduct={(category, type, making, isOptimizer, id)=> {
                putProduct(category, type, making, isOptimizer, id);
                setOpenAddProductModal(false);
                setEditProduct(null);
            }}
            />}
        </Stack>
    );
}

export default ProductsPage;
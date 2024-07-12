import { Button, Group, Modal, Stack, TextInput, useMantineColorScheme } from '@mantine/core';
import { useEffect } from 'react';
import { useState } from 'react';

export function AddProductModal({opened, onClose, addProduct, editProduct, edit}) {
const [category, setCategory] = useState(edit?.category);
const [type, setType] = useState(edit?.type);
const [making, setMaking] = useState(edit?.making);
const [categoryError, setCategoryError] = useState(false);
const [typeError, setTypeError] = useState(false);
const [makingError, setMakingError] = useState(false);

const validate=()=>{
    setCategoryError(category ? false : 'required');
    setTypeError(type ? false : 'required');
    setMakingError(making ? false : 'required');

    if(category && type && making){
        return true;
    }else{
        return false;
    }
}

useEffect(() => {
    console.log('errors: ', categoryError, typeError, makingError);
});
  return (
    <Modal opened={opened} onClose={onClose} title="Add Product" centered>
        <Stack>
            <TextInput
            label="Category"
            value={category}
            required
            error={categoryError}
            onChange={(event) => {
                setCategoryError(false);
                setCategory(event.currentTarget.value);
            }}
            />
            <TextInput
            label="Type"
            value={type}
            required
            error={typeError}
            onChange={(event) => {
                setTypeError(false);
                setType(event.currentTarget.value);
            }}
            />
            <TextInput
            label="Making"
            value={making}
            required
            error={makingError}
            onChange={(event) => {
                setMakingError(false);
                setMaking(event.currentTarget.value);
            }}
            />
            <Group justify={'space-between'}>
                <Button style={{background: 'rgba(0, 0, 0, 0.39)'}} className='general-buttons' onClick={()=> onClose()}>
                    Cancel
                </Button>
                <Button className='general-buttons' onClick={()=> validate() && (edit ? editProduct(category, type, making, edit?.id) : addProduct(category, type, making))}>
                    Add
                </Button>
            </Group>
            
        </Stack>
    </Modal>
  );
}

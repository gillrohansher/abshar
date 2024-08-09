import { Button, Group, Modal, Select, Stack, Switch, TextInput, useMantineColorScheme } from '@mantine/core';
import { useEffect } from 'react';
import { useState } from 'react';

export function AddProductModal({opened, onClose, addProduct, editProduct, edit, products}) {
const [categoriesData, setCategoriesData] = useState([...products.reduce((acc, current) => {
    if (!acc.some(item => item.category === current.category)) {
      acc.push(current);
    }
    return acc;
  }, []).map((product)=> ({value: product.category, label: product.category}))]);
const [othercategory, setOtherCategory] = useState(edit?.category);
const [selectedCategory, setSelectedCategory] = useState(edit?.category);

const [typesData, setTypesData] = useState([...products.reduce((acc, current) => {
    if (!acc.some(item => item.type === current.type)) {
      acc.push(current);
    }
    return acc;
  }, []).map((product)=> ({value: product.type, label: product.type})), {value: 'other', label: 'Other'}]);
const [otherType, setOtherType] = useState(edit?.type);
const [selectedType, setSelectedType] = useState(edit?.type);

const [making, setMaking] = useState(edit?.making);
const [categoryError, setCategoryError] = useState(false);
const [typeError, setTypeError] = useState(false);
const [makingError, setMakingError] = useState(false);
const [isOptimizer, setIsOptimizer] = useState(edit?.isOptimizer);

const validate=()=>{
    setCategoryError((selectedCategory === 'other' ? othercategory : selectedCategory) ? false : 'required');
    setTypeError((selectedType === 'other' ? otherType : selectedType) ? false : 'required');
    setMakingError(making ? false : 'required');

    if((selectedCategory === 'other' ? othercategory : selectedCategory) && (selectedType === 'other' ? otherType : selectedType) && making){
        return true;
    }else{
        return false;
    }
}

useEffect(() => {
    if(making){
        setMakingError(false);
    }
    if(selectedCategory || othercategory){
        setCategoryError(false);
    }
    if(selectedType || otherType){
        setTypeError(false);
    }
}, [making, selectedCategory, othercategory, selectedType, otherType]);
  return (
    <Modal opened={opened} onClose={onClose} title="Add product" centered>
        <Stack>
            {/* Category */}
            <Select
            label="Category"
            searchable
            data={categoriesData}
            value={selectedCategory}
            required
            error={selectedCategory !== 'other' && categoryError}
            onChange={setSelectedCategory}
            />

            {selectedCategory === 'other' && 
            <TextInput
            label="New category name"
            value={othercategory}
            required
            error={categoryError}
            onChange={(event) => {
                setCategoryError(false);
                setOtherCategory(event.currentTarget.value);
            }}
            />}

            {/* Type */}
            <Select
            label="Type"
            searchable
            data={typesData}
            value={selectedType}
            required
            error={selectedType !== 'other' && typeError}
            onChange={setSelectedType}
            />
            {selectedType === 'other' && 
            <TextInput
            label="New type name"
            value={otherType}
            required
            error={typeError}
            onChange={(event) => {
                setTypeError(false);
                setOtherType(event.currentTarget.value);
            }}
            />}

            {/* Making */}
            <Select
            label="Making"
            data={[{value: "OUTSOURCE", label: "Outsource"}, {value: "IN_HOUSE", label: "In house"}]}
            value={making}
            required
            error={makingError}
            onChange={setMaking}
            />

            {/* isOptimizer */}
            <Switch
            checked={isOptimizer}
            onChange={(event) => setIsOptimizer(event.currentTarget.checked)}
            label={'Optimizer'}
            />
            <Group justify={'space-between'}>
                <Button style={{background: 'rgba(0, 0, 0, 0.39)'}} className='general-buttons' onClick={()=> onClose()}>
                    Cancel
                </Button>
                <Button className='general-buttons' onClick={()=> validate() && (edit ? editProduct(selectedCategory !== 'other' ? selectedCategory : othercategory, selectedType !== 'other' ? selectedType : otherType, making, isOptimizer, edit?.id) : addProduct(selectedCategory !== 'other' ? selectedCategory : othercategory, selectedType !== 'other' ? selectedType : otherType, making, isOptimizer))}>
                    {edit ? 'Save' : 'Add'}
                </Button>
            </Group>
            
        </Stack>
    </Modal>
  );
}

import { Button, Center, FileInput, Group, Loader, Modal, Select, Stack, Text, TextInput, useMantineColorScheme } from '@mantine/core';
import { useEffect, useState } from 'react';
import { IconPhotoOff } from '@tabler/icons-react';
import { PropertyUploadFeatureImagePost } from '@/api/fetchApis/Properties';
import { compressImage } from '@/helpers/helpers';
import { useAppStore } from '@/lib/hooks';
import { showNotification } from '@mantine/notifications';

export function AddFeatureImageModal({opened, onClose, propertyId, getProperties, publishOnFollow, publishProperty, editFeatureImage}) {
    const [file, setFile] = useState(editFeatureImage ? editFeatureImage : null);
    const [loader, setLoader] = useState(false);
    const store = useAppStore();
    const {token} = store.getState().general;

    const uploadFeatureImage=()=>{
        setLoader(true);
        const callApi=(data)=>{
            PropertyUploadFeatureImagePost(data, token, res=>{
                console.log('PropertyUploadFeatureImagePost: ', res);
                if(res?.code === 200){
                    showNotification({
                        message: 'Property feature image uploaded successfully.',
                        color: 'green'
                    });

                    // if(publishOnFollow){
                    //     publishProperty();
                    // }else{
                        getProperties();
                    //}

                    onClose();
                }
                setLoader(false);
            });
        }
        let data = new FormData();
        data.append('propertyId', propertyId);
        if(file.size > 10000){
            compressImage(file).then(value=> {
                console.log('compressImage: ', value);
                data.append('image', value);
                callApi(data);
            });
        }else{
            data.append('image', file);
            callApi(data);
        }
    }

    return (
    <Modal opened={opened} onClose={onClose} title={editFeatureImage ? "Replace feature image" : "Add feature image"} centered>
        <Stack>
            {loader ?
            <Center h={'350px'} w={'100%'}>
                <Loader/>
            </Center>
            :
            <>
                <FileInput clearable={file?.id === undefined} value={file} onChange={(newFile)=> newFile ? setFile(newFile) : editFeatureImage ? setFile(editFeatureImage) : setFile(null)} accept="image/png,image/jpeg" />
                <Group grow style={{background: 'grey', padding: '10px', borderRadius: '4px'}}>
                    <Group justify={'center'}>
                        {file ?
                            <img src={file.id !== undefined ? file.path : URL.createObjectURL(file)} style={{height: '237px', maxWidth: '380px', objectFit: 'cover'}} />
                            :
                            <Stack style={{height: '237px', borderRadius: '2px'}} justify='center' align={'center'}>
                                <IconPhotoOff
                                color={'white'}
                                />
                                <Text size={'xs'} style={{color: 'white'}}>{"No featured image available"}</Text>
                            </Stack>
                        }
                    </Group>
                </Group>
            </>}
            
            <Group justify={'space-between'} style={{width: '100%'}}>
                <Button color={'gray'} onClick={()=> onClose()}>Cancel</Button>
                <Button onClick={()=> uploadFeatureImage()} disabled={file === null}>{editFeatureImage ? 'Save' : 'Upload'}</Button>
            </Group>
        </Stack>
    </Modal>
    );
}

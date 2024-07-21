import { Button, Center, FileInput, Group, Loader, Modal, Select, Stack, Text, TextInput, useMantineColorScheme } from '@mantine/core';
import { useEffect, useState } from 'react';
import { IconPhotoOff } from '@tabler/icons-react';
import { PropertyUploadFeatureImagePost } from '@/api/fetchApis/Properties';
import { compressImage } from '@/helpers/helpers';
import { useAppStore } from '@/lib/hooks';
import { showNotification } from '@mantine/notifications';

export function ExpandImageModal({opened, onClose, image}) {

    return (
    <Modal opened={opened} onClose={onClose} size='auto' centered>
        <Stack>
            <Group>
                <img src={image} style={{width: '100%', maxHeight: '100vh'}}/>
            </Group> 
            <Group justify={'flex-start'} style={{width: '100%'}}>
                <Button color={'gray'} onClick={()=> onClose()}>Close</Button>
            </Group>
        </Stack>
    </Modal>
    );
}

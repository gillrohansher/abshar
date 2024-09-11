'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Image, Text, Badge, Button, Group, Center, Loader, Stack, Grid } from '@mantine/core';
import { DonutChart } from '@mantine/charts';

import { useAppStore, useAppDispatch } from '../../lib/hooks';

function DashboardUsersCard(props) {
    const store = useAppStore();
    const dispatch = useAppDispatch();
    const router = useRouter();
    // const [loader, setLoader] = useState(false);
    const [data, setData] = useState([
        { name: 'ADMIN', value: 0, color: '#5185a6' },
        { name: 'SURVEYOR', value: 0, color: '#10516f' },
        { name: 'CLIENT', value: 0, color: '#9baebc' },
    ]);

    useEffect(() => {
        console.log('props.users: ', props.users);
        setData(data.map((userType)=> {
            let selectedUsers= props.users.filter((user)=> user.type === userType.name);
            if(selectedUsers.length > 0){
                userType.value= selectedUsers.length;
            }
            return userType;
        }));
    }, [props.users]);

    console.log('data: ', data);

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder style={{cursor: 'pointer'}} onClick={()=> router.push('/properties')}>
            {props.loader ?
            <Center h={'200px'} w={'100%'}>
                <Loader/>
            </Center>
            :
            <Stack>
                <Group justify="space-between" mb="xs">
                    <Text fw={'bold'}>Users</Text>
                </Group>
                <Grid>
                    <Grid.Col span={7}>
                        <DonutChart withTooltip={false} data={data} />
                    </Grid.Col>
                    <Grid.Col span={5}>
                        <Stack style={{height: '100%'}} justify={'center'}>
                            <Group wrap='nowrap'>
                                <Badge color="#5185a6">{`${data.find((dt)=> dt.name === 'ADMIN')?.value} - ADMIN`}</Badge>
                            </Group>
                            <Group wrap='nowrap'>
                                <Badge color="#10516f">{`${data.find((dt)=> dt.name === 'CLIENT')?.value} - CLIENT`}</Badge>
                            </Group>
                            <Group wrap='nowrap'>
                                <Badge color="#9baebc">{`${data.find((dt)=> dt.name === 'SURVEYOR')?.value} - SURVEYOR`}</Badge>
                            </Group>
                        </Stack>
                    </Grid.Col>
                </Grid>
                
            </Stack>}
        </Card>
    );
}

export default DashboardUsersCard;
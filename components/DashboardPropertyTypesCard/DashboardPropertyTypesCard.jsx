'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Image, Text, Badge, Button, Group, Center, Loader, Stack, Grid } from '@mantine/core';
import { DonutChart } from '@mantine/charts';

import { useAppStore, useAppDispatch } from '../../lib/hooks';
import { PropertiesGet } from '@/api/fetchApis/Properties';

function DashboardPropertyTypesCard(props) {
    const store = useAppStore();
    const {token} = store.getState().general;
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [loader, setLoader] = useState(false);
    const [data, setData] = useState([
        { name: 'MOSQUE', value: 0, color: '#5185a6' },
        { name: 'COMMERCIAL', value: 0, color: '#10516f' },
        { name: 'RESIDENTIAL', value: 0, color: '#9baebc' },
    ]);

    useEffect(() => {
        getProperties();
    }, []);

    console.log('data: ', data);

    const getProperties=()=>{
        setLoader(true);
        PropertiesGet(null, token, res=>{
            if(res?.code === 200){
                setData(data.map((propertyType)=> {
                    let propertyTypeArray= res?.data.filter((property)=> property.type === propertyType.name);
                    if(propertyTypeArray.length > 0){
                        propertyType.value= propertyTypeArray.length;
                    }
                    return propertyType;
                }))
            }
            setLoader(false);
        });
    }

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            {loader ?
            <Center h={'200px'} w={'100%'}>
                <Loader/>
            </Center>
            :
            <Stack>
                <Group justify="space-between" mb="xs">
                    <Text fw={500}>Properties by type</Text>
                    {/* <Badge color="pink">Updated</Badge> */}
                </Group>
                <Grid>
                    <Grid.Col span={7}>
                        <DonutChart withTooltip={false} data={data} />
                    </Grid.Col>
                    <Grid.Col span={5}>
                        <Stack style={{height: '100%'}} justify={'center'}>
                            <Group wrap='nowrap'>
                                <Text>{data.find((dt)=> dt.name === 'MOSQUE').value}</Text>
                                <Badge color="#5185a6">MOSQUE</Badge>
                            </Group>
                            <Group wrap='nowrap'>
                                <Text>{data.find((dt)=> dt.name === 'COMMERCIAL').value}</Text>
                                <Badge color="#10516f">COMMERCIAL</Badge>
                            </Group>
                            <Group wrap='nowrap'>
                                <Text>{data.find((dt)=> dt.name === 'RESIDENTIAL').value}</Text>
                                <Badge color="#9baebc">RESIDENTIAL</Badge>
                            </Group>
                        </Stack>
                    </Grid.Col>
                </Grid>
                
            </Stack>}
        </Card>
    );
}

export default DashboardPropertyTypesCard;
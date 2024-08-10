'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Image, Text, Badge, Button, Group, Center, Loader, Stack, Grid } from '@mantine/core';
import { DonutChart } from '@mantine/charts';

import { useAppStore, useAppDispatch } from '../../lib/hooks';
import { PropertiesGet } from '@/api/fetchApis/Properties';

function DashboardPropertyTypesCard(props) {
    const store = useAppStore();
    const dispatch = useAppDispatch();
    const router = useRouter();
    // const [loader, setLoader] = useState(false);
    const [data, setData] = useState([
        { name: 'MOSQUE', value: 0, color: '#5185a6' },
        { name: 'COMMERCIAL', value: 0, color: '#10516f' },
        { name: 'RESIDENTIAL', value: 0, color: '#9baebc' },
    ]);

    useEffect(() => {
        setData(data.map((propertyType)=> {
            let selectedProperty= props.properties.find((property)=> property.propertyType === propertyType.name);
            if(selectedProperty !== undefined){
                propertyType.value= selectedProperty.count;
            }
            return propertyType;
        }));
    }, [props.properties]);

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
                    <Text fw={500}>Properties</Text>
                </Group>
                <Grid>
                    <Grid.Col span={7}>
                        <DonutChart withTooltip={false} data={data} />
                    </Grid.Col>
                    <Grid.Col span={5}>
                        <Stack style={{height: '100%'}} justify={'center'}>
                            <Group wrap='nowrap'>
                                <Badge color="#5185a6">{`${data.find((dt)=> dt.name === 'MOSQUE')?.value} - MOSQUE`}</Badge>
                            </Group>
                            <Group wrap='nowrap'>
                                <Badge color="#10516f">{`${data.find((dt)=> dt.name === 'COMMERCIAL')?.value} - COMMERCIAL`}</Badge>
                            </Group>
                            <Group wrap='nowrap'>
                                <Badge color="#9baebc">{`${data.find((dt)=> dt.name === 'RESIDENTIAL')?.value} - RESIDENTIAL`}</Badge>
                            </Group>
                        </Stack>
                    </Grid.Col>
                </Grid>
                
            </Stack>}
        </Card>
    );
}

export default DashboardPropertyTypesCard;
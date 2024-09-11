'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Image, Text, Badge, Button, Group, Center, Loader, Stack, Grid } from '@mantine/core';
import { AreaChart } from '@mantine/charts';

import { useAppStore, useAppDispatch } from '../../lib/hooks';
import dayjs from 'dayjs';

function DashboardWaterFlowRate(props) {
    const store = useAppStore();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {token, accountData} = store.getState().general;
    // const [loader, setLoader] = useState(false);
    const [data, setData] = useState([]);

    // useEffect(() => {
    //     setData(data.map((propertyType)=> {
    //         let selectedProperty= props.properties.find((property)=> property.propertyType === propertyType.name);
    //         if(selectedProperty !== undefined){
    //             propertyType.value= selectedProperty.count;
    //         }
    //         return propertyType;
    //     }));
    // }, [props.properties]);

    useEffect(()=> {
        const last12Hours = [];
        
        for (let i = 0; i < 12; i++) {
          last12Hours.push(dayjs().subtract(i, 'hour').format('HH:00'));  // You can customize the format as needed
        }
        setData(last12Hours.map((hour)=> ({
            hour,
            liters: Math.floor(Math.random() * (30 - 25 + 1)) + 25
        })))
    }, [])

    console.log('data: ', data);

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder style={{cursor: 'pointer'}} onClick={()=> router.push('/properties')}>
            {<Stack>
                <Group justify="space-between" mb="xs">
                    <Text fw={'bold'}>Water flow rate</Text>
                </Group>
                <Group style={{width: '100%'}} align='center' justify={'center'}>
                    {data.length > 0 &&
                    <AreaChart
                    h={accountData.type === 'ADMIN' ? 320 : 180}
                    data={data}
                    dataKey="hour"
                    series={[{ name: 'liters', color: '#5185a6' }]}
                    areaChartProps={{ syncId: 'groceries' }}
                    />}
                </Group>
            </Stack>}
        </Card>
    );
}

export default DashboardWaterFlowRate;
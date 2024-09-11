'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Image, Text, Badge, Button, Group, Center, Loader, Stack, Grid, Alert } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

import { useAppStore, useAppDispatch } from '../../lib/hooks';
import dayjs from 'dayjs';

function DashboardLeakAlert(props) {
    const store = useAppStore();
    const dispatch = useAppDispatch();
    const router = useRouter();
    // const [loader, setLoader] = useState(false);
    const [data, setData] = useState([]);
    const [peakTime, setPeakTime] = useState(null);
    const [lastMaintenance, setLastMaintenance] = useState(null);
    const [leakDetected, setLeakDetected] = useState(false);//useState(Math.random() < 0.5);

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
        })));


        // Generate a random hour between 10 AM and 9 PM
        const randomHour = Math.floor(Math.random() * (21 - 10 + 1)) + 10;

        // Generate a random minute (0-59)
        const randomMinute = Math.floor(Math.random() * 60);

        // Create the dayjs object with the random time
        setPeakTime(dayjs().hour(randomHour).minute(randomMinute).second(0));
        console.log('peakTime: ', peakTime);

        setLastMaintenance(dayjs().subtract(7, 'day'));
    }, [])

    console.log('data: ', data);

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder style={{cursor: 'pointer'}}>
            <Group justify="space-between" mb="xs">
                <Text fw={'bold'}>General information</Text>
            </Group>
            {<Stack style={{height: '100%'}} gap={0}>
                <Group justify="space-between" mb="xs">
                    <Text fw={400} size={'sm'}>Monthly consumption: </Text>
                    <Text fw={400} size={'sm'}>450,000.00 Liters</Text>
                </Group>
                <Group justify="space-between" mb="xs">
                    <Text fw={400} size={'sm'}>Environmental impact: </Text>
                    <Text fw={400} size={'sm'}>50,000.00 Liters</Text>
                </Group>
                <Group justify="space-between" mb="xs">
                    <Text fw={400} size={'sm'}>Yesterday peak usage time: </Text>
                    <Text fw={400} size={'sm'}>{peakTime ? peakTime.format('hh:mm A') : '-'}</Text>
                </Group>
                <Group justify="space-between" mb="xs">
                    <Text fw={400} size={'sm'}>Last maintance status: </Text>
                    <Text fw={400} size={'sm'}>{lastMaintenance ? lastMaintenance.format('DD MMM YYYY') : '-'}</Text>
                </Group>
                <Group style={{width: '100%'}} grow>
                    <Alert style={{padding: '10px'}} variant="light" color={leakDetected ? "red" : "#10516f"} title="Leak alert" icon={<IconInfoCircle />}>
                        <Stack gap={0}>
                            {leakDetected ? <span>Leak detected. please contact support.</span> : <span>No leak found.</span>}
                        </Stack>
                    </Alert>
                </Group>
            </Stack>}
        </Card>
    );
}

export default DashboardLeakAlert;
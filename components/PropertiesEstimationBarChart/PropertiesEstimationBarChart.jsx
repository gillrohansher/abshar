'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Image, Text, Badge, Button, Group, Center, Loader, Stack, Grid, ColorSwatch } from '@mantine/core';
import { BarChart, DonutChart } from '@mantine/charts';

import { useAppStore, useAppDispatch } from '../../lib/hooks';
import accounting from 'accounting-js'

function PropertiesEstimationBarChart(props) {
    const store = useAppStore();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [data, setData] = useState([
        { item: 'Water', 'Without optimizer': props?.propertiesEstimation?.estimatedWaterConsumption, 'With optimizer': props?.propertiesEstimation?.estimatedWaterConsumptionWithOptimizer, 'Impact': props?.propertiesEstimation?.estimatedWaterImpact },
        { item: 'Electricity', 'Without optimizer': props?.propertiesEstimation?.estimatedElectricityUsage, 'With optimizer': props?.propertiesEstimation?.estimatedElectricityUsageWithOptimizer, 'Impact': props?.propertiesEstimation?.estimatedElectricityImpact },
        { item: 'CO2 Emission', 'Without optimizer': props?.propertiesEstimation?.emissionFactorBeforeOptimizer * 1000, 'With optimizer': props?.propertiesEstimation?.emissionFactorAfterOptimizer * 1000, 'Impact': (props?.propertiesEstimation?.emissionFactorBeforeOptimizer - props?.propertiesEstimation?.emissionFactorAfterOptimizer) * 1000 }
    ]);

    useEffect(() => {
        setData([
            { item: 'Water', 'Without optimizer': props?.propertiesEstimation?.estimatedWaterConsumption, 'With optimizer': props?.propertiesEstimation?.estimatedWaterConsumptionWithOptimizer, 'Impact': props?.propertiesEstimation?.estimatedWaterImpact },
            { item: 'Electricity', 'Without optimizer': props?.propertiesEstimation?.estimatedElectricityUsage, 'With optimizer': props?.propertiesEstimation?.estimatedElectricityUsageWithOptimizer, 'Impact': props?.propertiesEstimation?.estimatedElectricityImpact },
            { item: 'CO2 Emission', 'Without optimizer': props?.propertiesEstimation?.emissionFactorBeforeOptimizer * 1000, 'With optimizer': props?.propertiesEstimation?.emissionFactorAfterOptimizer * 1000, 'Impact': (props?.propertiesEstimation?.emissionFactorBeforeOptimizer - props?.propertiesEstimation?.emissionFactorAfterOptimizer) * 1000 }
        ]);
    }, [props.propertiesEstimation]);

    console.log('data: ', data);

    const renderTooltip=(label, payload)=>{
        return(
            <Card shadow="sm" padding="md" radius="md" withBorder>
                <Stack>
                    <Text fw={500} mb={5}>
                        {label === 'CO2 Emission' ? 
                        <span>CO<sub style={{fontSize: '10px'}}>2</sub> Emission</span>
                        :
                        label
                        }
                    </Text>
                    {payload.map((item) => (
                        <Group justify={'space-between'}>
                            <Group>
                                <ColorSwatch color={item.color} size={12} />
                                <Text key={item.name} fz="sm">
                                    {item.name}: 
                                </Text>
                            </Group>
                            <Text key={item.name} fz="sm">
                                {accounting.formatNumber(item.value, 2)} {label === 'CO2 Emission' ? 'Grams' : 'Liters'}
                            </Text>
                        </Group>
                        
                    ))}
                </Stack>
            </Card>
            
            
        )
    }

    return (
        <Card shadow="sm" padding="lg" radius={props.mosqueDetail ? "80px" : "md"} style={{backgroundColor: props.mosqueDetail && '#F8F8F8'}} withBorder>
            {props.loader ?
            <Center h={500} w={'100%'}>
                <Loader/>
            </Center>
            :
            <Stack>
                {!props.mosqueDetail && 
                <Group justify="space-between" mb="xs">
                    <Text fw={'bold'}>Estimated social impact</Text>
                </Group>}
                <Group>
                {(props?.propertyStatus === 'COMPLETED' || props?.propertyStatus === 'COMPLETED') ?
                <BarChart
                h={props.mosqueDetail ? 300 : 500}
                p={30}
                data={data}
                dataKey="item"
                orientation={props.orientation}
                //valueFormatter={(value)=> accounting.formatNumber(value, 0)}
                tooltipProps={{
                    content: ({ label, payload }) => renderTooltip(label, payload)
                }}
                series={[
                    { name: 'Without optimizer', color: '#9baebc' },
                    { name: 'With optimizer', color: '#5185a6' },
                    { name: 'Impact', color: '#10516f' }
                ]}
                withLegend={true}
                legendProps={{ verticalAlign: props.mosqueDetail ? 'bottom' : 'top', height: 50 }}
                //withXAxis={false}
                />
                :
                <Stack p={40} gap={10} h={props.mosqueDetail ? 300 : 500}>
                    <Text fw={'bold'}>Estimated social impact</Text>
                    <Text fw={'400'} size={'sm'}>Property data is not yet complete.</Text>
                </Stack>}
                </Group>
                
            </Stack>}
        </Card>
    );
}

export default PropertiesEstimationBarChart;
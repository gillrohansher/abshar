import { ActionIcon, Anchor, AppShell, Box, Burger, Button, Card, Center, Fieldset, Grid, Group, Image, LoadingOverlay, NavLink, PasswordInput, SimpleGrid, Stack, Text, TextInput, useMantineColorScheme } from '@mantine/core';
import { useEffect, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/navigation'

import { SignInPost } from '../../api/fetchApis/Auth';
import { useAppStore, useAppDispatch, useWindowSize } from '../../lib/hooks';
import { set_account_data, set_token } from '../../lib/generalActions/generalActions';
import DashboardPropertyTypesCard from '../../components/DashboardPropertyTypesCard/DashboardPropertyTypesCard';
import DashboardWaterFlowRate from '../../components/DashboardWaterFlowRate/DashboardWaterFlowRate';
import DashboardUsersCard from '../../components/DashboardUsersCard/DashboardUsersCard';
import DashboardLeakAlert from '../../components/DashboardLeakAlert/DashboardLeakAlert';
import PropertiesEstimationBarChart from '../../components/PropertiesEstimationBarChart/PropertiesEstimationBarChart';
import { IconMapPinFilled } from '@tabler/icons-react';
import { PropertiesBillEstimateGet, PropertiesCountGet } from '@/api/fetchApis/Properties';
import dayjs from 'dayjs';
import { UsersGet } from '@/api/fetchApis/Users';

function DashboardPage(props) {
    const size = useWindowSize();
    const store = useAppStore();
    const {token, accountData} = store.getState().general;
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [properties, setProperties] = useState([]);
    const [propertiesLoader, setPropertiesLoader] = useState(false);
    const [propertiesEstimation, setPropertiesEstimation] = useState(null);
    const [propertiesEstimationLoader, setPropertiesEstimationLoader] = useState(false);
    const [users, setUsers] = useState([]);
    const [usersLoader, setUsersLoader] = useState(false);

    useEffect(() => {
        getPropertiesCount();
        getPropertiesBillEstimate();
        getUsersCount();
    }, []);

    const getPropertiesCount=()=>{
        setPropertiesLoader(true);
        PropertiesCountGet(accountData.type === 'ADMIN' ? null : accountData?.id, token, res=>{
            if(res?.code === 200){
                setProperties(res?.data);
            }
            setPropertiesLoader(false);
        });
    }

    const getUsersCount=()=>{
        setUsersLoader(true);
        UsersGet(null, token, res=>{
            if(res?.code === 200){
                setUsers(res.data);
            }
            setUsersLoader(false);
        });
    }

    const getPropertiesBillEstimate=()=>{
        setPropertiesEstimationLoader(true);
        PropertiesBillEstimateGet({startDate: dayjs().startOf('year').format('YYYY-MM-DD'), endDate: dayjs().endOf('year').format('YYYY-MM-DD'), summarized: true}, token, res=>{
            if(res?.code === 200){
                res?.data.length > 0 && setPropertiesEstimation(res?.data[0]);
                console.log('getPropertiesBillEstimate: ', res?.data);
            }
            setPropertiesEstimationLoader(false);
        })
    }

    return (
        <Stack>
            <SimpleGrid cols={size.width < 650 ? 1 : size.width < 767 ? 2 : size.width < 900 ? 1 : size.width < 1300 ? 2 : 3}>
                <DashboardPropertyTypesCard properties={properties} loader={propertiesLoader}/>
                {accountData.type === 'ADMIN' && <DashboardUsersCard users={users} loader={propertiesLoader}/>}
                {accountData.type !== 'ADMIN' && <DashboardWaterFlowRate/>}
                <DashboardLeakAlert/>
            </SimpleGrid>
            <SimpleGrid cols={1}>
                {accountData.type === 'ADMIN' && <DashboardWaterFlowRate/>}
                <PropertiesEstimationBarChart properties={properties} propertiesEstimation={propertiesEstimation} loader={propertiesLoader}/>
            </SimpleGrid>
        </Stack>
    );
}

export default DashboardPage;
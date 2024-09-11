import { Button, Center, FileInput, Group, Loader, Modal, Radio, Select, Stack, Text, TextInput, useMantineColorScheme } from '@mantine/core';
import { useEffect, useState } from 'react';
import { IconPhotoOff } from '@tabler/icons-react';
import { PropertyUploadFeatureImagePost } from '@/api/fetchApis/Properties';
import { compressImage } from '@/helpers/helpers';
import { useAppStore } from '@/lib/hooks';
import { showNotification } from '@mantine/notifications';
import { PageRedirectionRequestPost, PaymentPost } from '../../api/fetchApis/Payments';
import Script from 'next/script';

export function PaymentModal({opened, onClose}) {
    const store = useAppStore();
    const [template, setTemplate] = useState('');
    const [requestHash, setRequestHash] = useState("acDStJ0WdCMzZgSp3a6BEyqoCzzbRp/RYPNI0CpHOR+PdKvEtbwSnQPjni9gy/ULxz8XsAkD6EAvNP80PA/BXghC5qKotGjWatRoIuQ6o5Es4UGhVj4OuiBMWDxrvyxAfLvboQ8RgKNDsLLe2kXG+ztLYiDhkUhRiU0/8Q6Ng5iXw8MKGW1Y6Q9hsww46N8oGvx73P6YD1sAfldy/aRAQB+Jisfe7B70CLSYXWLbdfbKAYER5lMKZxERugLvDo+wMWt1ARYMviJbeh53UpC6VZOLtsVRSr3LRyDfmG0e7Khd/q3TkHllOkn5LZumIWPtYy7mpU4pwaHfPsUIcjq2GQ4bFLMiWhy8QVPNJo14tXWemwJjQaK2jorDxNS9+m/7afFi7u/WGFifJEjOKftX8vhSGL2fD3k8Ursri89o+QvNdqneC0k9fjMtozIHF26jEsB7QZ2kWg4y0SMwqvZaBNoZi8gfjFubpGyMbnG4XF+0YgMsfmksc6Imci/naWfNjL7R6bodUZNXESXuTa8TqpKnaP+VSl624YLailIsMLAMUjA2qxdy894JQ3AOfBluZ5JtJfPThIcOW1t758B7mN1pLQTnkS95TslJA9VqYlMimNLudk6khFAal0D35lh/PsEnnOCKMxEhBSE0vDnw3qm/Ki06z2tsM30q1RqDTaY=");
    const {token, accountData} = store.getState().general;
    const data = [
        {
            label: 'Alfa Wallet',
            value: '1',
        },
        {
            label: 'Alfalah Bank Account',
            value: '2',
        },
        {
            label: 'Credit/Debit Card',
            value: '3',
        },
    ];
    const [value, setValue] = useState('');

    useEffect(() => {
        // fetch('./alfalah.html')
        // .then(response => response.text())
        // .then(data => setTemplate(data));
        // setTimeout(() => {
        //     submitRequest("PageRedirectionForm");    
        // }, 1000);
        
        if(document?.getElementById('run') !== undefined){
            document?.getElementById('run')?.addEventListener('click', function(e) {
                console.log('run');
                e.preventDefault();                                                                                                                                                                                    
                submitRequest("PageRedirectionForm");
                setTimeout(() => {
                    document.getElementById("PageRedirectionForm").submit();    
                }, 1000);                                                                                                                                                                  
                
            });
        }
        // $("#run").click(function (e) {                                                                                                                                                                             
        //     e.preventDefault();                                                                                                                                                                                    
        //     submitRequest("PageRedirectionForm");                                                                                                                                                                  
        //     document.getElementById("PageRedirectionForm").submit();                                                                                                                                               
        // });
    }, [document?.getElementById('run')]);

    function submitRequest(formName) {
        var mapString = '', hashName = 'RequestHash';                                                                                                                                                              
        if (formName == "HandshakeForm") {                                                                                                                                                                         
            hashName = 'HS_' + hashName;                                                                                                                                                                           
        }                                                                                                                                                                                                          
                                                                                                                                                                                                                
        $("#" + formName+" :input").each(function () {                                                                                                                                                             
            if ($(this).attr('id') != '') {                                                                                                                                                                        
                mapString += $(this).attr('id') + '=' + $(this).val() + '&';                                                                                                                                       
            }                                                                                                                                                                                                      
        });
        
        var key = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(mapString.substr(0, mapString.length - 1)), CryptoJS.enc.Utf8.parse(document.getElementById('Key1').value),                                                  
            {    
                keySize: 128 / 8,                                                                                                                                                                                  
                iv: CryptoJS.enc.Utf8.parse(document.getElementById('Key2').value),                                                                                                                                                     
                mode: CryptoJS.mode.CBC,                                                                                                                                                                           
                padding: CryptoJS.pad.Pkcs7                                                                                                                                                                        
        });
        console.log("mapString before substring" + mapString);
        console.log("mapString " + mapString.substr(0, mapString.length - 1));
        console.log('key: ', key);
        return (CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(mapString.substr(0, mapString.length - 1)), CryptoJS.enc.Utf8.parse(document.getElementById('Key1').value),                                                  
        {                                                                                                                                                                                                      
            keySize: 128 / 8,                                                                                                                                                                                  
            iv: CryptoJS.enc.Utf8.parse(document.getElementById('Key2').value),                                                                                                                                                     
            mode: CryptoJS.mode.CBC,                                                                                                                                                                           
            padding: CryptoJS.pad.Pkcs7                                                                                                                                                                        
        }));
    }

    const establishConnection=()=>{
        // PaymentPost({totalAmount: 1000, paymentMethod: value, redirection: "https://app.aabshar.net/mosques"}, 
        // token, 
        // res=>{
        //     if(res?.code === 200){
        //         showNotification({
        //             message: 'Payment created.',
        //             color: 'green',
        //             id: 'paymentCreated'
        //         });
        //         submitRequest("PageRedirectionForm");
        //         setTimeout(() => {
        //             PageRedirectionRequestPost({
        //                 "AuthToken": res?.AuthToken,
        //                 "RequestHash": requestHash,//"hrlX0MXii+QBO5RA8jGsha6uk4sX6iH1IomeBkyVxoVM5XBxYK1Ip5DqCRrvNZ/zR0DagjmPv0rECjEFQR7+WKA6cYXAg3gnccIoxyCrxg/4PbrEpAbSjai43jAc3b/E7X63rvMu8IzD9HdM4naSNGs9RuBAfGuOeS64SipmWpkSgLQv9WwqNdm1vulsHa4rtfN7zbShIcaR67th04WG8Aq/RuaL/HWr6v/HKM2XZg0gEQQHcqwwyRsneyL4HJhNBxNluu01O1wzK0Z9hWvdfm8lfAT1VBXw/bTbbXUrxTUTb+nFoUZAl7Rr4QsRYxSyeqXRB9bTdSN5IvFLSQT1uLMo/z4IIfWuyqaT1gBNxbBHx9P5r4f/X352MmC8mgenBB1PRMrn1HhWW0tC70M35HY/wA4TiPbogR/WeUQ9kbdFJqhkuLVbw/KEcg4hEJk7HOipDZ0h8EFSQ9yAd8uqbw==",
        //                 "ChannelId": "1001",
        //                 "Currency": "PKR",
        //                 "IsBIN": "0",
        //                 "ReturnURL": res?.ReturnURL,
        //                 "MerchantId": "12086",
        //                 "StoreId": "018863",
        //                 "MerchantHash": "OUU362MB1upz28dqed/v1qBU8zZmj5+u0N/WP+MBePw=",
        //                 "MerchantUsername": "lefolu",
        //                 "MerchantPassword": "L7gp7NhZ4W5vFzk4yqF7CA==",
        //                 "TransactionTypeId": "3",
        //                 "TransactionReferenceNumber": "123454",
        //                 "TransactionAmount": "1000"
        //             }, null, res=>{
        //                 console.log('PageRedirectionRequestPost: ', res);
        //             });    
        //         }, 1000);
                
        //     }
        //     setLoader(false);
        // });

        submitRequest("PageRedirectionForm");
        setTimeout(() => {
            console.log('requestHash: ', requestHash);
            PageRedirectionRequestPost({
                "AuthToken": "BHc7nNa9K9id5f2TGaCO0nnLCfUxg/8oqMwJs75g8LbCh3e7aqgrh1vjCd8/wRJ+WPieEvaHg2iWLZu594byk7BpoY4BwfkJ9QHuZJBZnFeQIjzw60kz4ZmeF2mZj0Gh3P7qBcPkekSTw98y7ZaFXg==",
                "RequestHash": submitRequest("PageRedirectionForm"),//"hrlX0MXii+QBO5RA8jGsha6uk4sX6iH1IomeBkyVxoVM5XBxYK1Ip5DqCRrvNZ/zR0DagjmPv0rECjEFQR7+WKA6cYXAg3gnccIoxyCrxg/4PbrEpAbSjai43jAc3b/E7X63rvMu8IzD9HdM4naSNGs9RuBAfGuOeS64SipmWpkSgLQv9WwqNdm1vulsHa4rtfN7zbShIcaR67th04WG8Aq/RuaL/HWr6v/HKM2XZg0gEQQHcqwwyRsneyL4HJhNBxNluu01O1wzK0Z9hWvdfm8lfAT1VBXw/bTbbXUrxTUTb+nFoUZAl7Rr4QsRYxSyeqXRB9bTdSN5IvFLSQT1uLMo/z4IIfWuyqaT1gBNxbBHx9P5r4f/X352MmC8mgenBB1PRMrn1HhWW0tC70M35HY/wA4TiPbogR/WeUQ9kbdFJqhkuLVbw/KEcg4hEJk7HOipDZ0h8EFSQ9yAd8uqbw==",
                "ChannelId": "1001",
                "Currency": "PKR",
                "IsBIN": "0",
                "ReturnURL": "https://app.aabshar.net/",
                "MerchantId": "12086",
                "StoreId": "018863",
                "MerchantHash": "OUU362MB1upz28dqed/v1qBU8zZmj5+u0N/WP+MBePw=",
                "MerchantUsername": "lefolu",
                "MerchantPassword": "L7gp7NhZ4W5vFzk4yqF7CA==",
                "TransactionTypeId": "3",
                "TransactionReferenceNumber": "aab-xYp67-Cjtkh-p5G8y",
                "TransactionAmount": "200"
            }, null, res=>{
                console.log('PageRedirectionRequestPost: ', res);
            });    
        }, 1000);
    }
    return (
    <Modal opened={opened} onClose={onClose} size='auto' title="Select Payment Method" centered>
        <Script src="https://code.jquery.com/jquery-1.12.4.min.js" integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ=" crossorigin="anonymous"/>
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js"/>
        <input id="Key1" name="Key1" type="hidden" value="e5TGEcrX6ZPwVJUu"/>                                                                                                                              
        <input id="Key2" name="Key2" type="hidden" value="2990169614830983"/>
        {/* <form action="https://sandbox.bankalfalah.com/SSO/SSO/SSO" id="PageRedirectionForm" method="post" novalidate="novalidate">
            <input id="AuthToken" name="AuthToken" type="hidden" value="RXf12z67vF/GjxKj9hF7cJOn/Kn22em6F5n4yn4p0MVG0R6j3cdaaox1hUZNexF0IOP03+5PUNIpZaSZ7rBQM2IYummDTExbNGp/MegkGGgS9tO6hEG/SEWLII7TqAaZo0I22KFWq4C05IpCsjtWIw=="/>
            <input id="RequestHash" name="RequestHash" type="hidden" value={"zAVi+NxCA4iSMjjuwxoS80nZJOtUqShOXK2APAHqVdTc8G82HhWLclKA87JHbrqjBJgzJiub+7IoO0qyQl2XeCyg8rDraUmflPTiG/v2CxAfg9Px99v+rlcYIhL9i2EAMzfExCq5mzLRYvSn6lmLUVs2MfJ7m6Ty8entenoFSC17EEpKTyGrCKlIypbolNELreTK7QX3oDM9wq/l14+TyOu5ctlGmi1+V1yWW6JaCB0DQvNNRddrFBQ/dk10cfUxvMD9/MU/rhAfacpDrum/VQFLqttRfIuqNY6tCNt4whj8GHeI4FZ0FaybQjFf9BAdlhv7hAvI02HOmeS7ZTOd9XNbntfR6zuLm031OPUbF939ATj66vquR04BLuBRTB2g/kraRI8KXdxk0XOF0HFBTM4hDL7766lyGRmEOQmquFi+ZzTRZ4HuxqJbYiAoaV4DmhDcRshaBkWTjG7g06TbBfHlXWoaNYAjaD2Hecb1agiMz"}/>                                                                                                                            
            <input id="ChannelId" name="ChannelId" type="hidden" value="1001"/>                                                                                                                            
            <input id="Currency" name="Currency" type="hidden" value="PKR"/>                                                                                                                               
            <input id="IsBIN" name="IsBIN" type="hidden" value="0"/>                                                                                     
            <input id="ReturnURL" name="ReturnURL" type="hidden" value="https://app.aabshar.net/"/>                                                                            
            <input id="MerchantId" name="MerchantId" type="hidden" value="12086"/>                                                                                                                           
            <input id="StoreId" name="StoreId" type="hidden" value="018863"/>                                                                                                                     
            <input id="MerchantHash" name="MerchantHash" type="hidden" value="OUU362MB1upz28dqed/v1qBU8zZmj5+u0N/WP+MBePw="/>                                  
            <input id="MerchantUsername" name="MerchantUsername" type="hidden" value="lefolu"/>                                                                                                            
            <input id="MerchantPassword" name="MerchantPassword" type="hidden" value="L7gp7NhZ4W5vFzk4yqF7CA=="/>  
            <select autocomplete="off" style={{visibility: 'hidden'}} id="TransactionTypeId" name="TransactionTypeId">                                                                                                                   
                <option value="">Select Transaction Type</option>                                                                                                                                         
                <option value="1">Alfa Wallet</option>                                                                                                                                                    
                <option value="2">Alfalah Bank Account</option>                                                                                                                                                
                <option value="3">Credit/Debit Card</option>                                                                                                                                              
            </select>                                                                                                                                                                                                              
            <input autocomplete="off" id="TransactionReferenceNumber" type="hidden" name="TransactionReferenceNumber" placeholder="Order ID" value="aab-VNVnx-8xK1A-7SMJc"/>                                  
            <input autocomplete="off"  id="TransactionAmount" type="hidden" name="TransactionAmount" placeholder="Transaction Amount" value="100"/>                                                                                                                                                                    
            <button type="submit" class="btn btn-custon-four btn-danger" id="run">RUN</button>
        </form> */}

    <form action="https://sandbox.bankalfalah.com/SSO/SSO/SSO" id="PageRedirectionForm" method="post" novalidate="novalidate">                                                              
        <input id="AuthToken" name="AuthToken" type="hidden" value="BHc7nNa9K9id5f2TGaCO0nnLCfUxg/8oqMwJs75g8LbCh3e7aqgrh1vjCd8/wRJ+WPieEvaHg2iWLZu594byk7BpoY4BwfkJ9QHuZJBZnFeQIjzw60kz4ZmeF2mZj0Gh3P7qBcPkekSTw98y7ZaFXg=="/>                                                                                                                                
        <input id="RequestHash" name="RequestHash" type="hidden" value=""/>                                                                                                                            
        <input id="ChannelId" name="ChannelId" type="hidden" value="1001"/>                                                                                                                            
        <input id="Currency" name="Currency" type="hidden" value="PKR"/>                                                                                                                               
         <input id="IsBIN" name="IsBIN" type="hidden" value="0"/>                                                                                     
        <input id="ReturnURL" name="ReturnURL" type="hidden" value="https://app.aabshar.net/"/>                                                                            
         <input id="MerchantId" name="MerchantId" type="hidden" value="12086"/>                                                                                                                           
         <input id="StoreId" name="StoreId" type="hidden" value="018863"/>                                                                                                                     
        <input id="MerchantHash" name="MerchantHash" type="hidden" value="OUU362MB1upz28dqed/v1qBU8zZmj5+u0N/WP+MBePw="/>                                  
        <input id="MerchantUsername" name="MerchantUsername" type="hidden" value="lefolu"/>                                                                                                            
        <input id="MerchantPassword" name="MerchantPassword" type="hidden" value="L7gp7NhZ4W5vFzk4yqF7CA=="/>                                                                                          
         <select autocomplete="off" id="TransactionTypeId" name="TransactionTypeId">                                                                                                                   
             <option value="">Select Transaction Type</option>                                                                                                                                         
             <option value="1">Alfa Wallet</option>                                                                                                                                                    
             <option value="2">Alfalah Bank Account</option>                                                                                                                                                
             <option value="3">Credit/Debit Card</option>                                                                                                                                              
         </select>                                                                                                                                                                                     
        <input autocomplete="off" id="TransactionReferenceNumber" name="TransactionReferenceNumber" placeholder="Order ID" type="text" value="aab-xYp67-Cjtkh-p5G8y"/>                                  
        <input autocomplete="off"  id="TransactionAmount" name="TransactionAmount" placeholder="Transaction Amount" type="text" value="200"/>                                                             
        <button type="submit" class="btn btn-custon-four btn-danger" id="run">RUN</button>                                                                                                            
     </form>

        <Stack>
            {/* <Group>
                <Select
                data={data} 
                value={value} 
                onChange={(value)=> {
                    setValue(value);
                    document.getElementById('TransactionTypeId').value= value;
                }}
                />
            </Group>  */}
            <Group justify={'space-between'} style={{width: '100%'}}>
                <Button color={'gray'} onClick={()=> onClose()}>Close</Button>
                <Button onClick={()=> establishConnection()}>Next</Button>
            </Group>
        </Stack>
        {/* <script                                                                                                                                                                                           
       src="https://code.jquery.com/jquery-1.12.4.min.js"                                                                                                                                              
       integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ="                                                                                                                                 
       crossorigin="anonymous"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js"></script>                                                                  
                                                                                                                                                                                                       
      <input id="Key1" name="Key1" type="hidden" value="e5TGEcrX6ZPwVJUu"/>                                                                                                                              
     <input id="Key2" name="Key2" type="hidden" value="2990169614830983"/>                                                                                                                              
                                                                                                                                                                                                                                                                
                                                                                                                                                                                                       
     <h3>Handshake</h3>                                                                                                                                                                                
     <form action="https://sandbox.bankalfalah.com/HS/HS/HS" id="HandshakeForm" method="post">                                                                                                      
         <input id="HS_RequestHash" name="HS_RequestHash" type="hidden" value=""/>                                                                                                                      
         <input id="HS_IsRedirectionRequest" name="HS_IsRedirectionRequest" type="hidden" value="0"/>                                                                                                   
         <input id="HS_ChannelId" name="HS_ChannelId" type="hidden" value="1001"/>                                                                                                                      
         <input id="HS_ReturnURL" name="HS_ReturnURL" type="hidden" value="https://app.aabshar.net/"/>                                                                     
         <input id="HS_MerchantId" name="HS_MerchantId" type="hidden" value="12086"/>                                                                                                                     
         <input id="HS_StoreId" name="HS_StoreId" type="hidden" value="018863"/>                                                                                                                     
         <input id="HS_MerchantHash" name="HS_MerchantHash" type="hidden" value="OUU362MB1upz28dqed/v1qBU8zZmj5+u0N/WP+MBePw="/>                            
         <input id="HS_MerchantUsername" name="HS_MerchantUsername" type="hidden" value="lefolu"/>                                                                                                      
         <input id="HS_MerchantPassword" name="HS_MerchantPassword" type="hidden" value="L7gp7NhZ4W5vFzk4yqF7CA=="/>                                                                                    
         <input id="HS_TransactionReferenceNumber" name="HS_TransactionReferenceNumber" autocomplete="off" placeholder="Order ID"  value=""/>                                                                                     
         <button type="submit" class="btn btn-custon-four btn-danger" id="handshake">Handshake</button>                                                                                                   
     </form>                                                                                                                                                                                           
                                                                                                                                                                                                       
                                                                                                                                                                                                       
     <h3>Page Redirection Request</h3>                                                                                                                                                                 
     <form action="https://sandbox.bankalfalah.com/SSO/SSO/SSO" id="PageRedirectionForm" method="post" novalidate="novalidate">                                                              
     	      <input id="AuthToken" name="AuthToken" type="hidden" value=""/>                                                                                                                                
        <input id="RequestHash" name="RequestHash" type="hidden" value=""/>                                                                                                                            
        <input id="ChannelId" name="ChannelId" type="hidden" value="1001"/>                                                                                                                            
        <input id="Currency" name="Currency" type="hidden" value="PKR"/>                                                                                                                               
         <input id="IsBIN" name="IsBIN" type="hidden" value="0"/>                                                                                     
        <input id="ReturnURL" name="ReturnURL" type="hidden" value="https://app.aabshar.net/"/>                                                                            
         <input id="MerchantId" name="MerchantId" type="hidden" value="12086"/>                                                                                                                           
         <input id="StoreId" name="StoreId" type="hidden" value="018863"/>                                                                                                                     
        <input id="MerchantHash" name="MerchantHash" type="hidden" value="OUU362MB1upz28dqed/v1qBU8zZmj5+u0N/WP+MBePw="/>                                  
        <input id="MerchantUsername" name="MerchantUsername" type="hidden" value="lefolu"/>                                                                                                            
        <input id="MerchantPassword" name="MerchantPassword" type="hidden" value="L7gp7NhZ4W5vFzk4yqF7CA=="/>                                                                                          
         <select autocomplete="off" id="TransactionTypeId" name="TransactionTypeId">                                                                                                                   
             <option value="">Select Transaction Type</option>                                                                                                                                         
             <option value="1">Alfa Wallet</option>                                                                                                                                                    
             <option value="2">Alfalah Bank Account</option>                                                                                                                                                
             <option value="3">Credit/Debit Card</option>                                                                                                                                              
         </select>                                                                                                                                                                                     
        <input autocomplete="off" id="TransactionReferenceNumber" name="TransactionReferenceNumber" placeholder="Order ID" type="text" value=""/>                                  
        <input autocomplete="off"  id="TransactionAmount" name="TransactionAmount" placeholder="Transaction Amount" type="text" value=""/>                                                             
        <button type="submit" class="btn btn-custon-four btn-danger" id="run">RUN</button>                                                                                                              
     </form>*/}
    {/* <div dangerouslySetInnerHTML={{__html: template}} /> */}
     
    </Modal>
    );
}

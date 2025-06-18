import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import {useRouter} from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';


const AuthContext = createContext();


const AuthProvider = ({ children })=>{

    const[ isAuth, setIsAuth ]= useState(false);
    const [userDetails, setUserDetails ]= useState({});

    const navigation = useRouter();
    
    useEffect(()=>{
        const check_auth = async ()=>{
            try{
                const token = await AsyncStorage.getItem('token');
                const checkAuth = await axios.get('http://192.168.43.153:3000/api/checkauth', {
                    headers:{ Authorization: `Bearer ${token}`}
                });
                // console.log("check authdata", checkAuth.data);
        
                if (checkAuth.status === 200 ){
                    // const res = await AsyncStorage.setItem('userDetail', JSON.stringify(checkAuth.data))
                    setUserDetails(checkAuth.data.userData)
                    setIsAuth(true); 
                    navigation.replace('/');
                    // console.log(res);
                }else{ 
                    navigation.replace('auth/Login');
                }
            }catch(error){  
                if (error.response.status === 403){
                    navigation.replace('auth/Login');
                }else{
                    console.error('Error checking authentication:', error);
                }
            }
        }
        check_auth();
       
    },[isAuth]);


    const Logout = ()=>{
        AsyncStorage.removeItem('userDetail')
        AsyncStorage.removeItem('token')
        setUserDetails({})
        setIsAuth(false)
        navigation.replace('auth/Login');
    }

    return (
    <AuthContext.Provider value={{ isAuth, Logout, userDetails, setUserDetails }} >
        { children }
    </AuthContext.Provider>
    );
}

export { AuthProvider, AuthContext};
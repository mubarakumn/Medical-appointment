import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const navigation = useRouter();

  // ✅ Called once on app load to check token
  useEffect(() => {
    const check_auth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        const checkAuth = await axios.get(
          'https://medical-appointment-backend-five.vercel.app/api/checkauth',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (checkAuth.status === 200) {
        const role = checkAuth.data.userData.role;
        setUserDetails(checkAuth.data.userData);
        setIsAuth(true);

        // Role-based navigation
        if (role === 'admin') navigation.replace('/admin/Dashboard');
        else if (role === 'doctor') navigation.replace('/doctor/Dashboard');
        else navigation.replace('/'); // patient
        }else {
          navigation.replace('/auth/Login');
        }
      } catch (error) {
        if (error.response?.status === 403) {
          navigation.replace('/auth/Login');
        } else {
          console.error('Error checking authentication:', error);
        }
      }
    };

    check_auth();
  }, [isAuth]);

  // ✅ LOGIN
  const login = async (email, password) => {
    const res = await axios.post(
      'https://medical-appointment-backend-five.vercel.app/api/user/login',
      { email, password }
    );

    const { token, user } = res.data;
    await AsyncStorage.setItem('token', token);
    setUserDetails(user);
    setIsAuth(true); // Triggers redirect
  };

  // ✅ REGISTER
  const register = async (formData) => {
    const res = await axios.post(
      'https://medical-appointment-backend-five.vercel.app/api/user/register',
      formData
    );

    const { token, user } = res.data;
    await AsyncStorage.setItem('token', token);
    setUserDetails(user);
    setIsAuth(true);
  };

  // ✅ LOGOUT
  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUserDetails({});
    setIsAuth(false);
    navigation.replace('/auth/Login');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        userDetails,
        login,
        register,
        logout,
        setUserDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };

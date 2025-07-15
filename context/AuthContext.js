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
    let mounted = true;
    const check_auth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return navigation.replace('/auth/Login');

        const res = await axios.get('https://medical-appointment-backend-five.vercel.app/api/checkauth', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 200 && mounted) {
          const role = res.data.userData.role;
          setUserDetails(res.data.userData);
          setIsAuth(true);
          setTimeout(() => {
            if (role === 'admin') navigation.replace('/admin/Dashboard');
            else if (role === 'doctor') navigation.replace('/doctor/dashboard');
            else navigation.replace('/');
          }, 0);
        }
      } catch (error) {
        if (error.status === 403) {
          router.replace('/auth/Login');
          return;
        }
        navigation.replace('/auth/Login');
      }
    };

    check_auth();
    return () => { mounted = false; };
  }, []);


  // ✅ LOGIN
  const login = async (email, password) => {
    try {
      const res = await axios.post(
        'https://medical-appointment-backend-five.vercel.app/api/users/login',
        { email, password }
      );

      const { token, user } = res.data;

      await AsyncStorage.setItem('token', token);
      setUserDetails(user);
      setIsAuth(true);

      // ✅ Add this to redirect immediately after login
      const role = user.role;
      if (role === 'admin') navigation.replace('/admin/Dashboard');
      else if (role === 'doctor') navigation.replace('/doctor/dashboard');
      else navigation.replace('/');
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      throw err;
    }
  };



  // ✅ REGISTER
  const register = async (formData) => {
    const res = await axios.post(
      'https://medical-appointment-backend-five.vercel.app/api/users/register',
      formData
    );

    const { token, user } = res.data;
    await AsyncStorage.setItem('token', token);
    setUserDetails(user);
    setIsAuth(true);

    // ✅ Redirect based on role
    const role = user.role;
    if (role === 'admin') navigation.replace('/admin/Dashboard');
    else if (role === 'doctor') navigation.replace('/doctor/dashboard');
    else navigation.replace('/');
  };

  // ✅ LOGOUT
  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
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

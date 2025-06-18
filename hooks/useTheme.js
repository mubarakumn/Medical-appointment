import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../constants/themes';

const useTheme = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const themeStyles = theme === 'light' ? lightTheme : darkTheme;
  return { theme, themeStyles, toggleTheme };
};

export default useTheme;
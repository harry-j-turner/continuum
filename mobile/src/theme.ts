import { MD3LightTheme } from 'react-native-paper';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#5D3754',
    secondary: '#CAA5C2',
    tertiary: '#E1CCDC',
    dangerLight: '#FFD3D3',
    danger: '#993333',
    accentLight: '#C2E4FF',
    accent: '#005AA3',
    highlight: '#EF476F',
    darkGray: '#3D3D3D',
    mediumGray: '#9D9D9D',
    lightGray: '#D9D9D9',
    white: '#FFFFFF',
    surface: '#F7F2F6'
  },
  fonts: {
    ...MD3LightTheme.fonts,
    regular: 'Nunito-Regular',
    medium: 'Nunito-SemiBold',
    bold: 'Nunito-Bold'
  }
};

export default theme;

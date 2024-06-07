import { StyleSheet } from 'react-native';
import theme from '../../theme';

const style = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8
  },
  buttonText: {
    fontSize: 20,
    color: theme.colors.primary,
    fontFamily: 'Nunito-Regular'
  }
});

export default style;

import { StyleSheet } from 'react-native';
import theme from '../../theme';

const style = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    padding: '10%',
    justifyContent: 'flex-start'
  },
  popupCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    padding: 20
  },
  popupTitle: {
    fontFamily: 'Nunito-Bold',
    color: theme.colors.primary
  },
  popupBody: {
    marginTop: 20,
    fontFamily: 'Nunito-Regular',
    color: theme.colors.primary
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  }
});

export default style;

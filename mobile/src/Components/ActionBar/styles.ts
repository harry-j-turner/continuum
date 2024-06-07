import { StyleSheet } from 'react-native';
import theme from '../../theme';

const style = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.lightGray,
    backgroundColor: theme.colors.white
  },
  actionButtonText: {
    fontFamily: 'Nunito-Regular',
    color: theme.colors.primary
  },
  menu: {
    padding: 16,
    paddingLeft: 8,
    backgroundColor: theme.colors.white
  },
  menuButton: {
    marginHorizontal: 16,
    marginRight: 8
  },
  menuItem: {
    backgroundColor: theme.colors.white
  },
  menuItemTitle: {
    fontSize: 18,
    fontFamily: 'Nunito-Regular',
    color: theme.colors.primary
  }
});

export default style;

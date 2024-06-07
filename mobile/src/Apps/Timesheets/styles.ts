import { StyleSheet } from 'react-native';
import theme from '../../theme';

const style = StyleSheet.create({
  canvas: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row'
  },
  entryActionBar: {
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
  actionBar: {
    width: '100%',
    display: 'flex',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.lightGray,
    backgroundColor: theme.colors.white
  },
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  timesheetButton: {
    width: '100%'
  },
  timesheetList: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  timesheetCard: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.white
  },
  timesheetInfo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  timesheetCardTitle: {
    color: theme.colors.primary,
    fontFamily: 'Nunito-Bold'
  },
  timesheetCardBody: {
    color: theme.colors.primary,
    fontFamily: 'Nunito-Regular'
  },
  timesheetEditorHeader: {
    width: '100%',
    padding: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
    backgroundColor: theme.colors.white
  },
  timesheetEditorBody: {
    width: '100%',
    height: '80%',
    backgroundColor: theme.colors.white
  },
  timesheetEntryCard: {
    padding: 16,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white
  },
  timesheetEntryDropdown: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: '#f5f5f5'
  },
  timesheetUnderlay: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  sectionHeader: {
    width: '100%',
    padding: 16,
    paddingTop: 28,
    paddingBottom: 4,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomColor: theme.colors.lightGray,
    backgroundColor: theme.colors.white
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  }
});

export default style;

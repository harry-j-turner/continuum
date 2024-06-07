import React, { useCallback, useEffect } from 'react';

// Auth
import { useAuth } from '../../Auth';

// Types
import {
  CreateTimesheetRequest,
  Timesheet,
  UpdateTimesheetEntryRequest,
  User
} from '../../Services/API/types';

// Services
import APIService from '../../Services/API';

// Styling & Animation
import style from './styles';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';

// Components
import TimesheetEditor from './TimesheetEditor';
import TimesheetList from './TimesheetList';
import TimesheetActions from './TimesheetActions';
import { View, useWindowDimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { formatDate } from './utils';
import ActionBar, { ActionBarButton } from '../../Components/ActionBar/ActionBar';
import FormPopup, {
  FormPopupBodyElement,
  FormPopupHandle,
  FormPopupResponse
} from '../../Components/FormPopup';
import { debounce } from 'lodash';

function TimesheetsApp(): JSX.Element {
  const auth = useAuth();
  const width = useWindowDimensions().width;
  const [timesheets, setTimesheets] = React.useState<Timesheet[] | null>(null);
  const [selectedTimesheetID, setSelectedTimesheetID] = React.useState<string | null>(null);
  const shift = useSharedValue(0);
  const apiService = APIService.getInstance();
  const navigation = useNavigation();
  const newTimesheetPopupRef = React.useRef<FormPopupHandle>(null);

  const selectedTimesheet = timesheets?.find((timesheet) => timesheet.id === selectedTimesheetID);

  const handleCloseTimesheet = () => {
    navigation.setOptions({ title: 'Timesheets' });
    if (shift.value !== 0) shift.value = withTiming(0);
  };

  const handleOpenTimesheet = (timesheetID: string) => {
    setSelectedTimesheetID(timesheetID);
    const timesheet = timesheets?.find((timesheet) => timesheet.id === timesheetID);
    if (!timesheet) return;
    const start = formatDate(timesheet.start_date);
    const end = formatDate(timesheet.end_date);
    const title = `${start} - ${end}`;
    navigation.setOptions({ title: title });
    if (shift.value === 0) shift.value = withTiming(-width);
  };

  const handleNewTimesheet = useCallback(
    async (formPopupResponse: FormPopupResponse) => {
      const body: CreateTimesheetRequest = {
        name: formPopupResponse.timesheetName
      };
      if (auth.group === 'client') {
        body.employer = auth.sub as string;
        if (formPopupResponse.linkUser) {
          const employee = await apiService.users.lookup(formPopupResponse.linkUser);
          if (employee) {
            body.employee = employee.id;
          }
        }
      }
      if (auth.group === 'personal_assistant') {
        body.employee = auth.sub as string;
        if (formPopupResponse.linkUser) {
          const employer = await apiService.users.lookup(formPopupResponse.linkUser);
          if (employer) {
            body.employer = employer.id;
          }
        }
      }

      apiService.timesheets
        .create(body)
        .then((timesheet) => {
          if (!timesheet) return;
          setTimesheets((prev) => (prev ? [timesheet, ...prev] : [timesheet]));
        })
        .catch((err) => {
          // TODO: Timesheets and timesheet entries should all have created and updated dates.
          // TODO: Handle error with toaster.
          console.log(err);
        });
    },
    [auth.sub, auth.group]
  );

  const handleDeleteTimesheet = useCallback(
    (timesheetID: string) => {
      if (!timesheetID) return;

      // Remove entry from the local state
      // #################################

      let updatedTimesheets: Timesheet[] | null = null;

      if (timesheets) {
        updatedTimesheets = timesheets.filter((timesheet) => timesheet.id !== timesheetID);
      }

      setTimesheets(updatedTimesheets);
      setSelectedTimesheetID(null);
      handleCloseTimesheet();

      apiService.timesheets.delete(timesheetID).catch((err) => {
        console.log(err);
      });
    },
    [timesheets]
  );

  const handleNewTimesheetEntry = useCallback(() => {
    if (!selectedTimesheetID) return;
    if (!timesheets) return;

    const body = {
      start_datetime: new Date().toISOString(),
      end_datetime: new Date().toISOString()
    };

    apiService.timesheets
      .createEntry(selectedTimesheetID, body)
      .then((timesheetEntry) => {
        if (!timesheetEntry) return;
        const updatedTimesheets = timesheets.map((timesheet) => {
          if (timesheet.id === selectedTimesheetID) {
            return {
              ...timesheet,
              entries: [timesheetEntry, ...timesheet.entries]
            };
          }
          return timesheet;
        });
        setTimesheets(updatedTimesheets);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [selectedTimesheetID, timesheets]);

  const handleUpdateTimesheetEntry = useCallback(
    (timesheetEntryID: string, body: UpdateTimesheetEntryRequest) => {
      if (!selectedTimesheetID) return;
      if (!timesheets) return;

      // TODO: If API responds with 400, that gets treated as successful.. need to fix!
      // TODO: Debounce this, if the user spins wheel, millions of requests!.
      apiService.timesheets
        .updateEntry(selectedTimesheetID, timesheetEntryID, body)
        .then((timesheetEntry) => {
          if (!timesheetEntry) return;
          const updatedTimesheets = timesheets.map((timesheet) => {
            if (timesheet.id === selectedTimesheetID) {
              return {
                ...timesheet,
                entries: timesheet.entries.map((entry) => {
                  if (entry.id === timesheetEntryID) {
                    return timesheetEntry;
                  }
                  return entry;
                })
              };
            }
            return timesheet;
          });
          setTimesheets(updatedTimesheets);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [selectedTimesheetID, timesheets]
  );

  const handleDeleteTimesheetEntry = useCallback(
    (timesheetEntryID: string) => {
      if (!selectedTimesheetID) return;

      // Remove entry from the local state
      // #################################

      let updatedTimesheets: Timesheet[] | null = null;

      if (timesheets) {
        updatedTimesheets = timesheets.map((timesheet) => {
          if (timesheet.id === selectedTimesheetID) {
            return {
              ...timesheet,
              entries: timesheet.entries.filter((entry) => entry.id !== timesheetEntryID)
            };
          }
          return timesheet;
        });
      }

      setTimesheets(updatedTimesheets);

      apiService.timesheets.deleteEntry(selectedTimesheetID, timesheetEntryID).catch((err) => {
        console.log(err);
      });
    },
    [selectedTimesheetID]
  );
  // TODO: We should catch errors and display them in a toast or something.
  // TODO: Handle the case where timesheet has not been assigned, so other "person" will be undefined.

  useEffect(() => {
    apiService.timesheets
      .list()
      .then((timesheets) => {
        if (!timesheets) return;
        setTimesheets(timesheets);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const validateEmail = (email: string): Promise<string> => {
    if (email.length === 0) return Promise.resolve('');
    return apiService.users
      .lookup(email)
      .then((user) => {
        if (!user) return 'User does not exist';
        return '';
      })
      .catch((err) => {
        return 'User does not exist';
      });
  };

  const actionBarButtons: ActionBarButton[] = [
    {
      icon: 'add-circle-outline',
      onPress: () => newTimesheetPopupRef.current?.show(),
      text: 'New',
      position: 'right'
    }
  ];

  // TODO: Should not be able to link to ourselves!
  const newTimesheetPopupBody: FormPopupBodyElement[] = [
    {
      type: 'input',
      label: 'Timesheet name',
      key: 'timesheetName',
      validator: (value) => {
        return value.length === 0
          ? Promise.resolve('Timesheet name cannot be empty')
          : Promise.resolve('');
      }
    },
    {
      type: 'input',
      label: 'Link with user (optional)',
      key: 'linkUser',
      validator: validateEmail
    }
  ];

  return (
    <GestureHandlerRootView>
      <FormPopup
        ref={newTimesheetPopupRef}
        title="New Timesheet"
        body={newTimesheetPopupBody}
        onConfirm={handleNewTimesheet}
      />
      <View style={style.canvas}>
        <Animated.View style={[style.container, { transform: [{ translateX: shift }] }]}>
          <ActionBar buttons={actionBarButtons} />
          <TimesheetList
            timesheets={timesheets}
            group={auth.group}
            onOpenTimesheet={handleOpenTimesheet}
          />
        </Animated.View>
        <Animated.View style={[style.container, { transform: [{ translateX: shift }] }]}>
          {selectedTimesheet && (
            <TimesheetEditor
              timesheet={selectedTimesheet}
              onNewTimesheetEntry={handleNewTimesheetEntry}
              onDeleteTimesheetEntry={handleDeleteTimesheetEntry}
              onCloseTimesheet={handleCloseTimesheet}
              onDeleteTimesheet={() => handleDeleteTimesheet(selectedTimesheet.id)}
              onUpdateTimesheetEntry={handleUpdateTimesheetEntry}
            />
          )}
        </Animated.View>
      </View>
    </GestureHandlerRootView>
  );
}

export default TimesheetsApp;

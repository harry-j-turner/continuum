import React from 'react';

import { Pane, Popover, Position, Text } from 'evergreen-ui';
import { DatePicker3 } from '@blueprintjs/datetime2';
import { useResponsive } from '../../hooks/useResponsive';

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  handleStartDateChange: (selectedDate: Date | null) => void;
  handleEndDateChange: (selectedDate: Date | null) => void;
}

function DateRangePicker({ startDate, endDate, handleStartDateChange, handleEndDateChange }: DateRangePickerProps) {
  const { isMobile } = useResponsive();

  return (
    <Pane display="flex" flexDirection={isMobile ? 'column' : 'row'} alignItems="center">
      <Pane display="flex" flexDirection="row" alignItems="center" justifyContent="flex-start" width="100%">
        <Popover
          position={Position.BOTTOM_RIGHT}
          content={
            <Pane
              width={240}
              height={240}
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              <DatePicker3
                value={startDate}
                dayPickerProps={{ showOutsideDays: true }}
                onChange={handleStartDateChange}
              />
            </Pane>
          }
        >
          <Pane
            backgroundColor="rgba(255, 255, 255, 0.7)"
            padding={12}
            borderRadius={4}
            cursor="pointer"
            marginRight={8}
            minWidth={isMobile ? 0 : 200}
          >
            <Text fontSize={isMobile ? '0.8rem' : '1rem'}>
              From <b>{startDate.toDateString()}</b>
            </Text>
          </Pane>
        </Popover>
        <Popover
          position={Position.BOTTOM_RIGHT}
          content={
            <Pane
              width={240}
              height={240}
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              <DatePicker3 value={endDate} dayPickerProps={{ showOutsideDays: true }} onChange={handleEndDateChange} />
            </Pane>
          }
        >
          <Pane
            backgroundColor="rgba(255, 255, 255, 0.7)"
            padding={12}
            borderRadius={4}
            cursor="pointer"
            minWidth={isMobile ? 0 : 200}
          >
            <Text fontSize={isMobile ? '0.8rem' : '1rem'}>
              until <b>{endDate.toDateString()}</b>
            </Text>
          </Pane>
        </Popover>
      </Pane>
      <Pane
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-start"
        width="100%"
        marginTop={isMobile ? 8 : 0}
      >
        <Pane
          backgroundColor="rgba(255, 255, 255, 0.7)"
          marginLeft={isMobile ? 0 : 8}
          padding={12}
          borderRadius={4}
          cursor="pointer"
          onClick={() => {
            const today = new Date();
            handleStartDateChange(today);
            handleEndDateChange(today);
          }}
        >
          <Text fontSize={isMobile ? '0.8rem' : '1rem'}>Today</Text>
        </Pane>
        <Pane
          backgroundColor="rgba(255, 255, 255, 0.7)"
          marginLeft={8}
          padding={12}
          borderRadius={4}
          cursor="pointer"
          onClick={() => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            handleStartDateChange(yesterday);
            handleEndDateChange(yesterday);
          }}
        >
          <Text fontSize={isMobile ? '0.8rem' : '1rem'}>Yesterday</Text>
        </Pane>
        <Pane
          backgroundColor="rgba(255, 255, 255, 0.7)"
          marginLeft={8}
          padding={12}
          borderRadius={4}
          cursor="pointer"
          onClick={() => {
            const lastWeek = new Date();
            lastWeek.setDate(lastWeek.getDate() - 7);
            handleStartDateChange(lastWeek);
            handleEndDateChange(new Date());
          }}
        >
          <Text fontSize={isMobile ? '0.8rem' : '1rem'}>Previous Week</Text>
        </Pane>
      </Pane>
    </Pane>
  );
}

export default DateRangePicker;

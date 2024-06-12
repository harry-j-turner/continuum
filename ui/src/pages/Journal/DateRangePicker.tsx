import React, { useState } from 'react';

import { Pane, Popover, Position, Text } from 'evergreen-ui';
import { DatePicker3 } from '@blueprintjs/datetime2';

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  handleStartDateChange: (selectedDate: Date | null) => void;
  handleEndDateChange: (selectedDate: Date | null) => void;
}

function DateRangePicker({ startDate, endDate, handleStartDateChange, handleEndDateChange }: DateRangePickerProps) {
  return (
    <Pane display="flex" flexDirection="row" alignItems="center">
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
          marginRight={16}
        >
          <Text fontSize="1rem">
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
        <Pane backgroundColor="rgba(255, 255, 255, 0.7)" padding={12} borderRadius={4} cursor="pointer">
          <Text fontSize="1rem">
            until <b>{endDate.toDateString()}</b>
          </Text>
        </Pane>
      </Popover>
      <Pane
        backgroundColor="rgba(255, 255, 255, 0.7)"
        marginLeft={16}
        padding={12}
        borderRadius={4}
        cursor="pointer"
        onClick={() => {
          const today = new Date();
          handleStartDateChange(today);
          handleEndDateChange(today);
        }}
      >
        <Text fontSize="1rem">Today</Text>
      </Pane>
      <Pane
        backgroundColor="rgba(255, 255, 255, 0.7)"
        marginLeft={16}
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
        <Text fontSize="1rem">Yesterday</Text>
      </Pane>
      <Pane
        backgroundColor="rgba(255, 255, 255, 0.7)"
        marginLeft={16}
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
        <Text fontSize="1rem">Previous Week</Text>
      </Pane>
    </Pane>
  );
}

export default DateRangePicker;

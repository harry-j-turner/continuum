import '../../App.css';
import React, { useEffect } from 'react';
import { Icon, Text, Popover, Position, CaretDownIcon, CaretRightIcon } from 'evergreen-ui';
import { Tag } from '../../types';
import { Pane } from 'evergreen-ui';

import { DatePicker3 } from '@blueprintjs/datetime2';

import useAPI from '../../hooks/useAPI';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      min: 0,
      max: 5
    }
  }
};

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  handleStartDateChange: (selectedDate: Date | null) => void;
  handleEndDateChange: (selectedDate: Date | null) => void;
}

function DateRangePicker({ startDate, endDate, handleStartDateChange, handleEndDateChange }: DateRangePickerProps) {
  return (
    <Pane display="flex" flexDirection="row" alignItems="center" width="45%">
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
    </Pane>
  );
}

type DisplayedTodo = {
  date: string;
  action: string;
  thought: string;
};

// Text with a down caret that can be clicked to reveal the thought content.
function Todo({ todo }: { todo: DisplayedTodo }) {
  const [showThought, setShowThought] = React.useState<boolean>(false);

  return (
    <Pane
      display="flex"
      flexDirection="column"
      padding={16}
      borderBottom="1px solid rgba(0, 0, 0, 0.1)"
      alignItems="flex-start"
      onClick={() => setShowThought(!showThought)}
      cursor="pointer"
    >
      <Pane display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center">
        <Icon icon={showThought ? CaretDownIcon : CaretRightIcon} cursor="pointer" marginRight={16} />
        <Text fontSize="1rem">
          <b>{todo.action}</b>
        </Text>
      </Pane>
      {showThought && (
        <Pane marginTop={8} display="flex" flexDirection="column" alignItems="flex-start">
          <Text fontSize="0.9rem">
            <i>{todo.date}</i>
          </Text>
          <Text fontSize="0.9rem">{todo.thought}</Text>
        </Pane>
      )}
    </Pane>
  );
}

function Analysis() {
  const api = useAPI();

  const [selectedTab, setSelectedTab] = React.useState<string>('mood');

  // Start date defaults to one week ago.
  const [startDate, setStartDate] = React.useState<Date>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = React.useState<Date>(new Date());

  const [tagSet, setTagSet] = React.useState<Tag[]>([]);

  const [moodValues, setMoodValues] = React.useState<number[]>([]);
  const [moodLabels, setMoodLabels] = React.useState<string[]>([]);
  const [todoList, setTodoList] = React.useState<DisplayedTodo[]>([]);

  const handleStartDateChange = (selectedDate: Date | null) => {
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (selectedDate: Date | null) => {
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  useEffect(() => {
    api.listTags().then((tags) => {
      if (!tags) return;
      console.log(tags);
      setTagSet(tags);
    });
  }, []);

  useEffect(() => {
    api.listEntries({ startDate: startDate.toDateString(), endDate: endDate.toDateString() }).then((entries) => {
      if (!entries) return;

      // Process Mood
      // ############

      const dateToMood: Record<string, number> = {};
      entries.forEach((entry) => {
        const filteredThoughts = entry.thoughts.filter((thought) => thought.mood !== undefined);
        if (filteredThoughts.length > 0) {
          const entryMood = filteredThoughts.reduce((acc, thought) => acc + thought.mood, 0) / filteredThoughts.length;
          dateToMood[entry.date] = entryMood;
        }
      });

      // Now we compute an array of moods across the date range. If no entry, carry over the previous mood.
      const moods: number[] = [];
      const moodLabels: string[] = [];
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dateString = currentDate.toISOString().split('T')[0];
        moodLabels.push(dateString);
        if (dateToMood[dateString]) {
          moods.push(dateToMood[dateString]);
        } else {
          moods.push(moods[moods.length - 1]);
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      setMoodValues(moods);
      setMoodLabels(moodLabels);

      // Process Todo List
      // #################

      const todoList: DisplayedTodo[] = [];
      entries.forEach((entry) => {
        entry.thoughts.forEach((thought) => {
          if (thought.actions) {
            const actions: string[] = thought.actions.split(';');
            actions.forEach((action) => {
              todoList.push({
                date: entry.date,
                action: action,
                thought: thought.content
              });
            });
          }
        });
      });
      setTodoList(todoList);
    });
  }, [startDate, endDate, tagSet]);

  const data = {
    labels: moodLabels,
    datasets: [
      {
        label: 'Mood',
        data: moodValues,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        lineTension: 0.3
      }
    ]
  };

  return (
    <Pane width="100%" display="flex" flexDirection="column">
      {/* Top Bar */}
      <Pane
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
        alignItems="center"
        padding={32}
        paddingBottom={0}
        width="100%"
      >
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          handleStartDateChange={handleStartDateChange}
          handleEndDateChange={handleEndDateChange}
        />
        <Pane display="flex" flexDirection="row" alignItems="center">
          <Pane
            backgroundColor={selectedTab == 'mood' ? 'rgba(255, 255, 255, 0.7) ' : 'rgba(255, 255, 255, 0.3)'}
            padding={12}
            paddingLeft={32}
            paddingRight={32}
            cursor="pointer"
            borderTopLeftRadius={32}
            borderBottomLeftRadius={32}
            onClick={() => setSelectedTab('mood')}
          >
            <Text fontSize="1rem">
              <b>Mood</b>
            </Text>
          </Pane>
          <Pane
            backgroundColor={selectedTab == 'todo' ? 'rgba(255, 255, 255, 0.7) ' : 'rgba(255, 255, 255, 0.3)'}
            padding={12}
            paddingLeft={32}
            paddingRight={32}
            cursor="pointer"
            borderTopRightRadius={32}
            borderBottomRightRadius={32}
            onClick={() => setSelectedTab('todo')}
          >
            <Text fontSize="1rem">
              <b>Todo List</b>
            </Text>
          </Pane>
        </Pane>
      </Pane>

      {/* Content */}
      <Pane flex={1} padding={32} display="flex" flexDirection="column" alignItems="center">
        <Pane backgroundColor="rgba(255, 255, 255, 0.7)" padding={32} borderRadius={4} flex={1} width="100%">
          {selectedTab === 'mood' && <Line options={options} data={data} />}
          {selectedTab === 'todo' && (
            <Pane display="flex" flexDirection="column" width="100%">
              {todoList.map((todo) => (
                <Todo todo={todo} />
              ))}
            </Pane>
          )}
        </Pane>
      </Pane>
    </Pane>
  );
}

export default Analysis;

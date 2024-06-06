import '../../App.css';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Heading,
  Button,
  TickCircleIcon,
  ArrowRightIcon,
  Popover,
  Position,
  NotificationsSnoozeIcon
} from 'evergreen-ui';
import { Task } from '../../types';
import { Pane } from 'evergreen-ui';

import useAPI from '../../hooks/useAPI';
import { EditableText } from '@blueprintjs/core';
import { DatePicker3 } from '@blueprintjs/datetime2';

interface SnoozePickerProps {
  handleDateChange: (selectedDate: Date | null) => void;
}

function SnoozePicker({ handleDateChange }: SnoozePickerProps) {
  return (
    <Pane display="flex" flexDirection="row" alignItems="center" width="100%">
      <Popover
        position={Position.BOTTOM_RIGHT}
        content={({ close }) => (
          <Pane
            width={window.innerWidth * 0.7}
            height={window.innerWidth * 0.7}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            <DatePicker3
              value={new Date()}
              dayPickerProps={{ showOutsideDays: true }}
              onChange={() => {
                handleDateChange(new Date());
                close();
              }}
            />
          </Pane>
        )}
      >
        <Button iconAfter={NotificationsSnoozeIcon} appearance="primary" height={64} width="100%" marginTop={16}>
          Snooze
        </Button>
      </Popover>
    </Pane>
  );
}

interface TaskDetailProps {
  task: Task;
  onChangeName: (name: string) => void;
  onChangeContent: (content: string) => void;
  onCompleteTask: () => void;
  onIgnoreTask: () => void;
  onSnoozeTask: (date: Date) => void;
}

function TaskDetail({
  task,
  onChangeName,
  onChangeContent,
  onCompleteTask,
  onIgnoreTask,
  onSnoozeTask
}: TaskDetailProps) {
  const [name, setName] = useState<string>(task.name);
  const [content, setContent] = useState<string>(task.notes);

  return (
    <Pane backgroundColor="rgba(255, 255, 255, 0.7)" padding={32} borderRadius={4} flex={1} width="100%">
      <Pane display="flex" flexDirection="column" width="100%" alignItems="flex-start" flex={1} height="100%">
        <Pane>
          <Heading size={800} marginBottom={16} textAlign="left">
            <EditableText
              multiline
              defaultValue={name}
              placeholder="Task Name"
              onChange={(name) => setName(name)}
              onConfirm={() => onChangeName(name)}
            />
          </Heading>
          <EditableText
            multiline
            defaultValue={content}
            placeholder="Add notes..."
            minLines={3}
            maxLines={10}
            className="thought-editor-editable-text"
            onChange={(content) => setContent(content)}
            onConfirm={() => onChangeContent(content)}
          />
        </Pane>
        <Pane flex={1} />
        <Pane width="100%">
          <Button
            iconAfter={ArrowRightIcon}
            appearance="primary"
            intent="danger"
            onClick={onIgnoreTask}
            marginTop={16}
            width="100%"
            height={64}
          >
            Continue
          </Button>
          <SnoozePicker
            handleDateChange={(selectedDate) => {
              if (!selectedDate) return;
              onSnoozeTask(selectedDate);
            }}
          />
          <Button
            iconAfter={TickCircleIcon}
            appearance="secondary"
            intent="success"
            onClick={onCompleteTask}
            marginTop={16}
            width="100%"
            height={64}
          >
            Mark Complete
          </Button>
        </Pane>
      </Pane>
    </Pane>
  );
}

function makeDefaultTask(): Task {
  return {
    id: '0',
    name: 'Task Name',
    notes: 'Task Notes',
    is_completed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tags: [],
    snooze: null,
    is_evergreen: false,
    is_ideal: false
  };
}

function TasksList() {
  const api = useAPI();
  const [currentTask, setCurrentTask] = React.useState<Task | null>(null);

  const handleChangeName = useCallback(
    (name: string) => {
      if (!currentTask) return;
      api.updateTask({ taskID: currentTask.id, task: { name } });
    },
    [currentTask, api]
  );

  const handleChangeContent = useCallback(
    (content: string) => {
      if (!currentTask) return;
      api.updateTask({ taskID: currentTask.id, task: { notes: content } });
    },
    [currentTask, api]
  );

  const handleCompleteTask = useCallback(() => {
    if (!currentTask) return;
    api.updateTask({ taskID: currentTask.id, task: { is_completed: true } }).then(() => {
      api.listTasks().then((tasks) => {
        if (!tasks) return;
        setCurrentTask(tasks[0]);
      });
    });
  }, [currentTask, api]);

  const handleContinue = useCallback(() => {
    if (!currentTask) return;
    api.updateTask({ taskID: currentTask.id, task: { updated_at: new Date().toISOString() } }).then(() => {
      api.listTasks().then((tasks) => {
        if (!tasks) return;
        setCurrentTask(tasks[0]);
      });
    });
  }, [currentTask, api]);

  const handleSnoozeTask = useCallback(
    (date: Date) => {
      if (!currentTask) return;
      api.updateTask({ taskID: currentTask.id, task: { snooze: date.toISOString() } }).then(() => {
        api.listTasks().then((tasks) => {
          if (!tasks) return;
          setCurrentTask(tasks[0]);
        });
      });
    },
    [currentTask, api]
  );

  const handleCreateTask = useCallback(() => {
    const newTask = makeDefaultTask();
    api.createTask({ task: newTask }).then((task) => {
      if (!task) return;
      setCurrentTask(task);
    });
  }, [api]);

  useEffect(() => {
    api.listTasks().then((tasks) => {
      if (!tasks) return;
      setCurrentTask(tasks[0]);
    });
  }, []);

  return (
    <Pane width="100%" display="flex" flexDirection="column">
      {/* Content */}
      <Pane flex={1} padding={16} display="flex" flexDirection="column" alignItems="flex-start">
        <Button appearance="primary" marginBottom={16} width="100%" borderRadius={4} onClick={handleCreateTask}>
          Add New Task
        </Button>
        {currentTask && (
          <TaskDetail
            key={currentTask.id}
            task={currentTask}
            onChangeName={handleChangeName}
            onChangeContent={handleChangeContent}
            onCompleteTask={handleCompleteTask}
            onIgnoreTask={handleContinue}
            onSnoozeTask={handleSnoozeTask}
          />
        )}
      </Pane>
    </Pane>
  );
}

export default TasksList;

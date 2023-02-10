import React, {useState, useRef} from 'react';
import {useForm} from 'react-hook-form';
import {SubmitHandler} from 'react-hook-form/dist/types';

// create a interface that describes form inputs
interface Inputs {
  task: string;
  edit: string;
}
// create a interface that describes a task
interface Task {
  text?: string;
  completed: boolean;
}

const App: React.FC = () => {
  // main tasks state
  const [tasks, setTasks] = useState<Task[]>([]);
  // check if user entered in clear check
  const [clearButtonCheck, setClearButtonCheck] = useState<boolean>();
  // check if user entered in edit task
  const [edit, setEdit] = useState<boolean>();

  // first time using useForm hook
  const {register, handleSubmit, reset} = useForm<Inputs>();

  // dragged item references
  const dragEnter = useRef(null);
  const dragStart = useRef(null);
  const editRef = useRef<HTMLInputElement>(null);

  // form main function
  const onSubmit: SubmitHandler<Inputs> = ({task}): void => {
    // protecting code
    if (task) {
      setTasks(() => [...tasks, {text: task, completed: false}]);
      reset();
    }
  };

  //task done function
  const handleTaskDone = (e: Task, key: number) => {
    setTasks(
      tasks.map((task, i) => {
        if (key === i) {
          return {...task, completed: !task.completed};
        }
        return task;
      })
    );
  };

  // Task delete function
  const handleDeleteButton: React.MouseEventHandler<HTMLButtonElement> = (event): void => {
    event.stopPropagation();
    // delete task by its text
    const newTasks = tasks?.filter((el) => el.text !== event.currentTarget.value);
    // update main task array
    setTasks(newTasks);
  };

  // handle clear input toggle
  const handleClearButton = (): void => {
    setClearButtonCheck(true);
  };

  // handle main tasks array clear function
  const handleClearConfirmation = ({currentTarget}: React.MouseEvent<HTMLButtonElement>): void => {
    if (currentTarget.name === 'yes') {
      setClearButtonCheck(false);
      return setTasks([]);
    }
    setClearButtonCheck(false);
  };

  // enter edit mode
  const handleEditClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setEdit(true);
  };

  // update edited task
  const handleEditChange = (key: number) => {
    setTasks(
      tasks.map((task, i) => {
        if (key === i) {
          return {...task, text: editRef.current?.value};
        }
        return task;
      })
    );
  };

  // exit edit mode
  const handleEditDone = (event: React.MouseEvent) => {
    event.stopPropagation();
    setEdit(false);
  };

  // main drag function
  const handleDragEnd = (): void => {
    // create a copy of main tasks array
    const copyTask = [...tasks];

    // remove and save dragged item
    const saved = copyTask?.splice(dragStart.current as null & number, 1)[0];

    // switch places with dragged item and the static one
    copyTask?.splice(dragEnter.current as null & number, 0, saved);

    // update main task array
    setTasks([...copyTask]);

    // reset drag item reference
    dragEnter.current = null;
    dragStart.current = null;
  };

  // set index of the entered item
  const handleDragEnter = (key: number): void => {
    dragEnter.current = key as null & number;
  };

  // set index of the dragged item
  const handleDragStart = (key: number): void => {
    dragStart.current = key as null & number;
  };

  return (
    <div className=" flex flex-col content-center bg-gray-50 w-screnn h-screen">
      <p className="flex font-bold font-mono h-24 items-center justify-center text-center text-4xl bg-gradient-to-br from-white via-blue-200 to-blue-400 shadow-md ">
        TO-DO
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="content-center flex flex-wrap justify-center mt-4 w-full"
      >
        <input
          className="border border-2 content-center flex h-12 p-1 rounded-md shadow-md text-xl w-1/2"
          defaultValue={''}
          placeholder="Type a task"
          {...register('task')}
          type="text"
        />
        <button
          className=" ml-4 w-12 border border-2 rounded-md shadow-md"
          type="submit"
        >
          ➕
        </button>
        {clearButtonCheck ? (
          <div className=" p-2 rounded-md ml-4 flex border border-2 items-center shadow-md">
            <button
              className="w-12 hover:bg-blue-400 border border-2 border-blue-400 rounded-md"
              name="no"
              onClick={handleClearConfirmation}
            >
              No
            </button>
            <button
              className=" ml-4 w-12 hover:bg-red-700 border border-2 border-red-700 rounded-md"
              name="yes"
              onClick={handleClearConfirmation}
            >
              Yes
            </button>
          </div>
        ) : (
          <button
            className=" ml-4 w-12 border border-2 rounded-md shadow-md"
            onClick={handleClearButton}
          >
            🧹
          </button>
        )}
        <div
          className={
            tasks.length > 0
              ? 'flex flex-wrap border mt-8 p-2 self-center w-full shadow-md justify-center'
              : 'hidden'
          }
        >
          {tasks.map((e, key) => {
            return (
              <li
                className="cursor-pointer flex flex-row hover:bg-blue-200 space-x-2 m-4 bg-white border border-blue-400 p-4 rounded-md w-full"
                draggable
                key={key}
                onClick={() => handleTaskDone(e, key)}
                onDragEnd={() => handleDragEnd()}
                onDragEnter={() => handleDragEnter(key)}
                onDragStart={() => handleDragStart(key)}
                onDragOver={(e) => e.preventDefault()}
              >
                {edit ? (
                  <>
                    <input
                      className="font-mono border rounded-md p-2"
                      autoFocus
                      {...register('edit')}
                      onChange={() => handleEditChange(key)}
                      ref={editRef}
                      value={e.text}
                    />
                  </>
                ) : (
                  <>
                    <p
                      className={
                        !e.completed
                          ? 'flex items-center font-bold justift-self-start text-2xl w-11/12'
                          : ' before:content-["✔"] before:ml-2 flex items-center font-bold justift-self-start text-2xl w-11/12 text-blue-400'
                      }
                    >
                      {e.text}
                    </p>
                    <button onClick={handleEditClick}>✏</button>
                    <button
                      className=" flex justify-end items-center "
                      onClick={(e) => handleDeleteButton(e)}
                      value={e.text}
                    >
                      ❌
                    </button>
                  </>
                )}
              </li>
            );
          })}
          {edit && (
            <button
              className="bg-white hover:bg-transparent content-center p-1 ml-4 w-12 border border-2 rounded-md shadow-md"
              onClick={handleEditDone}
            >
              ✔
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default App;

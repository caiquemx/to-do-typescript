import React, {useState, useRef} from 'react';
import {useForm} from 'react-hook-form';
import {SubmitHandler} from 'react-hook-form/dist/types';

// create a interface that describe form inputs
interface Inputs {
  task: string;
}

const App: React.FC = () => {
  // main task state
  const [tasks, setTask] = useState<string[]>([]);

  // first time using useForm hook
  const {register, handleSubmit, reset} = useForm<Inputs>();

  // dragged item references
  const dragEnter = useRef(null);
  const dragStart = useRef(null);

  // form main function
  const onSubmit: SubmitHandler<Inputs> = ({task}): void => {
    // protecting code
    if (task) {
      setTask(() => [...tasks, task]);
      reset();
    }
  };

  // Task delete function
  const handleDeleteButton: React.MouseEventHandler<HTMLButtonElement> = (event): void => {
    // delete task by its text
    const newTasks = tasks.filter((el) => el !== event.currentTarget.value);
    // update main task array
    setTask(newTasks);
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
    setTask([...copyTask]);

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
      <p className="flex font-bold font-mono h-24 items-center justify-center text-center text-4xl bg-blue-400 ">
        TO-DO
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="content-center flex justify-center mt-4 w-full"
      >
        <input
          className="border border-2 content-center flex h-12 p-1 rounded-md shadow-md text-xl w-1/2"
          defaultValue={''}
          placeholder="Type a task"
          {...register('task')}
          type="text"
        />
        <button
          className=" ml-4 w-12 border border-2 before:border-black rounded-md shadow-md"
          type="submit"
        >
          ➕
        </button>
      </form>
      <div className="border mt-8 p-2 self-center w-9/12 shadow-md">
        {tasks?.map((e, key) => {
          return (
            <div
              className=" cursor-pointer flex flex-row hover:bg-blue-200 space-x-2 m-4 bg-white border border-blue-400 p-4 min-w-fit rounded-md max-w-full"
              draggable
              key={key}
              onDragEnd={() => handleDragEnd()}
              onDragEnter={() => handleDragEnter(key)}
              onDragStart={() => handleDragStart(key)}
              onDragOver={(e) => e.preventDefault()}
            >
              <p className="font-bold justift-self-start text-2xl w-9/12">{e}</p>
              <button
                className=" flex justify-end items-center w-1/4"
                onClick={(e) => handleDeleteButton(e)}
                value={e}
              >
                ❌
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;

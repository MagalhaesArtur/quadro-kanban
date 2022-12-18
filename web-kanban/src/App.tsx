import { useEffect, useState } from "react";
import { idn, TasksProps, TypeProps } from "./utils/interfaces";
import "./main.css";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

function unirTypes(tasks: TasksProps[], typesTasks: TypeProps[]) {
  var aux: idn[] = [];

  typesTasks.map((type) => {
    tasks.map((task) => {
      if (type.type == task.type) {
        aux.push({
          type,
          task,
        });
      }
    });
  });

  return aux;
}

function App() {
  const [tasks, setTasks] = useState(Array<TasksProps>);
  const [typesTasks, setTypesTasks] = useState(Array<TypeProps>);

  let aux: idn[] = [];

  function handleOnDragEnd(result: any) {
    console.log("cu");
  }

  useEffect(() => {
    fetch("http://localhost:3333/types", options).then((res) => {
      res.json().then((data) => {
        setTypesTasks(data);
      });
    });
  }, []);

  useEffect(() => {
    fetch("http://localhost:3333/", options).then((res) => {
      res.json().then((data) => {
        setTasks(data);
      });
    });
  }, []);

  aux = unirTypes(tasks, typesTasks);

  return (
    <div className=" min-h-screen min-w-screen p-4 bg-slate-300">
      <div className="w-[80%] justify-center flex gap-x-10">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          {typesTasks.map((type1) => (
            <Droppable droppableId="characters">
              {(type3) => (
                <div
                  className="w-[500px] h-96 items-center justify-center  bg-slate-300 shadow-2xl flex flex-col p-4 gap-y-6 rounded-lg"
                  {...type3.droppableProps}
                  ref={type3.innerRef}
                >
                  <>
                    {aux.map((aux, index) =>
                      aux.task.type == type1.type ? (
                        <Draggable
                          key={aux.task.id}
                          draggableId={aux.task.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              className="w-[70%] h-10 bg-red-500 text-center"
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <div className="w-[70%] h-10">
                                {aux.task.content}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ) : null
                    )}
                    {type3.placeholder}
                  </>
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;

{
  /* {tasks.map((task) => {
  if (task.type == type.type) {
    return (
      <div className="w-[90%] h-20 flex justify-center items-center bg-slate-200 shadow-xl rounded-lg">
        {task.content}
      </div>
    );
  }
})} */
}

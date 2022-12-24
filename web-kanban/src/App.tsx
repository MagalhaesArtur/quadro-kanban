import { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { Droppable } from "react-beautiful-dnd";
import { Draggable } from "react-beautiful-dnd";
import { X } from "phosphor-react";
import "./main.css";
import { TaskProps, TypeProps } from "./utils/interfaces";
import { deleteTesk } from "./utils/deleteTask";
import HeaderType from "./components/headerType";

import * as Dialog from "@radix-ui/react-dialog";
import CreateTaskForm from "./components/createTaskForm";

const options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

function App() {
  let [typesTasks, setTypesTasks] = useState(Array<TypeProps>);
  const [i, seti] = useState(0);
  const [isMouseOnTask, setIsMouseOnTask] = useState(false);
  const [itemId, setItemId] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const [num, setNum] = useState(0);

  function updateTask(typesTasks: Array<TypeProps>): object {
    const options2 = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(typesTasks),
    };
    return options2;
  }

  useEffect(() => {
    let aux: any = localStorage.getItem("data");
    if (aux == null) {
      fetch("http://localhost:3333/types", options).then((res) => {
        res.json().then((data) => {
          setTypesTasks(data);
          localStorage.setItem("data", JSON.stringify(data));
        });
      });
    } else {
      setTypesTasks(JSON.parse(aux));
    }
  }, []);

  useEffect(() => {
    if (num != 0) {
      let aux: any = localStorage.getItem("data");
      if (aux != null) {
        fetch("http://localhost:3333/types", updateTask(typesTasks)).then(
          (res) => {
            res.json().then((data) => {
              localStorage.setItem("data", JSON.stringify(data));
            });
          }
        );
      }
    }
  }, [i]);

  var filteredSourceType: TaskProps[] = [];

  const onDragEnd = (result: any) => {
    setNum(1 + num);
    seti(1 + i);

    var draggedItem: any;
    // Excluindo o item arrastado
    if (result.destination.droppableId == result.source.droppableId) {
      for (let type of typesTasks) {
        if (type.id == result.destination.droppableId) {
          let sourceType = type.tasks;
          filteredSourceType = sourceType.filter(
            (type) => type.id != result.draggableId
          );
        }
      }
    }

    //

    // Localizando o item para colocar na nova posição (mesma coluna)
    for (let i in typesTasks) {
      if (
        typesTasks[i].id == result.destination.droppableId &&
        result.source.droppableId == result.destination.droppableId
      ) {
        for (let j in typesTasks[i].tasks) {
          if (typesTasks[i].tasks[j].id == result.draggableId) {
            draggedItem = typesTasks[i].tasks[j];
          }
        }
      }
    }
    //

    // Localizando o item para colocar na nova posição (!= coluna)
    for (let i in typesTasks) {
      if (
        typesTasks[i].id == result.source.droppableId &&
        result.source.droppableId != result.destination.droppableId
      ) {
        for (let j in typesTasks[i].tasks) {
          if (typesTasks[i].tasks[j].id == result.draggableId) {
            draggedItem = typesTasks[i].tasks[j];
          }
        }
      }
    }
    //

    // Adicionando o mesmo item na nova posição
    if (result.destination.droppableId == result.source.droppableId) {
      filteredSourceType.splice(result.destination.index, 0, draggedItem);

      for (let i in typesTasks) {
        if (typesTasks[i].id == result.destination.droppableId) {
          let copy = JSON.parse(JSON.stringify(typesTasks));
          copy[i].tasks = filteredSourceType;
          setTypesTasks(copy);
        }
      }
    }
    //

    // Excluindo um item de uma coluna para adicionar em outra
    for (let i in typesTasks) {
      if (
        typesTasks[i].id == result.source.droppableId &&
        result.source.droppableId != result.destination.droppableId
      ) {
        typesTasks[i].tasks.splice(typesTasks[i].tasks.indexOf(draggedItem), 1);
      }
    }
    //

    // Adiconando um item que foi retirado de uma coluna para colar em outra
    for (let i in typesTasks) {
      if (
        typesTasks[i].id == result.destination.droppableId &&
        result.source.droppableId != result.destination.droppableId
      ) {
        let copy = JSON.parse(JSON.stringify(typesTasks));

        copy[i].tasks.splice(result.destination.index, 0, draggedItem);
        copy[i].tasks[result.destination.index].type = copy[i].type;
        copy[i].tasks[result.destination.index].typeId = copy[i].id;
        setTypesTasks(copy);
      }
    }
    //
  };

  return (
    <Dialog.Root open={openDialog} onOpenChange={setOpenDialog}>
      <Dialog.Portal>
        <Dialog.Overlay
          onClick={() => {
            setOpenDialog(false);
          }}
          className="bg-black/60 inset-0 fixed"
        />
        <Dialog.Content className="fixed  bg-white text-slate-700 py-8 px-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  rounded-lg w-[600px] shadow-lg shadow-black/40">
          <Dialog.Title className="text-3xl mb-4  font-black">
            Crie uma tarefa
          </Dialog.Title>

          <CreateTaskForm />

          <Dialog.Description />
          <Dialog.Close />
        </Dialog.Content>
      </Dialog.Portal>
      <div className="flex justify-center gap-9" id="main">
        <DragDropContext onDragEnd={onDragEnd}>
          {typesTasks.map((type) => (
            <div key={type.id}>
              <HeaderType type={type}></HeaderType>
              <Droppable droppableId={type.id} key={type.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    className="bg-[#D0D3D4] rounded-b-lg shadow-md items-start flex flex-col  pb-7 px-4 pt-3 w-80 h-[400px]"
                  >
                    {type.tasks.map((item, index) => (
                      <Draggable
                        draggableId={item.id}
                        index={index}
                        key={item.id}
                      >
                        {(provided) => (
                          <div
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                            ref={provided.innerRef}
                            onMouseEnter={() => {
                              setItemId(item.id);
                              setIsMouseOnTask(true);
                            }}
                            onMouseLeave={() => {
                              setIsMouseOnTask(false);
                            }}
                            className={`w-[100%] h-14 flex justify-between border-l-[5px]  items-center ${
                              item.priority == 0
                                ? "border-blue-600"
                                : item.priority == 1
                                ? "border-orange-400"
                                : item.priority == 2
                                ? "border-red-600"
                                : null
                            } text-slate-700 text-lg font-medium my-1 bg-white p-3 rounded-lg shadow-lg`}
                            title={`${
                              item.priority == 0
                                ? "Prioridade: Fazer sem pressa"
                                : item.priority == 1
                                ? "Prioridade: Não atrasar"
                                : item.priority == 2
                                ? "Prioridade: Urgente"
                                : null
                            }`}
                          >
                            {item.content}
                            <X
                              size={24}
                              onClick={() => {
                                deleteTesk(item, typesTasks, setTypesTasks);
                              }}
                              className={
                                isMouseOnTask && item.id == itemId
                                  ? `text-red-500 transition-all z-10 cursor-pointer`
                                  : "text-transparent  transition-all z-10 cursor-pointer"
                              }
                              weight="bold"
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </DragDropContext>
      </div>
    </Dialog.Root>
  );
}

export default App;

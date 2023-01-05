import { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { Droppable } from "react-beautiful-dnd";
import { Draggable } from "react-beautiful-dnd";
import { ChatText, CircleNotch, X } from "phosphor-react";
import Button from "@mui/material/Button";

import "./main.css";
import { TaskCommentsProps, TaskProps, TypeProps } from "./utils/interfaces";
import HeaderType from "./components/headerType";

import * as Dialog from "@radix-ui/react-dialog";
import CreateTaskForm from "./components/createTaskForm";
import { updateTask } from "./utils/updateTaskFetchParams";
import Comments from "./components/comments";
import { SwitchTheme } from "./components/SwitchTheme";

const options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  let [typesTasks, setTypesTasks] = useState(Array<TypeProps>);
  const [loading, setLoading] = useState(false);
  let [comments, setComments] = useState(Array<TaskCommentsProps>);
  let [currentComments, setCurrentComments] = useState(
    Array<TaskCommentsProps>
  );
  let [currentItemId, setCurrentItemId] = useState(String);
  const [i, seti] = useState(0);
  const [x, setx] = useState(0);

  const [currentType, setCurrentType] = useState(String);
  const [isMouseOnTask, setIsMouseOnTask] = useState(false);
  const [itemId, setItemId] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialog2, setOpenDialog2] = useState(false);

  const [num, setNum] = useState(0);

  useEffect(() => {
    let aux: any = localStorage.getItem("data");
    fetch(`${import.meta.env.VITE_API_URL}/comments`).then((res) => {
      res.json().then((data) => {
        setComments(data);
      });
    });
    if (aux === null || x != 0) {
      fetch(`${import.meta.env.VITE_API_URL}/types`, options).then((res) => {
        res.json().then(async (data) => {
          let aux: TypeProps[] = data;
          setTypesTasks(data);
          for (let type in aux) {
            for (let task in aux[type].tasks) {
              for (let comment in comments) {
                if (comments[comment].taskId == aux[type].tasks[task].id) {
                }
              }
            }
          }
          setTypesTasks(aux);
          localStorage.setItem("data", JSON.stringify(data));
        });
      });
    } else {
      setTypesTasks(JSON.parse(aux));
    }
  }, [x]);

  useEffect(() => {
    if (num != 0) {
      setLoading(true);
      let aux: any = localStorage.getItem("data");
      if (aux != null) {
        fetch(
          `${import.meta.env.VITE_API_URL}/types`,
          updateTask(typesTasks)
        ).then((res) => {
          res.json().then((data) => {
            localStorage.setItem("data", JSON.stringify(data));
            setLoading(false);
          });
        });
      }
    }
  }, [i]);

  var filteredSourceType: TaskProps[] = [];

  // Função que faz a devida mudança nos index's das colunas
  const onDragEnd = (result: any) => {
    setItemId(result.draggableId);
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

          <CreateTaskForm
            setLoading={setLoading}
            setTypeTasks={setTypesTasks}
            typeTasks={typesTasks}
            i={i}
            setOpenDialog={setOpenDialog}
            seti={seti}
            currentType={currentType}
          />

          <Dialog.Description />
          <Dialog.Close />
        </Dialog.Content>
      </Dialog.Portal>

      <Dialog.Root open={openDialog2} onOpenChange={setOpenDialog2}>
        <Dialog.Portal>
          <Dialog.Overlay
            onClick={() => {
              setOpenDialog2(false);
            }}
            className="bg-black/60 inset-0 fixed"
          />
          <Dialog.Content
            className={`fixed  bg-white text-slate-700 py-8 px-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  rounded-lg w-[600px] shadow-lg shadow-black/40 ${
              isDarkMode ? "bg-gray-900" : "bg-white"
            }`}
          >
            <Dialog.Title
              className={`text-xl mb-4 ${
                isDarkMode ? "text-slate-300" : "text-gray-900"
              }  font-black`}
            >
              Criar um novo comentário...
            </Dialog.Title>
            <Comments
              isDarkMode={isDarkMode}
              setx={setx}
              x={x}
              setComments={setComments}
              comments={comments}
              setLoading={setLoading}
              loading={loading}
              currentItemId={currentItemId}
              currentComments={currentComments}
              setCurrentComments={setCurrentComments}
            />

            <Dialog.Description />
            <Dialog.Close />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <div
        className="flex relative transition-all justify-center gap-9"
        id={isDarkMode ? "main2" : "main"}
      >
        {loading ? (
          <CircleNotch
            size={60}
            weight="bold"
            className="text-white z-50 absolute top-4 right-4 animate-spin"
          />
        ) : null}

        <SwitchTheme isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

        <DragDropContext onDragEnd={onDragEnd}>
          {typesTasks.map((type) => (
            <div key={type.id}>
              <HeaderType
                setCurrentType={setCurrentType}
                type={type}
              ></HeaderType>
              <Droppable droppableId={type.id} key={type.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    onMouseEnter={() => {
                      setCurrentType(type.type);
                    }}
                    className="bg-[#D0D3D4] overflow-y-scroll rounded-b-lg shadow-md items-start flex flex-col  pb-7 px-4 pt-3 w-80 h-[400px]"
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
                            id="comment"
                            className={`w-[100%] h-18 flex flex-col justify-between border-l-[5px]  items-start ${
                              item.priority == 0
                                ? "border-blue-600"
                                : item.priority == 1
                                ? "border-orange-400"
                                : item.priority == 2
                                ? "border-red-600"
                                : null
                            }  text-lg font-medium my-1  p-3 rounded-lg transition-colors shadow-lg ${
                              !isDarkMode
                                ? "bg-white text-slate-700"
                                : "bg-gray-900 text-white"
                            }`}
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
                            <div className="w-[100%] h-18 mb-2 flex justify-between  items-center">
                              <h1>{item.content}</h1>
                              <X
                                size={24}
                                onClick={async () => {
                                  setLoading(true);
                                  fetch(
                                    `${
                                      import.meta.env.VITE_API_URL
                                    }/deleteManyComments`,
                                    {
                                      method: "DELETE",
                                      headers: {
                                        "Content-Type": "application/json",
                                      },
                                      body: JSON.stringify(item),
                                    }
                                  ).then(() => {
                                    fetch(
                                      `${
                                        import.meta.env.VITE_API_URL
                                      }/deleteTask`,
                                      {
                                        method: "DELETE",
                                        headers: {
                                          "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify(item),
                                      }
                                    ).then((res) => {
                                      // Ajustando os index's dos elementos quando são excluidos
                                      for (let type in aux) {
                                        for (let task in aux[type].tasks) {
                                          if (
                                            aux[type].tasks[task].id === item.id
                                          ) {
                                            aux[type].tasks.splice(
                                              aux[type].tasks.indexOf(
                                                aux[type].tasks[task]
                                              ),
                                              1
                                            );
                                          }
                                        }
                                      }
                                      setTypesTasks(aux);
                                      localStorage.setItem(
                                        "data",
                                        JSON.stringify(aux)
                                      );
                                      setLoading(false);
                                    });
                                  });
                                  let aux: TypeProps[] = JSON.parse(
                                    JSON.stringify(typesTasks)
                                  );
                                }}
                                className={
                                  isMouseOnTask && item.id == itemId
                                    ? `text-red-500 transition-all z-10 cursor-pointer`
                                    : "text-transparent  transition-all z-10 cursor-pointer"
                                }
                                weight="bold"
                              />
                            </div>
                            <Button
                              onClick={() => {
                                let auxComments: TaskCommentsProps[] = [];
                                for (let comment of comments) {
                                  if (comment.taskId == item.id) {
                                    auxComments.push(comment);
                                  }
                                }
                                setCurrentComments(auxComments);
                                setCurrentItemId(itemId);
                                setOpenDialog2(true);
                              }}
                              className="!rounded-full  !min-w-[0px] !p-2 "
                              variant="outlined"
                            >
                              <ChatText
                                size={16}
                                color={`${!isDarkMode ? "#7c7584" : "white"} `}
                              />
                            </Button>
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

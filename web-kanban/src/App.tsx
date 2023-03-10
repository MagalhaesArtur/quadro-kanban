import { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { Droppable, Draggable } from "react-beautiful-dnd";
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
import { isTaskInArray } from "./utils/isTaskInArray";

const fetchOptions = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

function App() {
  const [currentTask, setCurrentTask] = useState(Object);

  const [isDarkMode, setIsDarkMode] = useState(false);
  let [typesTasks, setTypesTasks] = useState(Array<TypeProps>);
  const [loading, setLoading] = useState(false);
  let [comments, setComments] = useState(Array<TaskCommentsProps>);
  let [currentComments, setCurrentComments] = useState(
    Array<TaskCommentsProps>
  );
  let [currentItemId, setCurrentItemId] = useState(String);

  // State que monitora mudanças de tipo de tarefas
  const [onChangeTask, setOnChangeTask] = useState(0);
  const [isCreatedComment, setIsCreatedComment] = useState(0);

  const [currentType, setCurrentType] = useState(String);
  const [isMouseOnTask, setIsMouseOnTask] = useState(false);
  const [itemId, setItemId] = useState("");

  // Variável auxiliar que identifica se o dialog de criação de uma tarefa está aberto
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  // Variável auxiliar que identifica se o dialog de criação de um comentário tarefaa está aberto
  const [isCreateCommentOpen, setIsCreateCommentOpen] = useState(false);

  // Variável auxiliar que identifica se o usuário fez alguma mudança do tipo de tarefa
  const [isChanged, setIsChanged] = useState(0);
  //
  //
  //
  // Hook que atuliza uma coluna de tarefas se foi feita uma mudança do tipo de uma tarefa (Adição).
  useEffect(() => {
    let types = localStorage.getItem("data");
    if (isChanged == 0 && types != null) {
      let string: any = localStorage.getItem("data");
      let aux: TypeProps[] = JSON.parse(string);
      for (let type in aux) {
        if (currentTask.typeId == aux[type].id) {
          aux[type].tasks.push(currentTask);
        }
      }
      setTypesTasks(aux);
      localStorage.setItem("data", JSON.stringify(aux));
    }
  }, [currentTask]);

  // Hook que atuliza uma coluna de tarefas se foi feita uma alteração de no tipo de uma tarefa em outra página (Remoção). A atualização ocorre ao reiniciar a página.
  // Também verifica se foi feita uma criação de outra tarefa em outra página ao reiniciar a página. A atualização ocorre ao reiniciar a página.
  useEffect(() => {
    let types = localStorage.getItem("data");

    if (isChanged == 0 && types != null) {
      fetch(`${import.meta.env.VITE_API_URL}/`, fetchOptions).then((res) => {
        res
          .json()
          .then((data: TaskProps[]) => {
            let string: any = localStorage.getItem("data");
            let aux: TypeProps[] = JSON.parse(string);

            for (let type in aux) {
              for (let task in aux[type].tasks) {
                for (let task1 of data) {
                  if (
                    aux[type].tasks[task].id == task1.id &&
                    aux[type].tasks[task].typeId != task1.typeId
                  ) {
                    aux[type].tasks[task].typeId = task1.typeId;
                    aux[type].tasks[task].type = task1.type;

                    aux[type].tasks.splice(
                      aux[type].tasks.indexOf(aux[type].tasks[task]),
                      1
                    );

                    setTypesTasks(aux);
                    localStorage.setItem("data", JSON.stringify(aux));
                    setCurrentTask(task1);
                  }
                }
              }
            }
          })
          .then(() => {
            let types = localStorage.getItem("data");

            if (isChanged == 0 && types != null) {
              fetch(`${import.meta.env.VITE_API_URL}/`, fetchOptions).then(
                (res) => {
                  res.json().then((data: TaskProps[]) => {
                    let string: any = localStorage.getItem("data");
                    let aux: TypeProps[] = JSON.parse(string);

                    let typesAux: TypeProps[] = isTaskInArray(
                      data,
                      setIsChanged,
                      isChanged,
                      aux
                    );
                    setTypesTasks(typesAux);
                    localStorage.setItem("data", JSON.stringify(typesAux));
                  });
                }
              );
            }
          });
      });
    }
  }, []);
  //
  //
  //

  // Fazendo a requisição dos comentários de tarefas e inserindo os comentários na propriedades comments no objeto de uma tarefa.
  useEffect(() => {
    let aux: any = localStorage.getItem("data");
    fetch(`${import.meta.env.VITE_API_URL}/comments`).then((res) => {
      res.json().then((data) => {
        setComments(data);
      });
    });
    if (aux === null || isCreatedComment != 0) {
      fetch(`${import.meta.env.VITE_API_URL}/types`, fetchOptions).then(
        (res) => {
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
        }
      );
    } else {
      setTypesTasks(JSON.parse(aux));
    }
  }, [isCreatedComment]);

  useEffect(() => {
    if (isChanged != 0) {
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
  }, [onChangeTask]);

  var filteredSourceType: TaskProps[] = [];

  // Função que faz a devida mudança nos index's das colunas
  const onDragEnd = (result: any) => {
    setItemId(result.draggableId);
    setIsChanged(1 + isChanged);
    setOnChangeTask(1 + onChangeTask);

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
    <Dialog.Root open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
      <Dialog.Portal>
        <Dialog.Overlay
          onClick={() => {
            setIsCreateTaskOpen(false);
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
            onChangeTask={onChangeTask}
            setIsCreateTaskOpen={setIsCreateTaskOpen}
            setOnChangeTask={setOnChangeTask}
            currentType={currentType}
          />

          <Dialog.Description />
          <Dialog.Close />
        </Dialog.Content>
      </Dialog.Portal>

      <Dialog.Root
        open={isCreateCommentOpen}
        onOpenChange={setIsCreateCommentOpen}
      >
        <Dialog.Portal>
          <Dialog.Overlay
            onClick={() => {
              setIsCreateCommentOpen(false);
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
              setIsCreatedComment={setIsCreatedComment}
              isCreatedComment={isCreatedComment}
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
        className=" relative flex justify-center  transition-all  "
        id={isDarkMode ? "main2" : "main"}
      >
        <div
          id="mainBoxComment"
          className="md:max-w-[90%] md:overflow-y-hidden   md:flex md:!flex-row  md:gap-9 justify-center  xl:min-w-full"
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
              <div key={type.id} className="sm:min-h-[180px]">
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
                      id="boxComment"
                      className="bg-[#D0D3D4] overflow-y-scroll rounded-b-lg shadow-md items-start flex flex-col  pb-7 px-4 pt-3  md:w-48 lg:w-64 xl:w-80  md:!h-[400px]"
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
                              className={`w-[100%]  h-18 flex flex-col justify-between border-l-[5px]  items-start ${
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
                                        let aux: TypeProps[] = JSON.parse(
                                          JSON.stringify(typesTasks)
                                        );
                                        for (let type in aux) {
                                          for (let task in aux[type].tasks) {
                                            if (
                                              aux[type].tasks[task].id ===
                                              item.id
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
                                  setIsCreateCommentOpen(true);
                                }}
                                className="!rounded-full  !min-w-[0px] !p-2 "
                                variant="outlined"
                              >
                                <ChatText
                                  size={16}
                                  color={`${
                                    !isDarkMode ? "#7c7584" : "white"
                                  } `}
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
      </div>
    </Dialog.Root>
  );
}

export default App;

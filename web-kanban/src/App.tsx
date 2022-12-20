import { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { Droppable } from "react-beautiful-dnd";
import { Draggable } from "react-beautiful-dnd";

const options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

function App() {
  interface TaskCommentsProps {
    id?: String;
    content: string;
    taskId: string;
  }

  interface TaskProps {
    id: string;
    content: string;
    priority: number;
    type: string;
    typeId: string;
  }

  interface TypeProps {
    type: string;
    id: string;
    tasks: Array<TaskProps>;
  }

  const [typesTasks, setTypesTasks] = useState(Array<TypeProps>);
  const [i, seti] = useState(0);

  function updateTask(typesTasks: Array<TypeProps>): object {
    const options2 = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        typesTasks,
      }),
    };
    console.log(typesTasks);
    return options2;
  }

  useEffect(() => {
    fetch("http://localhost:3333/types", options).then((res) => {
      res.json().then((data) => {
        setTypesTasks(data);
      });
    });
  }, []);

  useEffect(() => {
    fetch("http://localhost:3333/types", updateTask(typesTasks)).then((res) => {
      // res.json().then((data) => {
      //   console.log(data);
      // });
    });
  }, [i]);

  var filteredSourceType: TaskProps[] = [];

  const onDragEnd = (result: any) => {
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
    <div style={{ display: "flex", justifyContent: "center" }}>
      <DragDropContext onDragEnd={onDragEnd}>
        {typesTasks.map((type) => (
          <div
            key={type.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h1>{type.type}</h1>
            <Droppable droppableId={type.id} key={type.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  style={{
                    backgroundColor: "lightblue",
                    width: 250,
                    height: 500,
                    padding: 10,
                    margin: 10,
                  }}
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
                          style={{
                            backgroundColor: "gray",
                            height: 40,
                            marginBottom: 10,
                            ...provided.draggableProps.style,
                          }}
                          onMouseLeave={() => {
                            seti(i + 1);
                            console.log("2");
                          }}
                        >
                          {item.content}
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
  );
}

export default App;

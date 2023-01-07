import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

import { TypeProps, TaskProps } from "../utils/interfaces";

import "./styles/CreateTask.css";
import { Loading } from "./Loading";

function CreateTaskForm(props: {
  typeTasks: TypeProps[];
  onChangeTask: number;
  setOnChangeTask: Function;
  setIsCreateTaskOpen: Function;
  setTypeTasks: Function;
  currentType: string;
  setLoading: Function;
}) {
  let [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  let [createdTask, setCreatedTask] = useState(Object);

  const [priority, setPriority] = useState(0);
  let [typeId, setTypeId] = useState("");

  function updateTask(
    content: string,
    priority: number,
    typeId: string,
    type: string
  ) {
    const options2 = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        priority,
        typeId,
        type,
      }),
    };
    return options2;
  }
  return (
    <form
      onSubmit={(e) => {
        props.setLoading(true);
        e.preventDefault();

        for (let type1 of props.typeTasks) {
          if (props.currentType == type1.type) {
            typeId = type1.id;
          }
        }

        setIsLoading(true);
        fetch(
          `${import.meta.env.VITE_API_URL}/createTask`,
          updateTask(content, priority, typeId, props.currentType)
        ).then((res) => {
          res.json().then((data) => {
            setCreatedTask(data);
            let aux: any = localStorage.getItem("data");
            let aux2: TypeProps[] = JSON.parse(aux);

            for (let type1 of aux2) {
              if (typeId == type1.id) {
                type1.tasks.push(data);
              }
            }

            props.setTypeTasks(aux2);
            localStorage.setItem("data", JSON.stringify(aux2));
            props.setLoading(false);
          });
        });

        props.setOnChangeTask(props.onChangeTask + 1);
        setContent("");
        setPriority(Number);

        setTimeout(() => {
          alert("Tarefa Criada com Sucesso!");
          setIsLoading(false);
          props.setIsCreateTaskOpen(false);
        }, 500);
      }}
    >
      <div className="flex flex-col mb-4">
        <label htmlFor="nick" className="font-semibold mb-2">
          Conteúdo da Tarefa
        </label>
        <input
          name="nick"
          className="bg-[#D0D3D4] py-3 px-4 border-zinc-500 placeholder:text-zinc-500 text-[14px] rounded-lg"
          id="nick"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
          placeholder="Digite a tarefa..."
        />
      </div>

      <div className="flex flex-col   mb-4 mt-4">
        <label htmlFor="priority" className="font-semibold mb-2">
          Selecione a prioridade da tarefa
        </label>
        <select
          value={priority}
          defaultValue={"todo"}
          onChange={(e) => {
            setPriority(Number(e.target.value));
          }}
          name="priority"
          className="bg-[#D0D3D4] py-3 px-4 rounded-lg "
        >
          <option className="bg-[#D0D3D4] py-3 px-4 rounded-lg" value={0}>
            Fazer sem pressa
          </option>
          <option className="bg-[#D0D3D4] py-3 px-4 rounded-lg" value={1}>
            Não atrasar
          </option>
          <option className="bg-[#D0D3D4] py-3 px-4 rounded-lg" value={2}>
            Urgente
          </option>
        </select>
      </div>

      <footer className="flex justify-end gap-6 mt-4">
        <Dialog.Close
          type="button"
          className="bg-zinc-400 rounded-lg p-4 hover:bg-zinc-600 font-semibold transition-all"
        >
          Cancelar
        </Dialog.Close>

        <button disabled={isLoading} type="submit">
          {isLoading ? (
            <div className="bg-green-600 w-56 justify-center gap-2 flex rounded-lg p-4 transition-all items-center font-semibold hover:bg-green-700">
              <Loading size={40} />
            </div>
          ) : (
            <div className="bg-green-600 w-56 justify-center gap-2 text-white flex rounded-lg p-4 transition-all items-center font-semibold hover:bg-green-700">
              <span>Criar Tarefa</span>
            </div>
          )}
        </button>
      </footer>
    </form>
  );
}

export default CreateTaskForm;

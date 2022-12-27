import { useState } from "react";
import { CreateComment } from "../utils/createCommenteFetchParams";
import { TaskCommentsProps } from "../utils/interfaces";
import * as Dialog from "@radix-ui/react-dialog";
import { Loading } from "./Loading";

function Comments(props: {
  currentComments: TaskCommentsProps[];
  setCurrentComments: Function;
  currentItemId: string;
  setOpenDialog: Function;
}) {
  let [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");

  return (
    <div className="flex flex-col">
      <form
        onSubmit={(e) => {
          setIsLoading(true);
          e.preventDefault();
          fetch(
            "http://localhost:3333/CreateComment",
            CreateComment(content, props.currentItemId)
          ).then((res) => {
            res.json().then((data) => {
              let aux: any[] = [...props.currentComments];
              aux.push(data);
              props.setCurrentComments(aux);
            });
          });
          setTimeout(() => {
            alert("Tarefa Criada com Sucesso!");
            setIsLoading(false);
            props.setOpenDialog(false);
          }, 500);
        }}
      >
        <div className="flex flex-col justify-center mb-4">
          <label htmlFor="nick" className="font-semibold mb-2">
            Conteúdo do comentário
          </label>
          <input
            name="nick"
            className="bg-[#D0D3D4] py-3 px-4 border-zinc-500 placeholder:text-zinc-500 text-[14px] rounded-lg"
            id="nick"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
            placeholder="Digite o comentário..."
          />
        </div>
        <footer className="flex justify-end gap-6 mt-4 mb-4">
          <Dialog.Close
            type="button"
            className="bg-zinc-400 rounded-lg p-4 hover:bg-zinc-600 font-semibold transition-all"
          >
            Cancelar
          </Dialog.Close>

          <button disabled={isLoading} type="submit">
            {isLoading ? (
              <div className="bg-green-600 w-56 h-14 justify-center gap-2 flex rounded-lg p-4 transition-all items-center font-semibold hover:bg-green-700">
                <Loading size={40} />
              </div>
            ) : (
              <div className="bg-green-600 w-56 h-14 justify-center gap-2 text-white flex rounded-lg p-4 transition-all items-center font-semibold hover:bg-green-700">
                <span>Enviar Comentário</span>
              </div>
            )}
          </button>
        </footer>
      </form>

      <div className="bg-[#D0D3D4] overflow-y-scroll max-h-[500px] rounded-xl p-4 m-auto w-full">
        <h1 className="text-2xl text-slate-700">Comentários</h1>
        <div className="mt-4 ">
          {props.currentComments.map((comment) => (
            <div className="p-4 mb-3 rounded-lg bg-white">
              {comment.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Comments;

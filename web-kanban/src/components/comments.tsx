import { useEffect, useState } from "react";
import { CreateComment } from "../utils/createCommenteFetchParams";
import { TaskCommentsProps } from "../utils/interfaces";
import * as Dialog from "@radix-ui/react-dialog";
import { Loading } from "./Loading";
import { X } from "phosphor-react";

function Comments(props: {
  currentComments: TaskCommentsProps[];
  comments: TaskCommentsProps[];
  setComments: Function;
  setCurrentComments: Function;
  currentItemId: string;
  setx: Function;
  x: number;
  setLoading: Function;
  loading: boolean;
}) {
  let [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [aux1, setAux] = useState(Array<TaskCommentsProps>);

  const [x, setx] = useState(0);

  const [currentComment, setCurrentComment] = useState("");
  console.log(props.currentComments, currentComment);
  return (
    <div className="flex flex-col">
      <form
        onSubmit={(e) => {
          props.setLoading(true);
          setIsLoading(true);
          e.preventDefault();
          fetch(
            `${import.meta.env.VITE_API_URL}/CreateComment`,
            CreateComment(content, props.currentItemId)
          ).then((res) => {
            res.json().then((data) => {
              let aux: any[] = [...props.currentComments];
              aux.push(data);
              props.setCurrentComments(aux);
              props.setLoading(false);
              props.setx(props.x + 1);
            });
          });
          setTimeout(() => {
            alert("Comentário Criado com Sucesso!");
            setIsLoading(false);
          }, 500);
          setContent("");
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
          {props.currentComments.map((comment: TaskCommentsProps) => (
            <div
              onMouseEnter={() => {
                setCurrentComment(comment.id);
              }}
              onFocus={() => {
                setCurrentComment(comment.id);
              }}
              className="p-4 flex justify-between mb-3 rounded-lg bg-white"
            >
              {comment.content}

              <X
                size={24}
                onClick={async () => {
                  props.setLoading(true);
                  console.log(comment);
                  let aux: TaskCommentsProps[] = JSON.parse(
                    JSON.stringify(props.comments)
                  );
                  let aux2: TaskCommentsProps[] = JSON.parse(
                    JSON.stringify(props.currentComments)
                  );
                  fetch(`${import.meta.env.VITE_API_URL}/deleteComment`, {
                    method: "DELETE",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(comment),
                  }).then((res) => {
                    // Ajustando os index's dos elementos quando são excluidos
                    for (let comment1 in aux) {
                      if (aux[comment1].id === comment.id) {
                        aux.splice(aux.indexOf(aux[comment1]), 1);
                      }
                    }
                    for (let comment1 in aux2) {
                      if (aux2[comment1].id === currentComment) {
                        aux2.splice(aux2.indexOf(aux2[comment1]), 1);
                      }
                    }
                    props.setComments(aux);
                    props.setCurrentComments(aux2);
                    console.log(aux2);

                    props.setLoading(false);
                  });
                  setx(x + 1);
                }}
                className={
                  comment.id == currentComment
                    ? `text-red-500 transition-all z-10 cursor-pointer`
                    : "text-transparent  transition-all z-10 cursor-pointer"
                }
                weight="bold"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Comments;

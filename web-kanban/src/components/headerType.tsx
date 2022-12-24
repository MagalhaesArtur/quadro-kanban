import { TypeProps } from "../utils/interfaces";
import Button from "@mui/material/Button";
import PlaylistAddSharpIcon from "@mui/icons-material/PlaylistAddSharp";
import * as Dialog from "@radix-ui/react-dialog";

function HeaderType(props: any) {
  return (
    <div className="flex justify-between bg-[#D0D3D4] font-bold rounded-t-lg p-3">
      <h1 className="text-2xl  text-slate-700">
        {props.type.type == "todo"
          ? "Para fazer"
          : props.type.type == "doing"
          ? "Fazendo"
          : props.type.type == "done"
          ? "Concluído"
          : props.type.type}
      </h1>
      <Dialog.Trigger>
        <Button
          className="!border-green-[#0e5cad] !border-[2px]"
          variant="outlined"
          startIcon={<PlaylistAddSharpIcon className="text-green-[#0e5cad]" />}
        ></Button>
      </Dialog.Trigger>
    </div>
  );
}

export default HeaderType;

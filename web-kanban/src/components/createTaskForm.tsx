import { useState } from "react";
import * as Select from "@radix-ui/react-select";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";

import "./styles/CreateTask.css";

function CreateTaskForm() {
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState(Number);
  const [typeId, setTypeId] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        setLoading(true);
        e.preventDefault();

        setContent("");
        setPriority(Number);
        setTypeId("");
        setType("");

        setLoading(false);
        setTimeout(() => {
          alert("Tarefa Criada com Sucesso!");
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
        <label htmlFor="game" className="font-semibold mb-2">
          Qual o Game?
        </label>
        <Select.Root>
          <Select.Trigger className=" SelectTrigger" aria-label="Food">
            <Select.Value placeholder="Select a fruit…" />
            <Select.Icon className="SelectIcon">
              <ChevronDownIcon />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal className="">
            <Select.Content className="!z-20  w-10 h-10 SelectContent">
              <Select.ScrollUpButton className="SelectScrollButton">
                <ChevronUpIcon />
              </Select.ScrollUpButton>
              <Select.Viewport className="!z-20 SelectViewport">
                <Select.Group>
                  <Select.Label className="SelectLabel">Fruits</Select.Label>
                  <Select.Item value="apple">Apple</Select.Item>
                  <Select.Item value="banana">Banana</Select.Item>
                  <Select.Item value="blueberry">Blueberry</Select.Item>
                  <Select.Item value="grapes">Grapes</Select.Item>
                  <Select.Item value="pineapple">Pineapple</Select.Item>
                </Select.Group>

                <Select.Separator className="SelectSeparator" />

                <Select.Group>
                  <Select.Label className="SelectLabel">
                    Vegetables
                  </Select.Label>
                  <Select.Item value="aubergine">Aubergine</Select.Item>
                  <Select.Item value="broccoli">Broccoli</Select.Item>
                  <Select.Item value="carrot" disabled>
                    Carrot
                  </Select.Item>
                  <Select.Item value="courgette">Courgette</Select.Item>
                  <Select.Item value="leek">leek</Select.Item>
                </Select.Group>

                <Select.Separator className="SelectSeparator" />

                <Select.Group>
                  <Select.Label className="SelectLabel">Meat</Select.Label>
                  <Select.Item value="beef">Beef</Select.Item>
                  <Select.Item value="chicken">Chicken</Select.Item>
                  <Select.Item value="lamb">Lamb</Select.Item>
                  <Select.Item value="pork">Pork</Select.Item>
                </Select.Group>
              </Select.Viewport>
              <Select.ScrollDownButton className="SelectScrollButton">
                <ChevronDownIcon />
              </Select.ScrollDownButton>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>
    </form>
  );
}

export default CreateTaskForm;

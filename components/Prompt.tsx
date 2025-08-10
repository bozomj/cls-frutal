import utils from "@/utils";
import { useState } from "react";
import PortalWrapper from "./PortalWrapper";

export enum TypePrompt {
  number,
  money,
  text,
}

interface PromptProps {
  msg: string;
  value: string;
  type?: TypePrompt;
  multiple?: boolean;
  confirm: (e: string | null) => void;
}

const Prompt: React.FC<PromptProps> = ({
  msg,
  value,
  type = TypePrompt.text,
  multiple = false,
  confirm,
}) => {
  const [inputValue, setValue] = useState(value);

  function formate(v: string): string {
    let formated = "";
    switch (type) {
      case TypePrompt.number:
        break;
      case TypePrompt.money:
        formated = utils.formatarMoeda(v);
        break;

      default:
        formated = v;
        break;
    }

    return formated;
  }

  return (
    <PortalWrapper>
      <div
        className={`absolute bg-gray-900/80 h-[100vh] w-full left-0 top-0 z-[9] flex justify-center items-center `}
        onClick={() => {
          confirm(value);
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-cyan-950 rounded m-4 p-2 w-full flex flex-col justify-between items-center text-white 
        md:w-[40rem]
        "
        >
          <div className="font-bold self-start pl-2 text-2xl">{msg}</div>
          <div className="flex gap-2 justify-between flex-1 w-full items-center">
            {!multiple ? (
              <input
                type="text"
                value={inputValue}
                className="bg-white text-gray-900 flex-1 p-2 m-2 outline-0"
                onChange={(e) => {
                  const txt = formate(e.target.value);

                  setValue(txt);
                }}
              />
            ) : (
              <textarea
                value={inputValue}
                rows={3}
                className="bg-white text-gray-900 flex-1 p-2 m-2 outline-0"
                onChange={(e) => {
                  const txt = formate(e.target.value);
                  setValue(txt);
                }}
              />
            )}

            <button
              className="bg-green-800 py-2 px-4 rounded-lg h-fit"
              onClick={() => {
                const txt = inputValue == "" ? value : inputValue;
                confirm(txt);
              }}
            >
              Ok
            </button>
          </div>
        </div>
      </div>
    </PortalWrapper>
  );
};

export default Prompt;

// use stopPropagation() para impedir o click se propagar para os intens externos

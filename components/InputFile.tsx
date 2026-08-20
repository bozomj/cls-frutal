import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent } from "react";
import LinearProgressIndicator from "./LinearProgressIndicator";

interface InputFileProps {
  onClick?: (e: ChangeEvent<HTMLInputElement>) => void;
  icon?: IconProp;
  className?: string;
}

const InputFile: React.FC<InputFileProps> = ({ icon, onClick, className }) => {
  return (
    <label
      className={`flex btn w-1/4 text-cyan-600 min-h-5 border-dotted border-3 border-cyan-600 bg-cyan-100 justify-center items-center  text-center ${className}`}
    >
      <FontAwesomeIcon icon={icon ?? faAdd} />
      <input
        type="file"
        className="hidden"
        accept="image/*"
        multiple={true}
        max={3}
        onChange={onClick}
      />
    </label>
  );
};

export default InputFile;

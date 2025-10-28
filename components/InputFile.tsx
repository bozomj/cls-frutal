import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent } from "react";

interface InputFileProps {
  onClick?: (e: ChangeEvent<HTMLInputElement>) => void;
  icon?: IconProp;
  className?: string;
}

const InputFile: React.FC<InputFileProps> = ({ icon, onClick, className }) => {
  return (
    <label className={`btn btn-primary gap-2 mt-4 ${className}`}>
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

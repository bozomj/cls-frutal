import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface IconButtonProps {
  onClick?: () => void;
  icon: IconProp;
  className?: string;
}

function IconButton({ onClick, icon, className }: IconButtonProps) {
  return (
    <button onClick={onClick} className={`cursor-pointer ${className}`}>
      <FontAwesomeIcon icon={icon} />
    </button>
  );
}

export default IconButton;

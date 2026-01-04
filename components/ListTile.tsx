import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ListTile = ({
  title,
  icon,
  url,
  className,
  onClick,
}: {
  title: string;
  icon?: IconProp;
  url?: string;
  className?: string;
  onClick: () => void;
}) => {
  return (
    <div
      className={`flex items-center gap-2 p-3  hover:text-cyan-500 ${className} `}
      onClick={onClick}
    >
      <a
        href={url ?? "#"}
        className="flex gap-3 items-center cursor-pointer w-full select-none no-drag"
      >
        <span>
          {icon != null ? (
            <FontAwesomeIcon icon={icon} className="text-2xl w-8 select-none" />
          ) : (
            <></>
          )}
        </span>

        <span className="select-none">{title}</span>
      </a>
    </div>
  );
};

export default ListTile;

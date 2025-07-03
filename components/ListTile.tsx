import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ListTile = ({
  title,
  icon,
  url,
  onClick,
}: {
  title: string;
  icon?: IconProp;
  url?: string;
  onClick: () => void;
}) => {
  return (
    <div
      className="flex items-center gap-2 p-3 cursor-pointer hover:text-cyan-500"
      onClick={onClick}
    >
      <span>
        <FontAwesomeIcon icon={icon!} className="text-3xl" />
      </span>
      <span
        tabIndex={0}
        className=" group-focus:block whitespace-nowrap group-focus:opacity-100 transition-all duration-500 group-hover:opacity-100 opacity-0"
      >
        {url ? <a href={url || ""}>{title}</a> : title}
      </span>
    </div>
  );
};

export default ListTile;

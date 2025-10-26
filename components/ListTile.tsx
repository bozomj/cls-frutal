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
      className={`flex items-center gap-2 p-3  hover:text-cyan-500 ${className}`}
      onClick={onClick}
    >
      <a
        href={url ?? "#"}
        className="flex gap-2 items-center cursor-pointer w-full"
      >
        <span>
          <FontAwesomeIcon
            icon={icon!}
            className="text-3xl transition-all duration-500"
          />
        </span>
        <span
          tabIndex={0}
          className=" group-focus:block whitespace-nowrap group-focus:opacity-100 transition-all duration-500 group-hover:opacity-100 opacity-0
        md:opacity-100
        "
        ></span>
        {title}
      </a>
    </div>
  );
};

export default ListTile;

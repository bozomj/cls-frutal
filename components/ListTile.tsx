import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ListTile = ({
  title,
  icon,
  onClick,
}: {
  title: string;
  icon: any;
  onClick: () => void;
}) => {
  return (
    <div
      className="flex items-center gap-2 p-3 cursor-pointer"
      onClick={onClick}
    >
      <span>
        <FontAwesomeIcon icon={icon} className="text-2xl" />
      </span>
      <span
        tabIndex={0}
        className="opacity-0 group-focus:block whitespace-nowrap group-focus:opacity-100 transition-all duration-500 group-hover:opacity-100"
      >
        {title}
      </span>
    </div>
  );
};

export default ListTile;

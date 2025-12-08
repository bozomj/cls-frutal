import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface CircleAvatarProps {
  imagem?: string;
  size?: number;
  className?: string;
}

const CircleAvatar: React.FC<CircleAvatarProps> = ({
  imagem,
  size = 10,
  className,
}) => {
  return imagem ? (
    <div
      className={`
        block
        rounded-full
        bg-center bg-cover
        outline-2  outline-white
        bg-cyan-950/70
        ${className}
    `}
      style={{
        width: `${size}rem`,
        height: `${size}rem`,
        backgroundImage: `url(${imagem})`,
      }}
    ></div>
  ) : (
    <FontAwesomeIcon
      icon={faUser}
      className="text-2xl rounded-full p-2 w-6  bg-gray-400 flex items-center justify-center cursor-pointer text-gray-300 hover:bg-gray-600 transition duration-200 "
    />
  );
};

export default CircleAvatar;

// use stopPropagation() para impedir o click se propagar para os intens externos

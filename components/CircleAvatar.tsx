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
    <span
      className={`rounded-full bg-gray-400 flex items-center justify-center cursor-pointer text-gray-300 hover:bg-gray-600 transition duration-200 `}
      style={{
        width: `${size + 2}rem`,
        height: `${size + 2}rem`,
      }}
    >
      <FontAwesomeIcon
        icon={faUser}
        style={{
          width: `${size}rem`,
          height: `${size}rem`,
        }}
      />
    </span>
  );
};

export default CircleAvatar;

// use stopPropagation() para impedir o click se propagar para os intens externos

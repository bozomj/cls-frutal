import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

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
  return (
    <div
      className={`
        rounded-full
        bg-center bg-cover
        flex justify-center items-center
        outline-2  outline-white
        bg-cyan-950/70
        relative
        overflow-hidden
        ${className}
    `}
      style={{
        width: `${size}rem`,
        height: `${size}rem`,
      }}
    >
      {imagem ? (
        <Image src={imagem ?? ""} fill alt="" />
      ) : (
        <FontAwesomeIcon
          className="text-white"
          icon={faUser}
          style={{
            width: `${size * 0.7}rem`,
            height: `${size * 0.7}rem`,
          }}
        />
      )}
    </div>
  );
};

export default CircleAvatar;

// use stopPropagation() para impedir o click se propagar para os intens externos

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
  );
};

export default CircleAvatar;

// use stopPropagation() para impedir o click se propagar para os intens externos

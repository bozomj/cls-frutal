interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }: CardProps) => {
  return (
    <div
      className={` gap-2 mi-w-[8rem] max-w-[12rem] flex flex-col  p-2 rounded-lg justify-center items-center ${className} `}
    >
      {children}
    </div>
  );
};

export default Card;

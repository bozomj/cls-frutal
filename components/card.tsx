interface CardProps {
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <div className="  min-h-[8rem] gap-2 mi-w-[8rem] max-w-[12rem] flex flex-col bg-cyan-950 p-2 rounded-lg justify-center items-center">
      {children}
    </div>
  );
};

export default Card;

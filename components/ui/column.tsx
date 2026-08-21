interface ColumnProps {
  id?: string;
  children?: React.ReactNode;
  className?: string;
}

const Column: React.FC<ColumnProps> = ({ children, className, id }) => {
  return (
    <div id={id} className={`flex-col flex gap-2 justify-between ${className}`}>
      {children}
    </div>
  );
};

export default Column;

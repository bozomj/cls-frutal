interface ColumnProps {
  id?: string;
  children?: React.ReactNode;
  className?: string;
}

const Column: React.FC<ColumnProps> = ({ children, className, id }) => {
  return (
    <div id={id} className={`flex-col flex ${className}`}>
      {children}
    </div>
  );
};

export default Column;

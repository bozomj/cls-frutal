interface RowProps {
  children?: React.ReactNode;
  className?: string;
}

const Row: React.FC<RowProps> = ({ children, className }) => {
  return (
    <div className={`flex gap-2 items-center ${className}`}>{children}</div>
  );
};

export default Row;

interface FileButtonProps {
  children?: React.ReactNode;
  className?: string;
  size?: number;
  onClick?: (e: any) => void | Promise<any>;
}

const FileButton: React.FC<FileButtonProps> = ({
  children,
  onClick,
  size = 5,
  className,
}) => {
  return (
    <label
      style={{ height: size * 10, width: size * 10 }}
      className={`flex items-center justify-center rounded-full cursor-pointer  ${className}`}
    >
      {children}
      <input type="file" className="hidden" onChange={onClick} />
    </label>
  );
};

export default FileButton;

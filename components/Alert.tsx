interface AlertProps {
  msg: string;
  show?: boolean;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ msg, onClose }) => {
  // const shw = show ? "block" : "hidden";
  setTimeout(onClose, 1500);
  return (
    <div
      className={`absolute bg-gray-300/80 h-[100vh] w-full top-0 z-[9] flex justify-center items-center `}
      onClick={() => {
        onClose();
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-cyan-950 rounded m-4 p-2 w-full flex justify-between items-center text-white "
      >
        <div>{msg}</div>
        <div className="flex gap-2 justify-end">
          <button
            className="bg-green-800 py-2 px-4 rounded-lg"
            onClick={() => {
              onClose();
            }}
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alert;

// use stopPropagation() para impedir o click se propagar para os intens externos

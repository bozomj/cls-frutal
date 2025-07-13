interface ModalProps {
  children?: React.ReactNode;
  show?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({
  children,
  onConfirm,
  show,
  onClose,
}) => {
  const shw = show ? "block" : "hidden";
  return (
    <div
      className={`absolute bg-gray-300/50 h-full w-full top-0 z-[9] flex justify-center items-center ${shw}`}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-cyan-900 rounded m-4 p-2 w-full"
      >
        <div className="p-2">{children}</div>
        <div className="flex gap-2 justify-end">
          <button className="bg-orange-800 p-2 rounded-lg" onClick={onClose}>
            Cancelar
          </button>
          <button className="bg-green-800 p-2 rounded-lg" onClick={onConfirm}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

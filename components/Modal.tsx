import { ButtonPrimary } from "./ui/Buttons";
import PortalWrapper from "./PortalWrapper";

interface ModalProps {
  children?: React.ReactNode;
  className?: string;
  onConfirm: () => void;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({
  children,
  className,

  onConfirm,
  onClose,
}) => {
  return (
    <PortalWrapper>
      {
        <div
          className={`fixed left-0 top-0 bg-gray-950/50 h-full w-full  z-[9999] flex justify-center items-center  ${className}`}
          onClick={onClose}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-cyan-900 rounded  p-2 w-full md:w-[40rem]"
          >
            <div className="p-2">{children}</div>
            <div className="flex gap-2 justify-end">
              <button
                className="bg-orange-800 p-2 rounded-lg cursor-pointer"
                onClick={() => {
                  onClose();
                }}
              >
                Cancelar
              </button>
              <button
                className="bg-green-800 p-2 rounded-lg cursor-pointer"
                onClick={onConfirm}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      }
    </PortalWrapper>
  );
};

export default Modal;

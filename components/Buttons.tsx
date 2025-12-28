type ButtonsType = {
  label: string;
  onClick?: () => void;
  type?: "submit" | "reset" | "button" | undefined;
};
export function ButtonPrimary({
  label,
  onClick,
  type = undefined,
}: ButtonsType) {
  return (
    <button
      name="btn_salvar"
      onClick={onClick}
      type={type}
      className="bg-cyan-800 font-bold p-2 flex-1 rounded cursor-pointer transition duration-500 hover:bg-cyan-700"
    >
      {label}
    </button>
  );
}

export function ButtonSecondary({
  label,
  onClick,
  type = undefined,
}: ButtonsType) {
  return (
    <button
      name="btn_cancelar"
      className="text-cyan-800 font-bold p-2 outline-1  rounded cursor-pointer flex-1  hover:bg-cyan-600/10 transition duration-400 "
      type={type}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

const Buttons = {
  ButtonPrimary,
  ButtonSecondary,
};

export default Buttons;

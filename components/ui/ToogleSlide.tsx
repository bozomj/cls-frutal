type ToggleProps = {
  value: boolean;
  onChange?: (value: boolean) => void;
};

export function ToggleSlide({ value, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange?.(!value)}
      className={`
        relative w-12 h-6 rounded-full transition-colors duration-300
        ${value ? "bg-green-700" : "bg-gray-400"}
      `}
    >
      <span
        className={`
          absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full
          transition-transform duration-300
          ${value ? "translate-x-6" : "translate-x-0"}
        `}
      />
    </button>
  );
}

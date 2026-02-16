import { useState } from "react";

type ToggleProps = {
  value: boolean;
  onChange?: (value: boolean) => void | Promise<void>;
};

export function ToggleSlide({ value, onChange }: ToggleProps) {
  const [isLoading, setIsloading] = useState(false);
  return (
    <button
      onClick={async () => {
        setIsloading(true);

        await onChange?.(!value);
        setIsloading(false);
      }}
      className={`
        relative w-12 h-6 rounded-full transition-colors duration-300
        ${value ? "bg-green-700" : "bg-gray-400"}
      `}
    >
      <span
        className={`
        absolute top-0.5 left-0.5 w-5 h-5 rounded-full
        flex items-center justify-center
        transition-transform duration-300
        ${value ? "translate-x-6" : "translate-x-0"}
      `}
      >
        {isLoading ? (
          <div
            className={`w-4 h-4 border-4 border-dashed ${!value ? "border-green-700" : "border-green-300"} rounded-full animate-spin`}
          />
        ) : (
          <div className="w-5 h-5 bg-white rounded-full" />
        )}
      </span>
    </button>
  );
}

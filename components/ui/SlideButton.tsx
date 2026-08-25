import { useState } from "react";

type ToggleProps = {
  value?: boolean;
  onChange?: (value: boolean) => void | Promise<void>;
  className?: string;
};

export function SlideButton({
  value = false,
  onChange,
  className,
}: ToggleProps) {
  const [isLoading, setIsloading] = useState(false);
  const [v, setV] = useState(value);

  const [borderColor, setBorderColor] = useState(value);
  return (
    <button
      onClick={async () => {
        setIsloading(true);

        await onChange?.(!v);
        setIsloading(false);

        console.log(borderColor);
      }}
      className={`
        relative h-6 rounded-full   bg-gray-400 border-gray-400 transition-colors duration-300 w-full flex items-center
        
        `}
      // ${v ? "border-green-700 " : "border-gray-400 "} ${className}
    >
      <span
        className={`
         w-6 h-6 rounded-full relative
         items-center 
        transition-[width] duration-700
        bg-green-700 border-2
         flex justify-end 
         ${v ? "w-[100%] " : "w-5 "}
         ${!v && !isLoading ? "bg-green-700/0 border-gray-400" : "border-green-700"}

      `}
        onClick={() => {
          setV(!v);
        }}
      >
        <div className="w-5 h-5  rounded-full flex justify-center ">
          {isLoading ? (
            <>
              <div
                className={`absolute w-5 h-5  border-4 border-dashed ${!v ? "border-green-200" : "border-green-300 bg-white/0"} rounded-full animate-spin ${!v ? " [animation-direction:reverse]" : " "}`}
              />
              {/* <div
                className={`w-4 h-4 self-center border-4 border-dashed ${!v ? "border-green-300" : "border-green-400 bg-white/0"} rounded-full animate-spin ${!v ? " [animation-direction:reverse]" : " "}`}
              /> */}
            </>
          ) : (
            <div className="w-5 h-5 bg-white rounded-full" />
          )}
        </div>
      </span>
    </button>
  );
}

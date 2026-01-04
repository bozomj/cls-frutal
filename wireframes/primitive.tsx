interface PrimitivePros {
  className?: string;
}

const PrimitiveWire: React.FC<PrimitivePros> = ({ className }) => {
  return (
    <>
      <style>
        {`
  @keyframes gradient-x {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
      
    }
  }

  .animate-gradient-x {
    animation: gradient-x 3s ease infinite;
  }
`}
      </style>

      <div
        className={`bg-gradient-to-r from-gray-800 via-gray-200  to-gray-800 w-full h-full
      bg-[length:200%_200%]  animate-gradient-x opacity-50  ${className}`}
      ></div>
    </>
  );
};

export default PrimitiveWire;

interface PointIndicatorProps {
  index: number;
  points: number;
}

const PointIndicator: React.FC<PointIndicatorProps> = ({ index, points }) => {
  return (
    <div className="relative">
      <div className="absolute left-0 bottom-0 overflow-hidden w-full flex justify-center gap-2 items-center px-4 py-1">
        {Array.from({ length: points }).map((_, i) => (
          <span
            key={`point-${i}`}
            className={` rounded-full shrink-0 block ${
              index === i ? "bg-cyan-600/80 w-3 h-3" : `bg-gray-100/60 w-2 h-2 `
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default PointIndicator;

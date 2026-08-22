function HorizontalDivider({
  size = 1,
  className,
  isent = 0,
}: {
  size?: number;
  className?: string;
  isent?: number;
}) {
  return (
    <div
      style={{ width: size, marginBlock: isent }}
      className={`self-stretch `}
    >
      <span
        className={`${className} h-full border-1 bg-gray-200 border-gray-200 block `}
      ></span>
    </div>
  );
}

export default HorizontalDivider;

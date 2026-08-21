function HorizontalDivider({
  size = 1,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      style={{ width: size }}
      className={`${className} self-stretch border-1 bg-gray-200 border-gray-200 block `}
    ></div>
  );
}

export default HorizontalDivider;

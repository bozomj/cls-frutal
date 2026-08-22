function VerticalDivider({
  height,
  className,
  isent = 0,
}: {
  height: number;
  className?: string;
  isent?: number;
}) {
  return (
    <div className={`w-full ${className}`} style={{ paddingInline: isent }}>
      <span
        style={{ height }}
        className={`rounded-3xl w-full bg-slate-300 block `}
      ></span>
    </div>
  );
}

export default VerticalDivider;

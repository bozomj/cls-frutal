function VerticalDivider({
  height,
  className,
}: {
  height: number;
  className?: string;
}) {
  return (
    <div className={`${className}`}>
      <span
        style={{ height }}
        className={`rounded-3xl w-full bg-slate-300 block `}
      ></span>
    </div>
  );
}

export default VerticalDivider;

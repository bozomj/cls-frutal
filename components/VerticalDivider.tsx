function VerticalDivider({ height }: { height: number }) {
  return (
    <span
      style={{ height }}
      className={`rounded-3xl w-full bg-slate-300 block`}
    ></span>
  );
}

export default VerticalDivider;

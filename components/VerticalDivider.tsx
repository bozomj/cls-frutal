function VerticalDivider({ height }: { height: number }) {
  return (
    <span
      style={{ height }}
      className={`rounded-3xl w-full bg-gray-400 block`}
    ></span>
  );
}

export default VerticalDivider;

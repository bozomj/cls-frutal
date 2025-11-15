function VerticalDivider({ height }: { height: number }) {
  return (
    <span
      style={{ height }}
      className={`rounded-3xl w-full bg-gray-200`}
    ></span>
  );
}

export default VerticalDivider;

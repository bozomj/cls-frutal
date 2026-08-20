export default function LinearProgressIndicator({
  className,
  legend,
}: {
  className?: string;
  legend?: string;
}) {
  return (
    <div
      className={`min-h-2 w-full flex items-center rounded bg-cyan-800 overflow-hidden relative ${className} `}
    >
      <div className="absolute w-full min-h-2 h-full bg-cyan-500 transform origin-left animate-loading"></div>
      <span className="absolute w-full left-0">{legend}</span>
    </div>
  );
}

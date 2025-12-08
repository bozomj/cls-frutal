export default function LinearProgressIndicator() {
  return (
    <div className="h-2 w-full rounded bg-cyan-800 overflow-hidden">
      <div className="w-full h-full bg-cyan-500 transform origin-left animate-loading"></div>
    </div>
  );
}

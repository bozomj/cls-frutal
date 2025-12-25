export default function FooterLayout() {
  return (
    <footer className="min-h-[10rem] min-w-full bg-cyan-950 p-4 flex flex-col">
      <span className="text-center text-gray-50">
        CLF-Frutal Classificados &copy;
      </span>
      <div className="flex-1 flex items-center">
        <a href="https://www.assistechso.com.br" target="_blank">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="w-[150px] md:w-[200px]"
            src="https://www.assistechso.com.br/_next/image?url=%2Fimg%2Flogo.png&w=256&q=75"
            alt=""
          />
        </a>
      </div>
    </footer>
  );
}

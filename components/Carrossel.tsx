import { useEffect, useRef, useState } from "react";

interface CarrosselProps {
  imagens: Record<string, string>[];
}

const Carrossel: React.FC<CarrosselProps> = ({ imagens }) => {
  const [imgs, setImgs] = useState(imagens);
  const carrosselref = useRef<HTMLDivElement | null>(null);

  async function changeImagem() {
    setImgs((prev) => {
      return [...prev.slice(1), prev[0]];
    });
    carrosselref.current?.children[0].classList.toggle("w-full");
  }

  useEffect(() => {
    function translate() {
      if (imgs.length <= 1) return;
      setTimeout(() => {
        carrosselref.current?.children[0].classList.toggle("w-full");
        carrosselref.current?.children[0].classList.add("w-0");
      }, 1500);
    }
    translate();
  }, [imgs]);
  return (
    <div
      ref={carrosselref}
      onTransitionEnd={async () => {
        await changeImagem();
      }}
      className="flex w-[100%] overflow-hidden h-[150px] "
    >
      {imgs.map((e) => {
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={e.src}
            src={e.src}
            alt=""
            className="transition-all duration-700 flex-shrink-0 w-full "
          />
        );
      })}
    </div>
  );
};

export default Carrossel;

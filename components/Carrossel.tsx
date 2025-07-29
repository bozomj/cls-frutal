import { useEffect, useRef, useState } from "react";

interface CarrosselProps {
  imagens: Record<string, string>[];
  speed: number;
  className?: string;
}

/**
 *
 * @param imagens Lista de array {src: string}
 * @param speed Numero em segundos /[ vai ser multiplicado por 1000 - milesegundos ]/
 * @returns
 */
const Carrossel: React.FC<CarrosselProps> = ({ imagens, speed, className }) => {
  //repete o primeiro item para o ultimo, melor funcionamento
  const imgs = [...imagens, imagens[0]];

  function multiplicador(n: number, fator = 1000) {
    return n * fator;
  }
  const [velocidade, setSpeed] = useState(multiplicador(speed));
  const carrosselref = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(1);

  function animar() {
    if (index < imgs.length - 1) {
      setSpeed(multiplicador(speed));
      setIndex((p) => p + 1);
      carrosselref.current!.style.transition = "transform 0.7s ease";
    } else {
      setIndex(0);
      setSpeed(multiplicador(0.01));
      carrosselref.current!.style.transition = "none";
      carrosselref.current!.style.transform = `translateX(0)`;

      void carrosselref.current!.offsetWidth;
      carrosselref.current!.style.transition = "transform 0.05s ease";
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (carrosselref != null)
        carrosselref.current!.style.transform = `translateX(-${100 * index}%)`;
    }, velocidade);

    return () => {
      clearTimeout(timeout);
    };
  }, [index, velocidade]);

  function gerador() {
    return imgs.map((e, i) => {
      if (i < imgs.length - 1)
        return (
          <span
            key={i}
            className={` rounded-full shrink-0 block ${
              index == i + 1
                ? "bg-cyan-600/80 w-4 h-4"
                : `bg-gray-100/60 w-3 h-3 ]`
            }`}
          ></span>
        );
    });
  }

  return (
    <div
      onTransitionEnd={async () => {
        animar();
      }}
      className={`flex w-[100%] overflow-hidden h-[150px] relative
      md:h-[250px] ${className}`}
    >
      <div ref={carrosselref} className="flex transition-all duration-700">
        {imgs.map((e, index) => {
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={index}
              src={e.src}
              alt=""
              className="transition-all duration-700 flex-shrink-0 w-full "
            />
          );
        })}
      </div>
      <div className="absolute left-0 bottom-0 overflow-hidden w-full flex justify-center gap-2 items-center px-4 py-1">
        {gerador()}
      </div>
    </div>
  );
};

export default Carrossel;

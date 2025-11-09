import utils from "@/utils";
import { useEffect, useRef, useState } from "react";
import PointIndicator from "./PointIndicator";

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
  //repete o primeiro item para o ultimo, melhor funcionamento
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
  }, [index, velocidade, imagens]);

  return (
    <div
      onTransitionEnd={() => animar()}
      className={`flex w-[100%] overflow-hidden h-[150px] relative
      md:h-[250px] ${className}`}
    >
      <span
        className="absolute bg-red-800/50 h-full w-10 left-0 z-[10]"
        onClick={() => {}}
      >
        botao 1
      </span>
      <div ref={carrosselref} className="flex transition-all duration-700">
        {
          /* {(imgs.length > 0 || imgs.length != null) ?? */
          imgs.map((e, index) => {
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={index}
                src={utils.getUrlImage(e?.url)}
                alt=""
                className="transition-all duration-700 flex-shrink-0 w-full "
              />
            );
          })
        }
      </div>
      <span className="absolute bg-red-800/50 h-full w-10 right-0 z-[10]">
        botao 2
      </span>
      <PointIndicator index={index - 1} points={imgs.length - 1} />
    </div>
  );
};

export default Carrossel;

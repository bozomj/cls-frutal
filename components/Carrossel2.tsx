import { useEffect, useRef, useState } from "react";

interface Carrossel2Props {
  imagens: Record<string, string>[];
  speed: number;
}

/**
 *
 * @param imagens Lista de array {src: string}
 * @param speed Numero em segundos /[ vai ser multiplicado por 1000 - milesegundos ]/
 * @returns
 */
const Carrossel2: React.FC<Carrossel2Props> = ({ imagens, speed }) => {
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
    setTimeout(() => {
      carrosselref.current!.style.transform = `translateX(-${100 * index}%)`;
    }, velocidade);
  });

  return (
    <div
      onTransitionEnd={async () => {
        animar();
      }}
      className="flex w-[100%] overflow-hidden h-[150px] "
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
    </div>
  );
};

export default Carrossel2;

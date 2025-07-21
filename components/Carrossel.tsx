import { useEffect, useState } from "react";

interface CarrosselProps {
  imagens: Record<string, string>[];
}

const Carrossel: React.FC<CarrosselProps> = ({ imagens }) => {
  const [imgs, setImgs] = useState(imagens);

  async function changeImagem() {
    setImgs((prev) => {
      return [...prev.slice(1), prev[0]];
    });
    console.log(">>");
  }

  function trasnslate() {
    setInterval(() => {
      const crl = document.getElementById("crl");
      crl?.children[0].classList.toggle("w-full");
      crl?.children[0].classList.add("w-0");
    }, 1500);
  }

  useEffect(() => {
    trasnslate();
  }, []);

  return (
    <div
      id="crl"
      onTransitionEnd={async () => {
        await changeImagem();
        const crl = document.getElementById("crl");
        crl?.children[0].classList.toggle("w-full");

        console.log(imgs);
      }}
      className="flex w-[100%] overflow-hidden h-[150px] justify-stretch "
    >
      {...imgs.map((e) => {
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

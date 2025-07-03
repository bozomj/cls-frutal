import Header from "@/components/Header";
import Produtos from "@/layout/produtos/Produtos";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons/faWhatsapp";
import { faPhone } from "@fortawesome/free-solid-svg-icons/faPhone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

interface HomeProps {
  title?: string;
}

const Home: React.FC<HomeProps> = () => {
  const imgs = [
    {
      link: "https://m.media-amazon.com/images/I/51JtliveScL._SR480,440_.jpg",
      description: "Batman: Urban Legends (2021-) Vol. 1 (English Edition) ",
      value: 96.53,
      contato: 34997668902,
    },
    {
      link: "https://m.media-amazon.com/images/I/41xt3WmyP3L._SR480,440_.jpg",
      description:
        "Zatanna by Paul Dini (2024 Edition) (Zatanna (2010-2011)) (English Edition)",
      value: 199.0,
    },
    {
      link: "https://m.media-amazon.com/images/I/51PsNE6TjjL._SR480,440_.jpg",
      description: "1984 em quadrinhos - HQ ",
      value: 64.9,
    },
    {
      link: "https://m.media-amazon.com/images/I/51-Nw2f5v8L._SR480,440_.jpg",
      description: "A Torre do Elefante (Graphic novel - Volume único)",
      value: 55.93,
    },
    {
      link: "https://m.media-amazon.com/images/I/51bTFuqIdqL._SR480,440_.jpg",
      description: "O Rei de Amarelo – HQ",
      value: 66,
    },
    {
      link: "https://m.media-amazon.com/images/I/51YV2ODVOEL._SR480,440_.jpg",
      description: "O livro da política",
      value: 60.07,
    },
    {
      link: "https://m.media-amazon.com/images/I/41TohBVA+oL._AC_SY300_SX300_.jpg",
      description: `Samsung Celular Galaxy S24 FE 5G 128GB 8GB RAM Tela 6.7" Galaxy AI (Grafite)`,
      value: 2799,
    },
  ];

  const [search, setSearch] = useState("");

  const imgss = imgs.map((item, v) => {
    return (
      <div
        key={v}
        className=" md:max-w-[250px] bg-gray-100  md:min-w-[250px] min-w-full p-2 rounded-2xl flex justify-center"
      >
        <div className="flex flex-col w-full overflow-hidden h-full gap-2 ">
          <span
            className="flex-1  block bg-contain bg-no-repeat bg-center  bg-gray-200 rounded-2xl min-h-[250px]"
            style={{
              backgroundImage: `url(${item.link})`,
            }}
          ></span>

          <div className=" flex text-gray-900 gap-2 w-[100%] truncate overflow-hidden flex-col">
            <span className="h-5 block">{item.description ?? ""}</span>
            <span className="h-5 block">R$: {item.value?.toFixed(2)}</span>
            <div className=" flex items-center gap-4">
              <a
                href={`https://wa.me/55${item.contato}?text=[Classificados Frutal] - fiquei interessado em seu produto \n`}
                target="_blank"
              >
                <FontAwesomeIcon
                  icon={faWhatsapp}
                  className="text-3xl text-green-900"
                />
              </a>
              <a href="#">
                <FontAwesomeIcon
                  icon={faPhone}
                  className="text-1xl text-blue-500"
                />
                {` ${item.contato}`}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  });

  return (
    <>
      <header className="">
        <Header
          onSubmit={async (e) => {
            // const result = await fetch("/api/v1/posts?search=" + e);
            // const posts = await result.json();
            // console.log(posts);
            setSearch(e);
          }}
        />
      </header>
      <main className="flex-auto overflow-y-scroll bg-gray-300 flex-col flex justify-between gap-2 items-center">
        <div className="md:max-w-[100rem] w-full">
          <img
            src={
              "https://m.media-amazon.com/images/G/32/kindle/email/2025/03_Marco/Pagina_Recomendacoes_para_voce/1500x200_Narrow.jpg"
            }
            alt={""}
          />
          <Produtos pesquisa={search.trim()} />
          {/* <section className="flex  flex-wrap bg-gray-50 p-4 gap-4 justify-center ">
            {...imgss}
          </section> */}
        </div>
        <footer className="min-h-[10rem] min-w-full bg-cyan-950 p-4">
          CLF-Frutal Classificados &copy;
          <img
            src="https://www.assistechso.com.br/_next/image?url=%2Fimg%2Flogo.png&w=256&q=75"
            alt=""
          />
        </footer>
      </main>
    </>
  );
};

export default Home;
